import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@supabase/supabase-js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "",
});

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { message, abogadoId, tipo, historial } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    if (tipo === "publica") {
      return handleChatPublico(message, historial || []);
    }

    return handleChatPrivado(message, abogadoId);
  } catch (error) {
    console.error("Error en chat:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

async function handleChatPublico(message: string, historial: { role: string; content: string }[]) {
  const supabase = getSupabase();

  // Obtener abogados activos para contexto
  const { data: abogados } = await supabase
    .from("abogados")
    .select("id, nombre, especialidad, areas")
    .eq("activo", true);

  const equipoInfo = abogados?.map(a => `- ${a.nombre}: ${a.especialidad} (${a.areas?.join(", ") || ""})`).join("\n") || "No hay abogados registrados";

  // Construir mensajes con historial
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    {
      role: "system",
      content: `Sos el asistente virtual de Burgos & Asociados, un estudio jurídico ubicado en Av. Corrientes 1234, Piso 8, CABA, Buenos Aires, Argentina.
Horario: Lunes a Viernes de 9:00 a 18:00.
Teléfono: (011) 4567-8900.
Email: contacto@burgos.com.ar

EQUIPO DEL ESTUDIO:
${equipoInfo}

TU FUNCIÓN PRINCIPAL: Gestionar turnos y dar información del estudio.

FLUJO DE TURNOS:
1. Preguntá nombre, DNI y motivo de consulta
2. Según el motivo, sugerí el abogado más adecuado
3. Ofrecé horarios disponibles (Lun-Vie 9-18, cada 30 min)
4. Confirmá el turno con fecha, hora y abogado

REGLAS:
- Si el usuario dice "si", "sí", "dale", "ok", "bueno" → es una CONFIRMACIÓN de lo que propusiste antes. Seguí con el flujo.
- NO rechaces confirmaciones. Si propusiste algo y el usuario acepta, avanzá.
- Podés hablar sobre: ubicación, horarios, equipo, áreas, y gestionar turnos.
- NO des asesoría legal. Si preguntan algo legal, decí qué área corresponde y ofrecé turno.
- Si piden algo totalmente fuera del estudio (programar, cocinar, etc.), respondé: "Solo puedo ayudarte con información sobre Burgos & Asociados y la gestión de turnos."
- Respuestas CORTAS: 2-3 líneas máximo.
- Tono: profesional, cordial, argentino.`,
    },
  ];

  // Agregar historial de conversación
  for (const msg of historial) {
    messages.push({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    });
  }

  // Agregar mensaje actual
  messages.push({ role: "user", content: message });

  const completion = await groq.chat.completions.create({
    messages,
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 250,
  });

  const reply = completion.choices[0]?.message?.content || "Solo puedo ayudarte con información sobre Burgos & Asociados y la gestión de turnos.";

  return NextResponse.json({ reply });
}

async function handleChatPrivado(message: string, abogadoId: string) {
  if (!abogadoId) {
    return NextResponse.json({ error: "abogadoId requerido" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Obtener datos del abogado
  const { data: abogado } = await supabase
    .from("abogados")
    .select("nombre, especialidad, areas")
    .eq("id", abogadoId)
    .single();

  // TODO: Cuando implementemos pgvector, buscar chunks relevantes aquí
  // Por ahora, usamos solo el contexto del perfil del abogado

  const systemPrompt = `Sos un asistente jurídico del ERP de Burgos & Asociados. Trabajás con ${abogado?.nombre || "un abogado"}.
Especialidad: ${abogado?.especialidad || "General"}.
Áreas: ${abogado?.areas?.join(", ") || "Varias"}.

REGLAS ESTRICTAS:
- Respondé SOLO consultas relacionadas con el trabajo jurídico: análisis de casos, redacción de escritos, plazos, normativa, jurisprudencia, estrategia procesal.
- NO charlés, NO hagas small talk, NO respondas preguntas personales ni fuera del ámbito legal/ERP.
- Sé directo y conciso. Dá la respuesta justa, sin rodeos.
- Usá terminología jurídica argentina (CPCCN, CCC, LCT, CP, etc.).
- Citá artículos y normativa cuando sea relevante.
- Si no tenés información suficiente para responder, pedí los datos específicos que necesitás.
- Si la consulta no es jurídica ni relacionada al ERP, respondé: "Solo puedo asistirte con consultas jurídicas y del ERP."
- Tono: profesional, directo, sin formalidades innecesarias.`;

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    max_tokens: 2000,
  });

  const reply = completion.choices[0]?.message?.content || "No pude procesar la consulta.";

  return NextResponse.json({ reply });
}
