// ============================================================
// src/app/page.tsx  →  Route: /
// ============================================================
// 📖 LESSON: Server Components + Redirects
//
// This is a Server Component (no "use client" at the top).
// It runs on the server and checks if the user is logged in.
//
// • Logged in  → send to /dashboard
// • Logged out → show a landing/welcome page
// ============================================================

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Already logged in — go straight to dashboard
  if (user) redirect('/dashboard')

  // Not logged in — show the welcome / landing page
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="text-center max-w-lg">
        {/* App title */}
        <div className="text-6xl mb-4">📝</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Learn App
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A beginner-friendly app to learn authentication, databases,
          and deployment — built with Next.js & Supabase.
        </p>

        {/* 📖 LESSON: Links vs Buttons
            Link is for navigation (changes the URL).
            Button is for actions (submits a form, runs JS).  */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/signup"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg
                       hover:bg-indigo-700 transition-colors text-center"
          >
            Get Started — Sign Up
          </Link>
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg
                       border border-indigo-300 hover:bg-indigo-50 transition-colors text-center"
          >
            Log In
          </Link>
        </div>

        {/* Learning note */}
        <p className="mt-10 text-sm text-gray-500">
          🎓 Every file in this project has beginner-friendly comments.
          Open <code className="bg-white px-1 rounded">src/</code> and start reading!
        </p>
      </div>
    </main>
  )
}
