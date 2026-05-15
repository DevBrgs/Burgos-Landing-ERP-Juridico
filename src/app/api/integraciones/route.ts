import { NextRequest, NextResponse } from "next/server";

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
    // SAIJ tiene una API pública de búsqueda
    const res = await fetch(
      `http://www.saij.gob.ar/busqueda?o=0&p=25&f=Total&t=jurisprudencia&q=${encodeURIComponent(query)}`,
      { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(10000) }
    );

    if (!res.ok) {
      // Si la API no responde, devolver resultado simulado
      return NextResponse.json({
        fuente: "SAIJ",
        query,
        resultados: [],
        mensaje: "SAIJ no disponible en este momento. Intentá más tarde.",
        url: `http://www.saij.gob.ar/busqueda?q=${encodeURIComponent(query)}`,
      });
    }

    const data = await res.json();
    return NextResponse.json({
      fuente: "SAIJ",
      query,
      resultados: data.results || [],
      total: data.total || 0,
      url: `http://www.saij.gob.ar/busqueda?q=${encodeURIComponent(query)}`,
    });
  } catch {
    return NextResponse.json({
      fuente: "SAIJ",
      query,
      resultados: [],
      mensaje: "No se pudo conectar con SAIJ. Podés buscar directamente en saij.gob.ar",
      url: `http://www.saij.gob.ar/busqueda?q=${encodeURIComponent(query)}`,
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
