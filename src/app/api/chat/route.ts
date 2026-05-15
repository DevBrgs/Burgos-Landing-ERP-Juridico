import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";
import { rateLimit } from "@/lib/rate-limit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const { success } = rateLimit(ip, 20);
    if (!success) return NextResponse.json({ error: "Demasiadas solicitudes." }, { status: 429 });

    const { message, abogadoId, tipo, historial } = await request.json();
    if (!message) return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });

    if (tipo === "publica") return handleChatPublico(message, historial || []);
    return handleChatPrivado(message, abogadoId);
  } catch (error) {
    console.error("Error en chat:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

async function handleChatPublico(message: string, historial: { role: string; content: string }[]) {
  const supabase = getSupabase();

  const { data: abogados } = await supabase.from("abogados").select("id, nombre, especialidad, areas").eq("activo", true);
  const equipoInfo = abogados?.map(a => `- ${a.nombre}: ${a.especialidad} (${a.areas?.join(", ") || ""})`).join("\n") || "Sin abogados";

  // Fecha y día REAL
  const ahora = new Date();
  const diasSemana = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
  const diaHoy = diasSemana[ahora.getDay()];
  const fechaHoy = ahora.toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" });
  const hoyISO = ahora.toISOString().split("T")[0];

  // Turnos ocupados próximos 7 días
  const en7dias = new Date(ahora);
  en7dias.setDate(en7dias.getDate() + 7);
  const { data: turnosOcupados } = await supabase.from("turnos").select("fecha, hora, abogado_id").gte("fecha", hoyISO).lte("fecha", en7dias.toISOString().split("T")[0]).neq("estado", "cancelado");
  const ocupadosInfo = turnosOcupados?.map(t => `${t.fecha} ${t.hora}`).join(", ") || "ninguno";

  const msgs: { role: "system" | "user" | "assistant"; content: string }[] = [
    {
      role: "system",
      content: `Sos el asistente virtual de Burgos & Asociados. Estudio jurídico en Av. Corrientes 1234, Piso 8, CABA.
Horario: Lunes a Viernes 9:00-18:00. Tel: (011) 4567-8900.

HOY ES: ${diaHoy} ${fechaHoy} (${hoyISO})

EQUIPO:
${equipoInfo}

HORARIOS OCUPADOS (no ofrecer estos):
${ocupadosInfo}

FUNCIÓN: Gestionar turnos + info del estudio.

FLUJO DE TURNOS:
1. Pedí nombre, DNI y motivo
2. Sugerí abogado según área
3. Ofrecé SOLO horarios LIBRES (no los ocupados de arriba)
4. Solo Lun-Vie 9:00-18:00, cada 30 min
5. Usá la fecha de HOY (${diaHoy} ${fechaHoy}) para calcular correctamente
6. Si hoy es viernes/sábado/domingo y piden "lo más pronto", ofrecé el lunes
7. Al confirmar: decí fecha, hora, abogado y dirección
8. Cuando confirmes un turno, agregá al FINAL esta línea oculta: TURNO_CONFIRMADO|YYYY-MM-DD|HH:MM|nombre_abogado|nombre_cliente|dni|motivo

REGLAS:
- "si/dale/ok" = confirmación, avanzá
- NO inventes días. Hoy es ${diaHoy}. Mañana es ${diasSemana[(ahora.getDay() + 1) % 7]}
- Respuestas CORTAS (2-3 líneas)
- NO des asesoría legal
- Tono argentino, profesional`,
    },
  ];

  for (const msg of historial) {
    msgs.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.content });
  }
  msgs.push({ role: "user", content: message });

  const completion = await groq.chat.completions.create({ messages: msgs, model: "llama-3.1-8b-instant", temperature: 0.3, max_tokens: 300 });
  let reply = completion.choices[0]?.message?.content || "Solo puedo ayudarte con info del estudio y turnos.";

  // Detectar turno confirmado y guardarlo
  if (reply.includes("TURNO_CONFIRMADO|")) {
    const match = reply.match(/TURNO_CONFIRMADO\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)\|([^|]+)/);
    if (match) {
      const [, fecha, hora, abogadoNombre, clienteNombre, , motivo] = match;
      const abogado = abogados?.find(a => a.nombre.toLowerCase().includes((abogadoNombre || "").toLowerCase().trim().split(" ").pop() || ""));
      if (abogado) {
        await supabase.from("turnos").insert({
          abogado_id: abogado.id,
          fecha: fecha.trim(),
          hora: hora.trim() + ":00",
          motivo: (motivo || "Consulta").trim(),
          nombre_externo: (clienteNombre || "").trim(),
          origen: "ia_publica",
          estado: "pendiente",
        });
      }
    }
    reply = reply.replace(/TURNO_CONFIRMADO\|[^\n]+/g, "").trim();
  }

  return NextResponse.json({ reply });
}

async function handleChatPrivado(message: string, abogadoId: string) {
  if (!abogadoId) return NextResponse.json({ error: "abogadoId requerido" }, { status: 400 });

  const supabase = getSupabase();
  const { data: abogado } = await supabase.from("abogados").select("nombre, especialidad, areas").eq("id", abogadoId).single();

  // RAG: buscar chunks relevantes
  let contextoDocumentos = "";
  try {
    const palabras = message.toLowerCase().split(" ").filter(p => p.length > 3).slice(0, 5);
    if (palabras.length > 0) {
      const { data: chunks } = await supabase.from("chunks_ia").select("contenido").eq("abogado_id", abogadoId).textSearch("contenido", palabras.join(" | ")).limit(3);
      if (chunks && chunks.length > 0) {
        contextoDocumentos = "\n\nCONTEXTO DE TUS DOCUMENTOS:\n" + chunks.map(c => c.contenido).join("\n---\n");
      }
    }
  } catch {}

  const systemPrompt = `Asistente jurídico de Burgos & Asociados para ${abogado?.nombre || "abogado"}.
Especialidad: ${abogado?.especialidad || "General"}. Áreas: ${abogado?.areas?.join(", ") || "Varias"}.
${contextoDocumentos}

REGLAS: Solo consultas jurídicas/ERP. Sé directo. Usá terminología argentina. Citá artículos. Si no es jurídico: "Solo puedo asistirte con consultas jurídicas."`;

  const completion = await groq.chat.completions.create({
    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    max_tokens: 2000,
  });

  return NextResponse.json({ reply: completion.choices[0]?.message?.content || "Error." });
}
