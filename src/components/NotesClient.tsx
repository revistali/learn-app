// ============================================================
// src/components/NotesClient.tsx
// ============================================================
// 📖 LESSON: Client Component with CRUD operations
//
// CRUD = Create, Read, Update, Delete — the four basic
// operations every database-backed app needs.
//
// This component receives the initial notes from the server
// page (props), then manages its own state for any changes
// the user makes (add / delete) without a full page reload.
//
// Key pattern: optimistic UI
//   • We update the local state FIRST (instant feedback)
//   • Then send the change to Supabase in the background
//   • If Supabase fails, we roll back the local state
// ============================================================

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Note } from '@/lib/types'
import NoteCard from './NoteCard'

interface Props {
  initialNotes: Note[]
  userId: string
}

export default function NotesClient({ initialNotes, userId }: Props) {
  const supabase = createClient()

  // Local state starts with the server-fetched notes
  const [notes, setNotes]     = useState<Note[]>(initialNotes)
  const [title, setTitle]     = useState('')
  const [content, setContent] = useState('')
  const [error, setError]     = useState('')
  const [saving, setSaving]   = useState(false)
  const [showForm, setShowForm] = useState(false)

  // ── CREATE ───────────────────────────────────────────────
  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) { setError('Title is required.'); return }
    setError('')
    setSaving(true)

    try {
      // Insert the new note into Supabase
      // .select() returns the newly created row so we get the id + timestamp
      const { data, error } = await supabase
        .from('notes')
        .insert({ user_id: userId, title: title.trim(), content: content.trim() })
        .select()
        .single()

      if (error) throw error

      // Prepend to local state (newest first, no page reload needed)
      setNotes(prev => [data, ...prev])
      setTitle('')
      setContent('')
      setShowForm(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save note.')
    } finally {
      setSaving(false)
    }
  }

  // ── DELETE ───────────────────────────────────────────────
  async function handleDelete(id: number) {
    // Optimistic update — remove from UI immediately
    const previous = notes
    setNotes(prev => prev.filter(n => n.id !== id))

    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)   // 📖 always scope deletes to the user!

    if (error) {
      // Roll back if the delete failed
      setNotes(previous)
      alert('Delete failed: ' + error.message)
    }
  }

  // ── RENDER ───────────────────────────────────────────────
  return (
    <div>
      {/* ── New note button / form toggle ────────────────── */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="mb-6 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold
                     rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + New Note
        </button>
      ) : (
        /* ── Create note form ──────────────────────────── */
        <form
          onSubmit={handleCreate}
          className="mb-8 bg-white rounded-2xl border border-gray-200 p-6 space-y-4"
        >
          <h2 className="font-semibold text-gray-800 text-lg">New Note</h2>

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Give your note a title…"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Write your note here…"
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold
                         rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Note'}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setError('') }}
              className="px-5 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold
                         rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── Notes list ──────────────────────────────────── */}
      {notes.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-3">🗒️</div>
          <p className="font-medium">No notes yet.</p>
          <p className="text-sm">Click "New Note" to write your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {notes.map(note => (
            <NoteCard key={note.id} note={note} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* 📖 LESSON callout */}
      <div className="mt-10 p-5 bg-amber-50 border border-amber-200 rounded-2xl text-sm text-amber-900">
        <p className="font-semibold mb-1">🎓 What's happening here?</p>
        <ul className="list-disc list-inside space-y-1 text-amber-800">
          <li>Notes were fetched on the <strong>server</strong> — no loading spinner.</li>
          <li>Creating/deleting uses <strong>optimistic UI</strong> — instant feedback.</li>
          <li>Row Level Security ensures you can only see <strong>your own</strong> notes.</li>
        </ul>
      </div>
    </div>
  )
}
