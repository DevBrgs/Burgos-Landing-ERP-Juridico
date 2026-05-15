import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Obtener valores de configuración (público para landing)
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data } = await supabase.from("configuracion").select("clave, valor");

    const config: Record<string, string> = {};
    data?.forEach((row) => { config[row.clave] = row.valor; });

    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

// PUT: Actualizar valor de configuración (desde ERP)
export async function PUT(request: NextRequest) {
  try {
    const { clave, valor } = await request.json();
    if (!clave || !valor) {
      return NextResponse.json({ error: "clave y valor requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();
    await supabase
      .from("configuracion")
      .upsert({ clave, valor, actualizado_en: new Date().toISOString() }, { onConflict: "clave" });

    return NextResponse.json({ message: "Actualizado" });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
