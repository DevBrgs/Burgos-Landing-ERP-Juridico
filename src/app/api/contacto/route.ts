import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, email, telefono, area, mensaje } = await request.json();

    if (!nombre || !email || !area || !mensaje) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    // Guardar en actividad_log como consulta entrante
    await supabase.from("actividad_log").insert({
      accion: "consulta_contacto",
      entidad: "contacto",
      detalles: { nombre, email, telefono, area, mensaje },
    });

    // Buscar abogado responsable del área para derivación
    const { data: abogados } = await supabase
      .from("abogados")
      .select("id, nombre, email")
      .eq("activo", true)
      .contains("areas", [area]);

    // TODO: Cuando tengamos Resend, enviar email al abogado y confirmación al cliente
    // Por ahora solo guardamos la consulta

    return NextResponse.json({
      message: "Consulta recibida. Nos pondremos en contacto a la brevedad.",
      derivado_a: abogados?.[0]?.nombre || "Equipo Burgos",
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
