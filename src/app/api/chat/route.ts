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
    const { message, abogadoId, tipo } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Mensaje requerido" }, { status: 400 });
    }

    // Tipo "publica" = IA del landing (sin contexto de abogado)
    // Tipo "privada" = IA del ERP (con contexto del abogado)
    if (tipo === "publica") {
      return handleChatPublico(message);
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

async function handleChatPublico(message: string) {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `Sos el asistente virtual de Burgos & Asociados, un estudio jurídico de Buenos Aires, Argentina.

REGLAS ESTRICTAS:
- Respondé SOLO sobre el estudio: horarios (Lun-Vie 9-18hs), ubicación (Av. Corrientes 1234, Piso 8, CABA), áreas de práctica, y cómo solicitar un turno.
- NO des asesoría legal bajo ninguna circunstancia.
- Si preguntan algo legal específico, decí: "Para consultas legales específicas, te recomiendo reservar un turno con uno de nuestros profesionales."
- Respuestas CORTAS: máximo 3-4 líneas.
- Tono: profesional, cordial, argentino (vos/tuteo).
- Áreas: Civil, Comercial, Laboral, Penal, Familia, Administrativo, Societario.
- Para turnos: pedí nombre, DNI, motivo y horario preferido.`,
      },
      { role: "user", content: message },
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 300,
  });

  const reply = completion.choices[0]?.message?.content || "Disculpá, no pude procesar tu consulta.";

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
