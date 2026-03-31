-- ============================================================
-- FIX: Allow admin teachers to see ALL users across all schools
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. PROFILES: Admin teachers can view ALL profiles (any school)
create policy "Admin teachers can view all profiles"
  on profiles for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = 'Admin'
    )
  );

-- 2. LOGIN_SESSIONS: Admin teachers can view ALL login sessions
create policy "Admin teachers can view all login sessions"
  on login_sessions for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = 'Admin'
    )
  );

-- 3. ACTIVITY_LOGS: Admin teachers can view ALL activity logs
create policy "Admin teachers can view all activity logs"
  on activity_logs for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = 'Admin'
    )
  );

-- 4. STUDENT_PROGRESS: Admin teachers can view ALL progress
create policy "Admin teachers can view all student progress"
  on student_progress for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = 'Admin'
    )
  );

-- ============================================================
-- 5. PROFILES: Allow users to insert their own profile row
-- (needed if handle_new_user trigger didn't fire)
-- ============================================================
-- Run this ONLY if users are stuck on "Saving..." during profile setup:
-- create policy "Users can insert own profile"
--   on profiles for insert with check (auth.uid() = id);

-- ============================================================
-- VERIFY: Check that the other two users exist in profiles
-- ============================================================
-- select id, name, email, role, school, profile_completed, created_at
-- from profiles
-- order by created_at desc;
--
-- If udaysharma10@gmail.com or nehaudaysharma@gmail.com don't appear,
-- they may not have completed profile setup.
-- ============================================================
