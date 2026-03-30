-- HistoryLab Database Migration
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- ============================================
-- Table: profiles
-- Extends auth.users with app-specific fields
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'teacher', 'parent')),
  school text,
  class text,
  profile_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile row when a new user signs up
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================
-- Table: login_sessions
-- Track every login for analytics
-- ============================================
create table login_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  logged_in_at timestamptz default now(),
  device text,
  user_agent text
);

-- ============================================
-- Table: activity_logs
-- Track what users practice
-- ============================================
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mode text not null,
  section_id text,
  activity_type text,
  stars_earned int,
  score_percent int,
  total_questions int,
  correct_answers int,
  hints_used int default 0,
  time_spent_seconds int,
  completed_at timestamptz default now()
);

-- ============================================
-- Table: student_progress
-- Replaces localStorage for cross-device sync
-- ============================================
create table student_progress (
  user_id uuid references profiles(id) on delete cascade,
  section_id text not null,
  progress_data jsonb not null default '{}',
  updated_at timestamptz default now(),
  primary key (user_id, section_id)
);

-- ============================================
-- Table: flashcard_state
-- SM-2 spaced repetition state
-- ============================================
create table flashcard_state (
  user_id uuid references profiles(id) on delete cascade,
  card_id text not null,
  ease_factor real default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  next_review_at timestamptz,
  last_reviewed_at timestamptz,
  primary key (user_id, card_id)
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
alter table profiles enable row level security;
alter table login_sessions enable row level security;
alter table activity_logs enable row level security;
alter table student_progress enable row level security;
alter table flashcard_state enable row level security;

-- Profiles: users can read/update their own profile
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Teachers can view all profiles in their school
create policy "Teachers can view school profiles"
  on profiles for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = profiles.school
    )
  );

-- Login sessions: users can insert/view own
create policy "Users can insert own login session"
  on login_sessions for insert with check (auth.uid() = user_id);

create policy "Users can view own login sessions"
  on login_sessions for select using (auth.uid() = user_id);

-- Teachers can view login sessions for their school
create policy "Teachers can view school login sessions"
  on login_sessions for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = (select school from profiles where id = login_sessions.user_id)
    )
  );

-- Activity logs: users can insert/view own
create policy "Users can insert own activity"
  on activity_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own activity"
  on activity_logs for select using (auth.uid() = user_id);

-- Teachers can view activity logs for their school
create policy "Teachers can view school activity"
  on activity_logs for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = (select school from profiles where id = activity_logs.user_id)
    )
  );

-- Student progress: users can insert/view/update own
create policy "Users can view own progress"
  on student_progress for select using (auth.uid() = user_id);

create policy "Users can insert own progress"
  on student_progress for insert with check (auth.uid() = user_id);

create policy "Users can update own progress"
  on student_progress for update using (auth.uid() = user_id);

-- Flashcard state: users can insert/view/update own
create policy "Users can view own flashcard state"
  on flashcard_state for select using (auth.uid() = user_id);

create policy "Users can insert own flashcard state"
  on flashcard_state for insert with check (auth.uid() = user_id);

create policy "Users can update own flashcard state"
  on flashcard_state for update using (auth.uid() = user_id);
