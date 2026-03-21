// ============================================================
// src/app/auth/signup/page.tsx  →  Route: /auth/signup
// ============================================================
// 📖 LESSON: Client Components & Forms
//
// "use client" means this component runs in the BROWSER.
// We need it here because:
//   • useState — to track what the user types
//   • onClick / onSubmit — to handle form submission
//   • useRouter — to navigate after signup
//
// Server Components (no "use client") can't do any of these.
// ============================================================

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClient()

  // ── State ─────────────────────────────────────────────────
  // useState returns [currentValue, setterFunction]
  // Calling the setter causes the component to re-render.
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)   // confirmation screen

  // ── Handle form submission ────────────────────────────────
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()   // stop the browser from reloading the page
    setError('')

    // Basic validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // 📖 LESSON: supabase.auth.signUp()
      // This calls the Supabase API and creates a new user.
      // Supabase then sends a confirmation email automatically.
      // Once confirmed, the database trigger creates their profile row.
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setSent(true)   // show the "check your email" screen
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  // ── "Check your email" confirmation screen ────────────────
  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email!</h2>
          <p className="text-gray-600 mb-6">
            We sent a confirmation link to <strong>{email}</strong>.
            Click it to activate your account, then log in.
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Log In
          </Link>
        </div>
      </div>
    )
  }

  // ── Main signup form ──────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Create account</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Already have one?{' '}
          <Link href="/auth/login" className="text-indigo-600 hover:underline">Log in</Link>
        </p>

        {/* Error box — only shows when error is non-empty */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
            <input
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg
                       hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}
