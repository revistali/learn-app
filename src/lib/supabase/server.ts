// ============================================================
// src/lib/supabase/server.ts
// ============================================================
// 📖 LESSON: Server-Side Supabase
//
// This creates a Supabase client that runs on the SERVER.
// Next.js can run code on the server (in Server Components,
// Route Handlers, and Middleware). This is where this client
// is used.
//
// The key difference: the server reads/writes the session
// cookie from the incoming HTTP request — it has no access
// to browser APIs like localStorage.
// ============================================================

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — cookies can't be set here,
            // but middleware handles refreshing the session.
          }
        },
      },
    }
  )
}
