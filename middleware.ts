// ============================================================
// middleware.ts  (lives at the ROOT of the project)
// ============================================================
// 📖 LESSON: Next.js Middleware
//
// Middleware runs BEFORE every page request — it's like a
// security guard at the door. We use it for two things:
//
// 1. REFRESH the user session (keeps cookies up to date)
// 2. REDIRECT unauthenticated users away from protected pages
//
// Without this, a user's session would expire and they'd see
// errors instead of being politely sent to /login.
// ============================================================

import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Build a server Supabase client that can read/write cookies
  const supabase = createServerClient(
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
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: getUser() refreshes the session token if needed
  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // 🔒 Protect /dashboard and /notes — redirect to login if not authenticated
  if (!user && (pathname.startsWith('/dashboard') || pathname.startsWith('/notes'))) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // ✅ If logged in, prevent going back to login/signup pages
  if (user && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/signup'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

// Tell Next.js which paths this middleware applies to
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
