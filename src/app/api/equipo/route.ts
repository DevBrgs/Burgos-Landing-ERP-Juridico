import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Obtener abogados activos para la landing pública
export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("abogados")
      .select("id, nombre, especialidad, matricula, foto_url, fondo_url, bio, areas, experiencia, rol")
      .eq("activo", true)
      .order("rol", { ascending: true }) // Director primero
      .order("creado_en", { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
