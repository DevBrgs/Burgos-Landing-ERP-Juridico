import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "" });

// POST: Procesar un documento (extraer texto, chunking, guardar)
export async function POST(request: NextRequest) {
  try {
    const { documentoId, abogadoId } = await request.json();
    if (!documentoId || !abogadoId) {
      return NextResponse.json({ error: "documentoId y abogadoId requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Marcar como procesando
    await supabase.from("documentos_ia").update({ estado: "procesando" }).eq("id", documentoId);

    // Obtener URL del documento
    const { data: doc } = await supabase.from("documentos_ia").select("url, nombre").eq("id", documentoId).single();
    if (!doc) {
      return NextResponse.json({ error: "Documento no encontrado" }, { status: 404 });
    }

    // Descargar el contenido del documento
    let texto = "";
    try {
      const res = await fetch(doc.url);
      const blob = await res.blob();
      // Para PDFs y docs, extraemos texto básico
      // En producción se usaría un servicio como pdf-parse
      texto = await blob.text();
      // Limpiar texto
      texto = texto.replace(/[^\x20-\x7E\xC0-\xFF\n]/g, " ").replace(/\s+/g, " ").trim();
    } catch {
      // Si no se puede leer, usar el nombre como placeholder
      texto = `Documento: ${doc.nombre}. Contenido no extraíble automáticamente.`;
    }

    if (texto.length < 50) {
      await supabase.from("documentos_ia").update({ estado: "error" }).eq("id", documentoId);
      return NextResponse.json({ error: "No se pudo extraer texto del documento" }, { status: 422 });
    }

    // Chunking: dividir en fragmentos de ~500 caracteres
    const chunks: string[] = [];
    const palabras = texto.split(" ");
    let chunk = "";
    for (const palabra of palabras) {
      if ((chunk + " " + palabra).length > 500) {
        if (chunk.trim()) chunks.push(chunk.trim());
        chunk = palabra;
      } else {
        chunk += " " + palabra;
      }
    }
    if (chunk.trim()) chunks.push(chunk.trim());

    // Guardar chunks (sin embeddings por ahora — búsqueda por texto)
    const rows = chunks.map((contenido) => ({
      documento_id: documentoId,
      abogado_id: abogadoId,
      contenido,
    }));

    // Insertar en lotes de 50
    for (let i = 0; i < rows.length; i += 50) {
      await supabase.from("chunks_ia").insert(rows.slice(i, i + 50));
    }

    // Marcar como listo
    await supabase.from("documentos_ia").update({ estado: "listo" }).eq("id", documentoId);

    return NextResponse.json({
      message: "Documento procesado",
      chunks: chunks.length,
      caracteres: texto.length,
    });
  } catch (error) {
    console.error("Error procesando documento:", error);
    return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
  }
}

// GET: Buscar en los chunks de un abogado (búsqueda por texto)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const abogadoId = searchParams.get("abogadoId");

    if (!query || !abogadoId) {
      return NextResponse.json({ error: "q y abogadoId requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Búsqueda por texto (full-text search básico)
    const palabrasClave = query.toLowerCase().split(" ").filter(p => p.length > 3);
    
    const { data: chunks } = await supabase
      .from("chunks_ia")
      .select("contenido, documento_id, documentos_ia(nombre)")
      .eq("abogado_id", abogadoId)
      .textSearch("contenido", palabrasClave.join(" | "))
      .limit(5);

    return NextResponse.json(chunks || []);
  } catch {
    return NextResponse.json({ error: "Error en búsqueda" }, { status: 500 });
  }
}
