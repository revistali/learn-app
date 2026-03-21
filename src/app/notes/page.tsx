// ============================================================
// src/app/notes/page.tsx  →  Route: /notes
// ============================================================
// 📖 LESSON: Mixing Server + Client rendering
//
// This page uses a two-layer pattern:
//   1. The page itself is a SERVER component — it fetches the
//      initial list of notes securely on the server.
//   2. It passes that data to <NotesClient>, a CLIENT component
//      that handles interactivity (adding, deleting notes).
//
// Why split? Server fetching = no loading flash on first paint.
// Client interactivity = reactive UI after the page loads.
// ============================================================

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import NotesClient from '@/components/NotesClient'
import Link from 'next/link'

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  // Fetch notes for this user, newest first
  const { data: notes, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <span className="font-bold text-gray-900 text-lg">Learn App</span>
        </div>
        <Link
          href="/dashboard"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ← Dashboard
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notes</h1>
        <p className="text-gray-500 mb-8 text-sm">
          {notes?.length ?? 0} note{notes?.length !== 1 ? 's' : ''}
        </p>

        {/* Hand off to the Client Component for interactivity */}
        <NotesClient
          initialNotes={notes ?? []}
          userId={user.id}
        />
      </main>
    </div>
  )
}
