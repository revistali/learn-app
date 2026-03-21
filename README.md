# 📝 Learn App — Auth & Notes

A beginner tutorial app built with **Next.js 15** and **Supabase**.
Every file has detailed comments explaining *why* things work the way they do.

---

## What you'll learn

- ✅ User signup & login with Supabase Auth
- ✅ Session management with cookies (no localStorage bugs!)
- ✅ Protected routes with Next.js Middleware
- ✅ Server Components vs Client Components
- ✅ Database triggers (auto-create profiles on signup)
- ✅ Row Level Security (users only see their own data)
- ✅ Full CRUD for notes (Create, Read, Delete)
- ✅ Deploying to Vercel via GitHub

---

## Project structure

```
learn-app/
├── middleware.ts              ← Protects routes, refreshes sessions
├── supabase/
│   └── setup.sql             ← Run this FIRST in Supabase SQL Editor
├── src/
│   ├── app/
│   │   ├── page.tsx          ← Landing page  ( / )
│   │   ├── dashboard/
│   │   │   └── page.tsx      ← Dashboard     ( /dashboard )
│   │   ├── notes/
│   │   │   └── page.tsx      ← Notes list    ( /notes )
│   │   └── auth/
│   │       ├── login/page.tsx
│   │       ├── signup/page.tsx
│   │       └── callback/route.ts  ← Handles email confirmation links
│   ├── components/
│   │   ├── NotesClient.tsx   ← Create & delete notes (Client)
│   │   ├── NoteCard.tsx      ← Individual note card  (Client)
│   │   └── LogoutButton.tsx  ← Logout button          (Client)
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts     ← Supabase for browser (Client Components)
│       │   └── server.ts     ← Supabase for server  (Server Components)
│       └── types.ts          ← TypeScript types
```

---

## ⚙️ Setup — follow these steps in order

### Step 1 — Create your Supabase project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Give it a name, set a database password, choose a region
3. Wait ~2 minutes for it to spin up

### Step 2 — Run the database setup SQL

1. In Supabase → **SQL Editor** → **New Query**
2. Paste the entire contents of `supabase/setup.sql`
3. Click **Run**

This creates your tables, trigger, and security policies.

### Step 3 — Set your environment variables

1. In Supabase → **Project Settings** → **API**
2. Copy your **Project URL** and **anon public** key
3. Copy `.env.local.example` → `.env.local`
4. Fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

### Step 4 — Configure the email confirmation redirect URL

1. In Supabase → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
3. Under **Redirect URLs**, add: `http://localhost:3000/auth/callback`

> When you deploy to Vercel, add your production URL here too!

### Step 5 — Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🚀 Deploy to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import from GitHub
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**
5. Copy your Vercel URL (e.g. `https://learn-app-abc.vercel.app`)
6. In Supabase → Authentication → URL Configuration:
   - Update Site URL to your Vercel URL
   - Add `https://your-app.vercel.app/auth/callback` to Redirect URLs

---

## 🎓 What to read next

Start here and read in this order:

1. `supabase/setup.sql` — understand the database structure
2. `middleware.ts` — understand route protection
3. `src/lib/supabase/client.ts` & `server.ts` — browser vs server clients
4. `src/app/auth/signup/page.tsx` — your first Client Component + form
5. `src/app/dashboard/page.tsx` — your first protected Server Component
6. `src/components/NotesClient.tsx` — CRUD operations

---

## ❓ Common issues

**"relation profiles does not exist"**
→ You haven't run `supabase/setup.sql` yet. Do Step 2.

**Profile table stays empty after signup**
→ The trigger wasn't created. Re-run `setup.sql`.

**Email confirmation link gives a 404**
→ You haven't added `/auth/callback` to Supabase Redirect URLs (Step 4).

**Stuck on "Loading…" after login**
→ Check your `.env.local` values — make sure there are no extra spaces.
