import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rutas públicas — no requieren auth
  const publicPaths = ['/', '/newsletter', '/equipo', '/api/chat', '/api/newsletter', '/api/equipo', '/api/contacto']
  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isStaticOrAsset = pathname.startsWith('/_next') || pathname.startsWith('/api/') || pathname.includes('.')

  // Si no hay config de Supabase, dejar pasar todo
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  // Rutas públicas y assets — pasar sin verificar
  if (isPublic || isStaticOrAsset) {
    return NextResponse.next()
  }

  // Login page — si ya está logueado, redirigir al ERP
  if (pathname === '/login') {
    const supabase = createSupabaseMiddleware(request)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      return NextResponse.redirect(new URL('/erp', request.url))
    }
    return NextResponse.next()
  }

  // Rutas protegidas (/erp/*) — verificar sesión
  if (pathname.startsWith('/erp')) {
    const supabase = createSupabaseMiddleware(request)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  return NextResponse.next()
}

function createSupabaseMiddleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
