import { type NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Si no hay configuración de Supabase, dejar pasar
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  // Solo aplicar auth en rutas protegidas
  const { pathname } = request.nextUrl

  // Rutas públicas: landing, newsletter, equipo, áreas, contacto
  const publicRoutes = ['/', '/equipo', '/areas', '/contacto', '/newsletter']
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/public'))) {
    return NextResponse.next()
  }

  // Para rutas protegidas (/erp, /portal, /admin), verificar sesión
  if (pathname.startsWith('/erp') || pathname.startsWith('/portal') || pathname.startsWith('/admin')) {
    const { updateSession } = await import('@/lib/supabase/middleware')
    return await updateSession(request)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
