import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// GET: Obtener mensajes de un expediente o entre abogado y cliente
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clienteId = searchParams.get("clienteId");
    const abogadoId = searchParams.get("abogadoId");

    const supabase = getSupabase();

    let query = supabase.from("mensajes").select("*").order("creado_en", { ascending: true });

    if (clienteId) {
      query = query.eq("remitente_id", clienteId);
    }

    const { data, error } = await query.limit(50);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Enviar mensaje
export async function POST(request: NextRequest) {
  try {
    const { expediente_id, remitente_tipo, remitente_id, cuerpo } = await request.json();

    if (!remitente_tipo || !remitente_id || !cuerpo) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data, error } = await supabase.from("mensajes").insert({
      expediente_id: expediente_id || null,
      remitente_tipo,
      remitente_id,
      cuerpo,
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
