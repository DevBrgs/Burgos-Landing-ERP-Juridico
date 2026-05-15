import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET: Obtener horarios disponibles de un abogado para una fecha
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const abogadoId = searchParams.get("abogadoId");
    const fecha = searchParams.get("fecha"); // YYYY-MM-DD

    if (!abogadoId || !fecha) {
      return NextResponse.json({ error: "abogadoId y fecha requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();
    const diaSemana = new Date(fecha + "T12:00:00").getDay(); // 0=dom, 1=lun...

    // Obtener disponibilidad del abogado para ese día
    const { data: disponibilidad } = await supabase
      .from("disponibilidad")
      .select("hora_inicio, hora_fin")
      .eq("abogado_id", abogadoId)
      .eq("dia_semana", diaSemana)
      .eq("activo", true);

    // Si no tiene disponibilidad configurada, usar horario por defecto (9-18)
    const horarios = disponibilidad && disponibilidad.length > 0
      ? disponibilidad
      : [{ hora_inicio: "09:00", hora_fin: "18:00" }];

    // Obtener turnos ya tomados para esa fecha
    const { data: turnosTomados } = await supabase
      .from("turnos")
      .select("hora")
      .eq("abogado_id", abogadoId)
      .eq("fecha", fecha)
      .neq("estado", "cancelado");

    const horasOcupadas = new Set(turnosTomados?.map(t => t.hora.slice(0, 5)) || []);

    // Generar slots disponibles (cada 30 min)
    const slotsDisponibles: string[] = [];
    for (const bloque of horarios) {
      const [hInicio] = bloque.hora_inicio.split(":").map(Number);
      const [hFin] = bloque.hora_fin.split(":").map(Number);

      for (let h = hInicio; h < hFin; h++) {
        for (const m of ["00", "30"]) {
          const slot = `${String(h).padStart(2, "0")}:${m}`;
          if (!horasOcupadas.has(slot)) {
            slotsDisponibles.push(slot);
          }
        }
      }
    }

    return NextResponse.json({
      abogadoId,
      fecha,
      diaSemana,
      slotsDisponibles,
      totalDisponibles: slotsDisponibles.length,
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// POST: Configurar disponibilidad de un abogado
export async function POST(request: NextRequest) {
  try {
    const { abogadoId, disponibilidad } = await request.json();
    // disponibilidad: [{ dia_semana: 1, hora_inicio: "09:00", hora_fin: "13:00" }, ...]

    if (!abogadoId || !disponibilidad) {
      return NextResponse.json({ error: "Datos requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();

    // Borrar disponibilidad anterior
    await supabase.from("disponibilidad").delete().eq("abogado_id", abogadoId);

    // Insertar nueva
    const rows = disponibilidad.map((d: any) => ({
      abogado_id: abogadoId,
      dia_semana: d.dia_semana,
      hora_inicio: d.hora_inicio,
      hora_fin: d.hora_fin,
    }));

    await supabase.from("disponibilidad").insert(rows);

    return NextResponse.json({ message: "Disponibilidad actualizada" });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
