# HistoryLab — Auth, User Profiles & Analytics Implementation Plan

**Created**: 2026-03-29
**Goal**: Add student/teacher/parent login with Google OAuth, capture user profiles (name, school, role), track usage analytics, and provide a teacher dashboard.

---

## Architecture Overview

```
┌──────────────────┐         ┌─────────────────────────┐
│    Vercel         │         │       Supabase           │
│   (Frontend)      │────────▶│  - Auth (Google OAuth)   │
│   React + Vite    │         │  - PostgreSQL Database   │
│                   │◀────────│  - Row Level Security    │
└──────────────────┘         │  - REST/Realtime API     │
                              └─────────────────────────┘
```

**New dependency**: `@supabase/supabase-js` (only new package needed)

---

## User Flow

### First-time user
1. Lands on app → sees **Login page** (not the dashboard)
2. Clicks **"Sign in with Google"** → Google OAuth popup
3. Redirected to **Profile Setup** page:
   - **Name** (pre-filled from Google, editable)
   - **School** (text input, e.g., "DPS Gurugram")
   - **Role** (radio buttons: Student / Teacher / Parent)
   - **Class** (dropdown: 10-A, 10-B, 10-C, etc. — shown only if role = Student)
4. Clicks **"Start Learning"** → lands on Dashboard (existing HomePage)

### Returning user
1. Lands on app → auto-detected as logged in (Supabase session)
2. Goes straight to Dashboard with personalized greeting:
   - Student: "Welcome back, Vedansh! You've earned 47 stars"
   - Teacher: "Good morning, Mrs. Sharma! 23 students active today"
   - Parent: "Hi Uday! Here's Vedansh's progress"

### Logout
- Avatar menu in AppShell → "Sign Out" option

---

## Database Schema

### Table: `profiles`
Extends Supabase auth.users with app-specific fields.

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  avatar_url text,
  role text not null check (role in ('student', 'teacher', 'parent')),
  school text,
  class text,                    -- "10-A", "10-B", etc. (students only)
  profile_completed boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile row on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name, email, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

### Table: `login_sessions`
Track every login for analytics.

```sql
create table login_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  logged_in_at timestamptz default now(),
  device text,         -- 'mobile', 'tablet', 'desktop'
  user_agent text
);
```

### Table: `activity_logs`
Track what users practice — the core analytics table.

```sql
create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mode text not null,            -- 'narrative', 'quiz', 'timeline', 'maps', 'figures', 'flashcards', 'exam'
  section_id text,               -- 's1' through 's6' (null for cross-section modes)
  activity_type text,            -- 'mcq', 'fill-blank', 'true-false', 'match', 'timeline-order', 'map-identify', etc.
  stars_earned int,
  score_percent int,
  total_questions int,
  correct_answers int,
  hints_used int default 0,
  time_spent_seconds int,
  completed_at timestamptz default now()
);
```

### Table: `student_progress`
Replace localStorage — sync progress across devices.

```sql
create table student_progress (
  user_id uuid references profiles(id) on delete cascade,
  section_id text not null,
  progress_data jsonb not null,   -- existing Zustand progress state
  updated_at timestamptz default now(),
  primary key (user_id, section_id)
);
```

### Table: `flashcard_state`
SM-2 spaced repetition state (currently in localStorage).

```sql
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
```

### Row Level Security (RLS)
```sql
-- Users can only read/write their own data
alter table profiles enable row level security;
alter table login_sessions enable row level security;
alter table activity_logs enable row level security;
alter table student_progress enable row level security;
alter table flashcard_state enable row level security;

-- Profiles: users see own, teachers see all students in their school
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Teachers can view students in their school"
  on profiles for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = profiles.school
    )
  );

-- Activity logs: users see own, teachers see all in school
create policy "Users can insert own activity"
  on activity_logs for insert with check (auth.uid() = user_id);

create policy "Users can view own activity"
  on activity_logs for select using (auth.uid() = user_id);

create policy "Teachers can view school activity"
  on activity_logs for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
      and p.role = 'teacher'
      and p.school = (select school from profiles where id = activity_logs.user_id)
    )
  );
```

---

## Implementation Steps

### Phase A: Deploy Current App (no auth yet)
**Goal**: Get the app live on the internet immediately.

- [ ] **A1**: Initialize git repo in vedansh-history
- [ ] **A2**: Create GitHub repository and push code
- [ ] **A3**: Sign up on Vercel, connect repo, deploy
- [ ] **A4**: Verify app works at the Vercel URL
- [ ] **A5**: Share URL for initial testing

### Phase B: Supabase Setup
**Goal**: Set up the backend infrastructure.

- [ ] **B1**: Create Supabase project (Mumbai region)
- [ ] **B2**: Enable Google OAuth provider in Supabase Auth settings
  - Requires: Google Cloud Console project with OAuth 2.0 credentials
  - Set authorized redirect URI to Supabase callback URL
- [ ] **B3**: Run SQL migrations — create all tables (profiles, login_sessions, activity_logs, student_progress, flashcard_state)
- [ ] **B4**: Set up Row Level Security policies
- [ ] **B5**: Create the trigger for auto-creating profile on signup
- [ ] **B6**: Test auth flow from Supabase dashboard

### Phase C: Auth Integration in React App
**Goal**: Add login/logout and profile setup to the app.

New files to create:
```
src/
├── lib/
│   └── supabase.ts              # Supabase client init (uses VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
├── hooks/
│   └── useAuth.ts               # Auth state hook (current user, loading, login, logout)
├── components/
│   └── auth/
│       ├── LoginPage.tsx         # Google sign-in button, app branding, tagline
│       ├── ProfileSetup.tsx      # Name, school, role, class — post-signup form
│       └── AuthGuard.tsx         # Wrapper: redirect to login if not authenticated
└── modules/
    └── TeacherDashboard.tsx      # Analytics dashboard (Phase E)
```

Steps:
- [ ] **C1**: Install `@supabase/supabase-js`
- [ ] **C2**: Create `src/lib/supabase.ts` — init client with env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- [ ] **C3**: Create `useAuth` hook — manages auth state, provides `signInWithGoogle()`, `signOut()`, `user`, `profile`, `loading`
- [ ] **C4**: Create `LoginPage.tsx` — branded login screen with Google button, app logo, tagline ("Learn NCERT History interactively")
- [ ] **C5**: Create `ProfileSetup.tsx` — form with name (pre-filled), school (text), role (Student/Teacher/Parent radio), class (dropdown, conditional on Student role). Saves to `profiles` table, sets `profile_completed = true`
- [ ] **C6**: Create `AuthGuard.tsx` — wraps routes, checks: not logged in → LoginPage, logged in but profile incomplete → ProfileSetup, otherwise → children
- [ ] **C7**: Update `App.tsx` / `router.tsx` — wrap all routes in AuthGuard
- [ ] **C8**: Update `AppShell.tsx` — show user avatar + name, add sign-out in menu
- [ ] **C9**: Update `HomePage.tsx` — personalized greeting based on role and name
- [ ] **C10**: Add env vars to Vercel project settings (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### Phase D: Progress Sync & Activity Logging
**Goal**: Replace localStorage with Supabase, track all activity.

- [ ] **D1**: Create `src/lib/syncProgress.ts` — functions to save/load progress from `student_progress` table
- [ ] **D2**: Update `useProgressStore.ts` — on login, load from Supabase; on change, debounced save to Supabase; keep localStorage as offline fallback
- [ ] **D3**: Update `useFlashcardStore.ts` — same pattern: load from `flashcard_state`, save on change
- [ ] **D4**: Create `src/lib/logActivity.ts` — function to insert into `activity_logs` table
- [ ] **D5**: Update `QuizResults.tsx` — log activity on quiz completion (mode, section, stars, score, time)
- [ ] **D6**: Update `FlashcardMode.tsx` — log practice session completion
- [ ] **D7**: Update `SubsectionComplete.tsx` — log narrative section completion
- [ ] **D8**: Log login sessions — insert into `login_sessions` on successful auth
- [ ] **D9**: Test: login on one device, verify progress appears on another device

### Phase E: Teacher Dashboard
**Goal**: Give teachers visibility into student usage.

- [ ] **E1**: Create `TeacherDashboard.tsx` with these sections:
  - **Overview cards**: Total students, active today, active this week, total stars earned
  - **Student table**: Name, class, school, last login, total logins, sections completed, stars, time spent
  - **Activity chart**: Logins per day (last 30 days) — simple bar chart (use recharts or a lightweight lib)
  - **Mode breakdown**: Which modes are most used (quiz vs narrative vs flashcard etc.)
- [ ] **E2**: Add route `/dashboard` — only accessible to role = 'teacher'
- [ ] **E3**: Add "Dashboard" button in AppShell (visible only to teachers)
- [ ] **E4**: Create Supabase database views for efficient dashboard queries:
  ```sql
  -- Student summary view
  create view student_summary as
  select
    p.id, p.name, p.school, p.class,
    count(distinct ls.id) as total_logins,
    max(ls.logged_in_at) as last_login,
    coalesce(sum(al.stars_earned), 0) as total_stars,
    count(distinct al.id) as activities_completed,
    coalesce(sum(al.time_spent_seconds), 0) as total_time_seconds
  from profiles p
  left join login_sessions ls on ls.user_id = p.id
  left join activity_logs al on al.user_id = p.id
  where p.role = 'student'
  group by p.id, p.name, p.school, p.class;
  ```
- [ ] **E5**: Test dashboard with sample data

### Phase F: Custom Domain (Optional)
- [ ] **F1**: Purchase domain (e.g., `historylab.in` or similar)
- [ ] **F2**: Add domain in Vercel project settings
- [ ] **F3**: Update DNS records at registrar
- [ ] **F4**: Update Google OAuth redirect URIs to include custom domain
- [ ] **F5**: Update Supabase auth redirect URLs

---

## Environment Variables

### Local development (.env.local — NOT committed)
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

### Vercel (set in project settings)
Same two variables added via Vercel dashboard → Settings → Environment Variables.

### .env.example (committed — for reference)
```
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

---

## Google OAuth Setup (one-time)

1. Go to Google Cloud Console → Create project "HistoryLab"
2. APIs & Services → OAuth consent screen → External → Fill app name, email
3. Credentials → Create OAuth 2.0 Client ID → Web application
4. Add authorized redirect URI: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
5. Copy Client ID and Client Secret → paste into Supabase Auth → Google provider settings

---

## Role-based Features Summary

| Feature | Student | Teacher | Parent |
|---------|---------|---------|--------|
| All 6 learning modes | Yes | Yes | Yes |
| Progress tracking | Own | Own | View child's |
| Stars & achievements | Yes | Yes | No |
| Teacher Dashboard | No | **Yes** | No |
| Student list | No | **Yes** | No |
| Activity analytics | Own | **All students** | Child's |

---

## Estimated Free Tier Usage

| Service | Free Limit | Expected Usage |
|---------|-----------|----------------|
| Supabase Auth | 50,000 MAU | ~100-500 students |
| Supabase DB | 500 MB | ~10-50 MB (text data only) |
| Supabase API | 500K requests/month | ~50-100K |
| Vercel Hosting | 100 GB bandwidth | ~5-20 GB |
| Google OAuth | Unlimited | Unlimited |

**Total monthly cost: ₹0** (well within free tiers)

---

## Order of Execution

```
Phase A (deploy as-is) ──→ Phase B (Supabase setup) ──→ Phase C (auth in app)
                                                              │
                                                              ▼
                                                        Phase D (sync + logging)
                                                              │
                                                              ▼
                                                        Phase E (teacher dashboard)
                                                              │
                                                              ▼
                                                        Phase F (custom domain)
```

Phases A and B can be done in parallel. C through E are sequential.
