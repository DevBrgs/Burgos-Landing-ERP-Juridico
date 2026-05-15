import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Admin client con service role key para crear usuarios
function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, email, password, especialidad, matricula, rol } = body;

    if (!nombre || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 }
      );
    }

    const supabase = getAdminClient();

    // 1. Crear usuario en Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) {
      if (authError.message.includes("already been registered")) {
        return NextResponse.json(
          { error: "Ya existe un usuario con ese email" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: `Error de autenticación: ${authError.message}` },
        { status: 500 }
      );
    }

    // 2. Insertar en tabla abogados
    const { data: abogadoData, error: abogadoError } = await supabase
      .from("abogados")
      .insert({
        user_id: authData.user.id,
        nombre,
        email,
        especialidad: especialidad || "Administrativo",
        matricula: matricula || null,
        rol: rol || "asociado",
      })
      .select()
      .single();

    if (abogadoError) {
      // Si falla la inserción, eliminar el usuario de auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      return NextResponse.json(
        { error: `Error al crear perfil: ${abogadoError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Abogado creado exitosamente", abogado: abogadoData },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getAdminClient();

    const { data, error } = await supabase
      .from("abogados")
      .select("*")
      .order("creado_en", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
