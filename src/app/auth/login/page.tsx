// ============================================================
// src/app/auth/login/page.tsx  →  Route: /auth/login
// ============================================================
// 📖 LESSON: Logging In vs Signing Up
//
// signUp() → creates a new account
// signInWithPassword() → logs into an existing account
// signInWithOAuth()    → delegates login to Google (no password needed)
//
// On success, Supabase stores a session cookie.
// Middleware (middleware.ts) reads that cookie on every
// request to know if the user is authenticated.
// ============================================================

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Suspense } from 'react'

// ── Inner component (reads search params — needs Suspense) ──
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const message = searchParams.get('message')

  // ── Handle Google OAuth ───────────────────────────────────
  // 📖 LESSON: How OAuth login works
  //
  // Instead of asking for a password, we redirect the user to
  // Google's login page. Google authenticates them, then sends
  // them back to /auth/callback with a one-time code.
  // That code is exchanged for a Supabase session automatically.
  //
  // Full flow:  /auth/login → Google → /auth/callback → /dashboard
  async function handleGoogleLogin() {
    setError('')
    setLoading(true)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // ⚠️ This URL must be listed in Supabase dashboard under
        //    Authentication → URL Configuration → Redirect URLs.
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
    // If no error, the browser is already redirecting to Google —
    // nothing else to do here.
  }

  // ── Handle email / password login ─────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // 📖 router.refresh() tells Next.js to re-fetch server data
      //    so the dashboard knows we're now logged in.
      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-gray-500 mb-6 text-sm">
          No account?{' '}
          <Link href="/auth/signup" className="text-indigo-600 hover:underline">Sign up for free</Link>
        </p>

        {/* Info message (e.g. "check your email") */}
        {message && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-300 text-blue-700 rounded-lg text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* ── Google Login Button ────────────────────────────
            Same OAuth flow as signup — same button, same handler.
            If the user already has a Google-linked account, they're
            logged straight in. If not, a new account is created. */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4
                     border border-gray-300 rounded-lg bg-white hover:bg-gray-50
                     transition-colors text-sm font-medium text-gray-700
                     disabled:opacity-50 mb-5"
        >
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
          <span className="text-xs text-gray-400 font-medium">or log in with email</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* ── Email / Password form ─────────────────────────── */}
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Your password"
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
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Page wrapper (Suspense needed for useSearchParams) ──────
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}