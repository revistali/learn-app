// ============================================================
// src/app/auth/login/page.tsx  →  Route: /auth/login
// ============================================================
// 📖 LESSON: Logging In vs Signing Up
//
// signUp() → creates a new account
// signInWithPassword() → logs into an existing account
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

  // Optional info message passed via URL (e.g. ?message=...)
  const message = searchParams.get('message')

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
