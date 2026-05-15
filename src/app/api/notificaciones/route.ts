import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// Sistema de notificaciones — guarda en DB y opcionalmente envía email
export async function POST(request: NextRequest) {
  try {
    const { tipo, destinatario_id, destinatario_tipo, titulo, mensaje, entidad, entidad_id } = await request.json();

    const supabase = getSupabase();

    // Guardar notificación en actividad_log
    await supabase.from("actividad_log").insert({
      usuario_id: destinatario_id,
      usuario_tipo: destinatario_tipo,
      accion: tipo,
      entidad,
      entidad_id,
      detalles: { titulo, mensaje },
    });

    // TODO: Cuando tengamos Resend configurado, enviar email
    // if (process.env.RESEND_API_KEY) {
    //   await enviarEmail(destinatario_email, titulo, mensaje);
    // }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Error al crear notificación" }, { status: 500 });
  }
}

// Obtener notificaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId requerido" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data } = await supabase
      .from("actividad_log")
      .select("*")
      .eq("usuario_id", userId)
      .order("creado_en", { ascending: false })
      .limit(20);

    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
