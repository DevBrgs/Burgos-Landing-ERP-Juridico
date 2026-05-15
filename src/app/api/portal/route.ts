import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// POST: Login de cliente por DNI + clave
export async function POST(request: NextRequest) {
  try {
    const { dni, clave } = await request.json();

    if (!dni || !clave) {
      return NextResponse.json({ error: "DNI y clave son requeridos" }, { status: 400 });
    }

    const supabase = getSupabase();

    const { data: cliente, error } = await supabase
      .from("clientes")
      .select("id, dni, nombre, clave_hash, activo, primer_ingreso, abogado_id")
      .eq("dni", dni)
      .eq("activo", true)
      .single();

    if (error || !cliente) {
      return NextResponse.json({ error: "DNI no encontrado o cuenta inactiva" }, { status: 401 });
    }

    // Verificar clave (en producción usar bcrypt)
    if (cliente.clave_hash !== clave) {
      return NextResponse.json({ error: "Clave incorrecta" }, { status: 401 });
    }

    // Generar token simple (en producción usar JWT)
    const token = Buffer.from(`${cliente.id}:${Date.now()}`).toString("base64");

    return NextResponse.json({
      token,
      cliente: {
        id: cliente.id,
        nombre: cliente.nombre,
        dni: cliente.dni,
        primer_ingreso: cliente.primer_ingreso,
        abogado_id: cliente.abogado_id,
      },
    });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PUT: Cambiar clave (primer ingreso)
export async function PUT(request: NextRequest) {
  try {
    const { clienteId, nuevaClave } = await request.json();

    if (!clienteId || !nuevaClave || nuevaClave.length < 6) {
      return NextResponse.json({ error: "Clave debe tener al menos 6 caracteres" }, { status: 400 });
    }

    const supabase = getSupabase();

    await supabase
      .from("clientes")
      .update({ clave_hash: nuevaClave, primer_ingreso: false })
      .eq("id", clienteId);

    return NextResponse.json({ message: "Clave actualizada" });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
