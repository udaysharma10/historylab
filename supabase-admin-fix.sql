-- ============================================================
-- Supabase RLS Policy Fixes for HistoryLab
-- Last updated: 2026-03-31
-- ============================================================
-- PROBLEM: Original RLS policies on profiles table caused infinite
-- recursion because teacher policies queried the profiles table
-- itself (SELECT within SELECT policy = infinite loop).
--
-- FIX: Use security definer functions that bypass RLS to check
-- if the current user is an admin teacher or school teacher.
-- ============================================================

-- Step 1: Helper functions (bypass RLS to check role)
create or replace function is_admin_teacher()
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'teacher'
    and school = 'Admin'
  );
$$ language sql security definer stable;

create or replace function is_teacher_at_school(check_school text)
returns boolean as $$
  select exists (
    select 1 from profiles
    where id = auth.uid()
    and role = 'teacher'
    and school = check_school
  );
$$ language sql security definer stable;

-- Step 2: Drop ALL old profile SELECT policies
drop policy if exists "Users can view own profile" on profiles;
drop policy if exists "Teachers can view school profiles" on profiles;
drop policy if exists "Admin teachers can view all profiles" on profiles;

-- Step 3: Recreate clean non-recursive policies on profiles
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Admin teachers can view all profiles"
  on profiles for select using (is_admin_teacher());

create policy "Teachers can view school profiles"
  on profiles for select using (is_teacher_at_school(school));

-- Step 4: INSERT policy (needed if handle_new_user trigger didn't fire)
drop policy if exists "Users can insert own profile" on profiles;
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);

-- Step 5: Fix login_sessions
drop policy if exists "Teachers can view school login sessions" on login_sessions;
drop policy if exists "Admin teachers can view all login sessions" on login_sessions;

create policy "Admin teachers can view all login sessions"
  on login_sessions for select using (is_admin_teacher());

-- Step 6: Fix activity_logs
drop policy if exists "Teachers can view school activity logs" on activity_logs;
drop policy if exists "Admin teachers can view all activity logs" on activity_logs;

create policy "Admin teachers can view all activity logs"
  on activity_logs for select using (is_admin_teacher());

-- Step 7: Fix student_progress
drop policy if exists "Admin teachers can view all student progress" on student_progress;

create policy "Admin teachers can view all student progress"
  on student_progress for select using (is_admin_teacher());

-- ============================================================
-- NOTE: Admin teacher emails are configured in:
--   src/lib/adminEmails.ts
-- Currently: uday@teknomatics.com
-- Admin teachers get school='Admin' and role='teacher' auto-set
-- ============================================================
