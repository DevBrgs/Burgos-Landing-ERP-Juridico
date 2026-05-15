import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Expedientes del cliente con documentos compartidos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");

    if (!clienteId) {
      return NextResponse.json({ error: "clienteId requerido" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Fetch expedientes
    const { data: expedientes, error } = await supabase
      .from("expedientes")
      .select("id, caratula, numero, fuero, juzgado, estado, creado_en")
      .eq("cliente_id", clienteId)
      .order("creado_en", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fetch shared documents for each expediente
    const expedientesConDocs = await Promise.all(
      (expedientes || []).map(async (exp) => {
        const { data: docs } = await supabase
          .from("documentos")
          .select("id, nombre, tipo, url, creado_en")
          .eq("expediente_id", exp.id)
          .eq("visible_cliente", true)
          .order("creado_en", { ascending: false });

        return { ...exp, documentos: docs || [] };
      })
    );

    return NextResponse.json(expedientesConDocs);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
