// ============================================================
// src/components/NoteCard.tsx
// ============================================================
// 📖 LESSON: Reusable Components & Props
//
// A component is just a function that returns JSX (HTML-like).
// Props are the "parameters" we pass to a component.
//
// Making NoteCard a separate file means:
//   • We can reuse it anywhere in the app
//   • The parent (NotesClient) doesn't need to know how a
//     note looks — it just passes the data
//   • It's easy to update the card's design in one place
// ============================================================

'use client'

import { useState } from 'react'
import type { Note } from '@/lib/types'

interface Props {
  note: Note
  onDelete: (id: number) => void  // callback from parent
}

export default function NoteCard({ note, onDelete }: Props) {
  const [confirming, setConfirming] = useState(false)

  // Format a raw timestamp into a readable date string
  const date = new Date(note.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-3
                    hover:shadow-sm transition-shadow">
      {/* Note header */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
          {note.title}
        </h3>

        {/* Delete with confirmation */}
        {!confirming ? (
          <button
            onClick={() => setConfirming(true)}
            className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0 text-lg"
            title="Delete note"
          >
            ✕
          </button>
        ) : (
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onDelete(note.id)}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
            >
              Delete
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md hover:bg-gray-200"
            >
              Keep
            </button>
          </div>
        )}
      </div>

      {/* Note content */}
      {note.content && (
        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
          {note.content}
        </p>
      )}

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-auto">{date}</p>
    </div>
  )
}
