-- ============================================================
-- supabase/setup.sql
-- ============================================================
-- 📖 LESSON: Setting up your Supabase database
--
-- Run this ENTIRE file in Supabase → SQL Editor → New Query
-- then click "Run". Do this ONCE when setting up the project.
--
-- What this does:
--   1. Creates the `profiles` and `notes` tables
--   2. Creates a trigger so profiles are auto-created on signup
--   3. Enables Row Level Security (RLS) — users can only see
--      their own data, even if someone guesses a URL
-- ============================================================


-- ============================================================
-- STEP 1: Create the profiles table
-- ============================================================
-- Every user gets one profile row. The id matches auth.users.id
-- so we can always link a profile back to an authenticated user.

create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  username    text,
  created_at  timestamptz default now()
);


-- ============================================================
-- STEP 2: Create the notes table
-- ============================================================

create table if not exists public.notes (
  id          bigserial primary key,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  content     text default '',
  created_at  timestamptz default now()
);


-- ============================================================
-- STEP 3: Auto-create profile on signup (the KEY fix!)
-- ============================================================
-- 📖 LESSON: Database Triggers
--
-- A trigger is a function that runs AUTOMATICALLY when something
-- happens in the database. Here, whenever a new row is inserted
-- into auth.users (i.e. someone signs up), this function runs
-- and inserts a matching row into public.profiles.
--
-- This is why your previous app had an empty profiles table —
-- it was missing this trigger!

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

-- Drop the trigger first (so re-running this file is safe)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ============================================================
-- STEP 4: Enable Row Level Security (RLS)
-- ============================================================
-- 📖 LESSON: Row Level Security
--
-- By default, Supabase tables are open — anyone with the
-- anon key could read ALL rows. RLS locks this down so each
-- user can only access THEIR OWN rows.
--
-- Think of it as a WHERE clause that Supabase adds automatically
-- to every query: WHERE user_id = auth.uid()

alter table public.profiles enable row level security;
alter table public.notes     enable row level security;


-- ============================================================
-- STEP 5: RLS Policies for profiles
-- ============================================================

-- Users can read only their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

-- Users can update only their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );


-- ============================================================
-- STEP 6: RLS Policies for notes
-- ============================================================

-- Users can read only their own notes
create policy "Users can view own notes"
  on public.notes for select
  using ( auth.uid() = user_id );

-- Users can insert notes only for themselves
create policy "Users can create own notes"
  on public.notes for insert
  with check ( auth.uid() = user_id );

-- Users can delete only their own notes
create policy "Users can delete own notes"
  on public.notes for delete
  using ( auth.uid() = user_id );


-- ============================================================
-- DONE! ✅
-- You can now run the app. Any new signup will automatically
-- get a profile row. Existing users from a previous project?
-- Run the backfill query below:
-- ============================================================

-- OPTIONAL BACKFILL — run if you have existing auth users
-- without a matching profile row:
--
-- insert into public.profiles (id, email, created_at)
-- select id, email, created_at from auth.users
-- where id not in (select id from public.profiles);
