// ============================================================
// src/lib/types.ts
// ============================================================
// 📖 LESSON: TypeScript Types
//
// TypeScript lets us define the "shape" of our data so we
// catch mistakes at compile time instead of at runtime.
//
// These types match the columns in our Supabase tables.
// ============================================================

export type Profile = {
  id: string          // uuid — matches auth.users.id
  email: string
  username: string | null
  created_at: string
}

export type Note = {
  id: number
  user_id: string     // foreign key → profiles.id
  title: string
  content: string
  created_at: string
}
