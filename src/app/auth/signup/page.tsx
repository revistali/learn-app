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
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [sent, setSent]         = useState(false)

  // ── Handle Google OAuth ───────────────────────────────────
  // 📖 LESSON: signInWithOAuth() vs signInWithPassword()
  //
  // signInWithPassword() → you collect email + password yourself
  //                        and send them directly to Supabase.
  //
  // signInWithOAuth()    → you hand control to the provider (Google).
  //   1. Supabase gives you a special Google URL to redirect the user to.
  //   2. Google shows its own "Choose an account" / consent screen.
  //   3. After the user approves, Google sends them back to YOUR app
  //      at the "redirectTo" URL below (/auth/callback).
  //   4. /auth/callback exchanges the one-time code for a real session.
  //
  // Full flow:  Your App → Google → /auth/callback → /dashboard
  async function handleGoogleSignUp() {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After Google approves, the user is sent back here.
        // ⚠️ This URL must also be in your Supabase dashboard under
        //    Authentication → URL Configuration → Redirect URLs.
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    // If Supabase couldn't start the OAuth flow, show the error.
    // In the happy path the browser redirects away and this never runs.
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  // ── Handle email / password form submission ───────────────
  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError('')

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
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) throw error
      setSent(true)
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

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* ── Google Sign-Up Button ──────────────────────────
            Clicking this kicks off the OAuth flow above.
            It sits above the email form — most users prefer it. */}
        <button
          onClick={handleGoogleSignUp}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4
                     border border-gray-300 rounded-lg bg-white hover:bg-gray-50
                     transition-colors text-sm font-medium text-gray-700
                     disabled:opacity-50 mb-5"
        >
          {/* Google's brand logo as inline SVG — no extra npm package needed */}
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        {/* ── Divider ───────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">or sign up with email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── Email / Password form ─────────────────────────── */}
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