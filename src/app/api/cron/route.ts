import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { sendEmail, emailAudienciaProxima, emailTareaVencimiento, emailTurnoRecordatorio } from "@/lib/email";

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

    // 3. Turnos de mañana — recordar al cliente si tiene email
    const { data: turnos } = await supabase
      .from("turnos")
      .select("*, clientes:cliente_id(nombre, email), abogados:abogado_id(nombre)")
      .in("estado", ["pendiente", "confirmado"])
      .eq("fecha", mananaStr);

    let turnosNotificados = 0;
    if (turnos) {
      for (const turno of turnos) {
        const cliente = (turno as any).clientes;
        const abogado = (turno as any).abogados;
        const emailDest = cliente?.email || null;
        const nombreCliente = cliente?.nombre || turno.nombre_externo || "Cliente";
        const nombreAbogado = abogado?.nombre || "el estudio";

        if (emailDest) {
          await sendEmail({
            to: emailDest,
            subject: `Recordatorio: turno mañana ${turno.hora?.slice(0, 5) || ""} - Burgos & Asociados`,
            html: emailTurnoRecordatorio(nombreCliente, turno.fecha, turno.hora?.slice(0, 5) || "", nombreAbogado, turno.motivo || ""),
          });
          alertasEnviadas++;
          turnosNotificados++;
        } else {
          console.log(`[Cron] Turno ${turno.id} sin email de cliente, omitido.`);
        }
      }
    }

    return NextResponse.json({
      message: `Alertas procesadas: ${alertasEnviadas} enviadas`,
      audiencias: audiencias?.length || 0,
      tareas: tareas?.length || 0,
      turnos: turnosNotificados,
    });
  } catch (error) {
    console.error("[Cron] Error:", error);
    return NextResponse.json({ error: "Error en cron" }, { status: 500 });
  }
}
