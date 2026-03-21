// ============================================================
// src/components/LogoutButton.tsx
// ============================================================
// 📖 LESSON: Why this needs "use client"
//
// The Dashboard page is a Server Component, but it needs a
// logout button. Buttons need onClick handlers, which require
// JavaScript in the browser — that means "use client".
//
// Solution: extract just the button into its own Client
// Component and import it into the Server page. The rest of
// the page stays a Server Component (faster, more secure).
// ============================================================

'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    // After signing out, refresh the router cache and go home
    router.refresh()
    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
    >
      Log out
    </button>
  )
}
