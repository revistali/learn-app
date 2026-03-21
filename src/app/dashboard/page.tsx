// ============================================================
// src/app/dashboard/page.tsx  →  Route: /dashboard
// ============================================================
// 📖 LESSON: Protected Server Component
//
// This page is a Server Component — it runs on the server
// and fetches the user's session BEFORE sending HTML to the
// browser. If the user isn't logged in, middleware already
// redirected them (see middleware.ts). But we check again
// here as a "belt and suspenders" safety measure.
//
// Server Components are great for data fetching because:
//   • No useEffect needed
//   • No loading spinner — data is ready before page renders
//   • More secure (secrets stay on the server)
// ============================================================

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Get the authenticated user from the session
  const { data: { user } } = await supabase.auth.getUser()

  // Double-check (middleware should catch this first)
  if (!user) redirect('/auth/login')

  // Fetch the user's profile from our public.profiles table
  // .single() returns one object instead of an array
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Count the user's notes for the dashboard stat
  const { count: noteCount } = await supabase
    .from('notes')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Top Navigation Bar ─────────────────────────── */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span className="font-bold text-gray-900 text-lg">Learn App</span>
        </div>
        <div className="flex items-center gap-4">
          {/* 📖 LESSON: Link vs <a>
              Always use Next.js <Link> for internal navigation.
              It does client-side routing (no full page reload).
              Use <a href="..."> only for external URLs. */}
          <Link
            href="/notes"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            My Notes
          </Link>
          {/* LogoutButton is a Client Component (needs onClick) */}
          <LogoutButton />
        </div>
      </nav>

      {/* ── Main Content ───────────────────────────────── */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Logged in as <span className="font-medium text-gray-700">{user.email}</span>
          </p>
        </div>

        {/* ── Stats Cards ──────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Total Notes</p>
            <p className="text-4xl font-bold text-indigo-600">{noteCount ?? 0}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-sm text-gray-500 mb-1">Username</p>
            <p className="text-2xl font-semibold text-gray-800">
              {profile?.username ?? (
                <span className="text-gray-400 text-base">Not set yet</span>
              )}
            </p>
          </div>
        </div>

        {/* ── Quick Actions ────────────────────────────── */}
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/notes"
            className="flex items-center gap-4 bg-white rounded-2xl border border-gray-200
                       p-6 hover:border-indigo-300 hover:shadow-sm transition-all group"
          >
            <span className="text-3xl">🗒️</span>
            <div>
              <p className="font-semibold text-gray-900 group-hover:text-indigo-600">View Notes</p>
              <p className="text-sm text-gray-500">Read, create and delete your notes</p>
            </div>
          </Link>

          <Link
            href="/notes?new=true"
            className="flex items-center gap-4 bg-indigo-600 rounded-2xl p-6
                       hover:bg-indigo-700 transition-colors group"
          >
            <span className="text-3xl">✏️</span>
            <div>
              <p className="font-semibold text-white">New Note</p>
              <p className="text-sm text-indigo-200">Write something down</p>
            </div>
          </Link>
        </div>

        {/* ── Lesson Callout ───────────────────────────── */}
        <div className="mt-10 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-900">
          <p className="font-semibold mb-1">🎓 What just happened?</p>
          <ul className="list-disc list-inside space-y-1 text-amber-800">
            <li>Middleware checked your session cookie before this page loaded.</li>
            <li>This is a <strong>Server Component</strong> — data was fetched on the server.</li>
            <li>Your profile row was created automatically by a database trigger.</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
