import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// API de integraciones externas: PJN, SAIJ, AFIP

// GET: Buscar en SAIJ (Sistema Argentino de Información Jurídica)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const servicio = searchParams.get("servicio"); // "saij" | "pjn"
    const query = searchParams.get("q");

    if (!servicio || !query) {
      return NextResponse.json({ error: "servicio y q requeridos" }, { status: 400 });
    }

    if (servicio === "saij") {
      return buscarSAIJ(query);
    }

    if (servicio === "pjn") {
      return consultarPJN(query);
    }

    return NextResponse.json({ error: "Servicio no soportado" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

async function buscarSAIJ(query: string) {
  try {
    const searchUrl = `http://www.saij.gob.ar/buscador/jurisprudencia?q=${encodeURIComponent(query)}`;

    // Usar Groq para generar un resumen orientativo sobre la búsqueda jurídica
    let resumen = "";
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Sos un asistente jurídico argentino. El usuario busca jurisprudencia en SAIJ sobre un tema. 
Proporcioná un breve resumen orientativo (3-5 oraciones) sobre qué tipo de resultados podría encontrar, 
qué leyes o artículos son relevantes, y consejos para refinar la búsqueda en SAIJ. 
Usá terminología jurídica argentina. Sé conciso y útil.`,
          },
          {
            role: "user",
            content: `Estoy buscando jurisprudencia sobre: "${query}". ¿Qué puedo esperar encontrar en SAIJ?`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 250,
      });
      resumen = completion.choices[0]?.message?.content || "";
    } catch {
      // Si Groq falla, seguimos sin resumen
      resumen = "";
    }

    return NextResponse.json({
      fuente: "SAIJ",
      query,
      url: searchUrl,
      resumen: resumen || `Buscá jurisprudencia sobre "${query}" directamente en SAIJ.`,
      instrucciones: "Hacé clic en el enlace para ver los resultados en el buscador de SAIJ. Podés filtrar por jurisdicción, fecha y tipo de documento.",
    });
  } catch {
    return NextResponse.json({
      fuente: "SAIJ",
      query,
      url: `http://www.saij.gob.ar/buscador/jurisprudencia?q=${encodeURIComponent(query)}`,
      resumen: `Buscá jurisprudencia sobre "${query}" directamente en SAIJ.`,
      instrucciones: "Hacé clic en el enlace para ver los resultados en el buscador de SAIJ.",
    });
  }
}

async function consultarPJN(expediente: string) {
  // PJN (Portal de Juzgados Nacionales) no tiene API pública oficial
  // Se devuelve el link directo para consulta manual
  return NextResponse.json({
    fuente: "PJN",
    expediente,
    mensaje: "Consultá el estado del expediente directamente en el Portal de Juzgados Nacionales.",
    url: `https://www.pjn.gov.ar/consultaExpedientes/?expediente=${encodeURIComponent(expediente)}`,
    nota: "La integración automática con PJN requiere credenciales del Poder Judicial. Por ahora se provee el link directo.",
  });
}
