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
    // Múltiples fuentes de jurisprudencia argentina
    const fuentes = [
      {
        nombre: "CSJN",
        descripcion: "Corte Suprema de Justicia de la Nación",
        url: `https://sjconsulta.csjn.gov.ar/sjconsulta/documentos/verDocumentoByIdLinksJSP.html?idDocumento=&texto=${encodeURIComponent(query)}`,
        estado: "activo",
      },
      {
        nombre: "CIJ",
        descripcion: "Centro de Información Judicial",
        url: `https://www.cij.gov.ar/sentencias.html`,
        estado: "activo",
      },
      {
        nombre: "SAIJ",
        descripcion: "Sistema Argentino de Información Jurídica",
        url: `http://www.saij.gob.ar`,
        estado: "inestable",
      },
    ];

    // Usar Groq para generar un resumen orientativo sobre la búsqueda jurídica
    let resumen = "";
    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Sos un asistente jurídico argentino. El usuario busca jurisprudencia sobre un tema. 
Proporcioná un breve resumen orientativo (3-5 oraciones) sobre qué tipo de resultados podría encontrar, 
qué leyes o artículos son relevantes, y consejos para refinar la búsqueda. 
Mencioná que puede buscar en CSJN, CIJ y SAIJ.
Usá terminología jurídica argentina. Sé conciso y útil.`,
          },
          {
            role: "user",
            content: `Estoy buscando jurisprudencia sobre: "${query}". ¿Qué puedo esperar encontrar?`,
          },
        ],
        model: "llama-3.1-8b-instant",
        temperature: 0.3,
        max_tokens: 250,
      });
      resumen = completion.choices[0]?.message?.content || "";
    } catch {
      resumen = "";
    }

    return NextResponse.json({
      fuente: "Jurisprudencia Argentina",
      query,
      fuentes,
      resumen: resumen || `Buscá jurisprudencia sobre "${query}" en las fuentes oficiales disponibles.`,
      instrucciones: "Usá los enlaces para buscar en cada fuente. CSJN y CIJ funcionan correctamente. SAIJ puede estar temporalmente inestable.",
    });
  } catch {
    return NextResponse.json({
      fuente: "Jurisprudencia Argentina",
      query,
      fuentes: [
        { nombre: "CSJN", descripcion: "Corte Suprema de Justicia de la Nación", url: `https://sjconsulta.csjn.gov.ar/sjconsulta/`, estado: "activo" },
        { nombre: "CIJ", descripcion: "Centro de Información Judicial", url: `https://www.cij.gov.ar/sentencias.html`, estado: "activo" },
        { nombre: "SAIJ", descripcion: "Sistema Argentino de Información Jurídica", url: `http://www.saij.gob.ar`, estado: "inestable" },
      ],
      resumen: `Buscá jurisprudencia sobre "${query}" en las fuentes oficiales.`,
      instrucciones: "Usá los enlaces para buscar en cada fuente.",
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
