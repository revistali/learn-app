// ============================================================
// src/app/layout.tsx
// ============================================================
// 📖 LESSON: Root Layout
//
// This wraps EVERY page in the app. Think of it as the
// outer shell: it loads the global CSS and sets the <html>
// and <body> tags. Child pages are injected into {children}.
// ============================================================

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Learn App — Auth & Notes',
  description: 'A beginner tutorial app: Supabase + Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
