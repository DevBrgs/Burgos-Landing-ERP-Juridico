import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Obtener posts publicados para la landing
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const categoria = searchParams.get("categoria");

    const supabase = getSupabase();

    let query = supabase
      .from("posts")
      .select("id, titulo, resumen, categoria, imagen_url, publicado_en, autor_id, abogados(nombre)")
      .eq("estado", "publicado")
      .order("publicado_en", { ascending: false })
      .limit(limit);

    if (categoria && categoria !== "Todas") {
      query = query.eq("categoria", categoria);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Suscribirse al newsletter
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { error } = await supabase
      .from("suscriptores")
      .upsert({ email, activo: true }, { onConflict: "email" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Suscripción exitosa" });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
