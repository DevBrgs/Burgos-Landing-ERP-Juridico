import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// POST: Crear link temporal para un documento
export async function POST(request: NextRequest) {
  try {
    const { documento_id, dias_expiracion, abogado_id } = await request.json();
    if (!documento_id) return NextResponse.json({ error: "documento_id requerido" }, { status: 400 });

    const supabase = getSupabase();
    const expira = new Date();
    expira.setDate(expira.getDate() + (dias_expiracion || 7));

    const { data, error } = await supabase.from("links_compartidos").insert({
      documento_id,
      expira_en: expira.toISOString(),
      creado_por: abogado_id || null,
    }).select("token").single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://erplandingburgos.vercel.app";
    return NextResponse.json({ link: `${baseUrl}/compartido/${data.token}`, token: data.token, expira_en: expira.toISOString() });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// GET: Validar un token y obtener el documento
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    if (!token) return NextResponse.json({ error: "Token requerido" }, { status: 400 });

    const supabase = getSupabase();
    const { data: link } = await supabase.from("links_compartidos").select("*, documentos(nombre, url)").eq("token", token).single();

    if (!link) return NextResponse.json({ error: "Link no encontrado" }, { status: 404 });
    if (link.revocado) return NextResponse.json({ error: "Link revocado" }, { status: 403 });
    if (new Date(link.expira_en) < new Date()) return NextResponse.json({ error: "Link expirado" }, { status: 410 });

    // Incrementar vistas
    await supabase.from("links_compartidos").update({ vistas: link.vistas + 1 }).eq("id", link.id);

    return NextResponse.json({ documento: link.documentos, expira_en: link.expira_en });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
