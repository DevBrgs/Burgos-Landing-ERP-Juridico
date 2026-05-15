import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, emailAudienciaProxima, emailTareaVencimiento } from "@/lib/email";

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

// GET: Ejecutar alertas automáticas (llamar desde Vercel Cron o externamente)
export async function GET() {
  try {
    const supabase = getSupabase();
    const hoy = new Date();
    const en3dias = new Date(hoy);
    en3dias.setDate(en3dias.getDate() + 3);

    let alertasEnviadas = 0;

    // 1. Audiencias en los próximos 3 días
    const { data: audiencias } = await supabase
      .from("audiencias")
      .select("*, abogados(nombre, email)")
      .eq("estado", "pendiente")
      .gte("fecha", hoy.toISOString().split("T")[0])
      .lte("fecha", en3dias.toISOString().split("T")[0]);

    if (audiencias) {
      for (const aud of audiencias) {
        const abogado = (aud as any).abogados;
        if (abogado?.email) {
          await sendEmail({
            to: abogado.email,
            subject: `Audiencia próxima: ${aud.tipo} - ${aud.fecha}`,
            html: emailAudienciaProxima(abogado.nombre, aud.tipo, aud.fecha, aud.juzgado || ""),
          });
          alertasEnviadas++;
        }
      }
    }

    // 2. Tareas que vencen mañana
    const manana = new Date(hoy);
    manana.setDate(manana.getDate() + 1);
    const mananaStr = manana.toISOString().split("T")[0];

    const { data: tareas } = await supabase
      .from("tareas")
      .select("*, abogados:asignado_a(nombre, email)")
      .eq("estado", "pendiente")
      .eq("vence_en", mananaStr);

    if (tareas) {
      for (const tarea of tareas) {
        const abogado = (tarea as any).abogados;
        if (abogado?.email) {
          await sendEmail({
            to: abogado.email,
            subject: `Tarea por vencer: ${tarea.titulo}`,
            html: emailTareaVencimiento(abogado.nombre, tarea.titulo, tarea.vence_en || ""),
          });
          alertasEnviadas++;
        }
      }
    }

    return NextResponse.json({
      message: `Alertas procesadas: ${alertasEnviadas} enviadas`,
      audiencias: audiencias?.length || 0,
      tareas: tareas?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({ error: "Error en cron" }, { status: 500 });
  }
}
