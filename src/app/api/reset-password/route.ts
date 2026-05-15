import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

function getAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { userId, newPassword } = await request.json();
    if (!userId || !newPassword) {
      return NextResponse.json({ error: "userId y newPassword requeridos" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres" }, { status: 400 });
    }

    const supabase = getAdminClient();
    const { error } = await supabase.auth.admin.updateUserById(userId, { password: newPassword });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Contraseña actualizada" });
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
