// ============================================================
// src/lib/supabase/client.ts
// ============================================================
// 📖 LESSON: Client-Side Supabase
//
// This creates a Supabase client that runs in the BROWSER.
// Use this inside "use client" components (anything with
// React hooks like useState, useEffect, onClick, etc.)
//
// The @supabase/ssr package handles storing the user session
// in a cookie automatically — that's how the user stays
// logged in across page refreshes.
// ============================================================

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
