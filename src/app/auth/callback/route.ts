// ============================================================
// src/app/auth/callback/route.ts  →  Route: /auth/callback
// ============================================================
// 📖 LESSON: Route Handlers (API endpoints in Next.js)
//
// This is NOT a page — it's a server-side API endpoint.
// When Supabase sends a confirmation email, the link points
// here: /auth/callback?code=xxxx
//
// We exchange that one-time code for a real session,
// then redirect the user to the dashboard.
//
// Without this file, email confirmation links would 404!
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Exchange the code → session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`)
    }
  }

  // If anything went wrong, go to login with an error message
  return NextResponse.redirect(`${origin}/auth/login?message=Could not confirm email`)
}
