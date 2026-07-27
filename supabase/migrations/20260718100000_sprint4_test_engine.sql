-- Sprint 4 — CBSE test engine core (plan §7, §9.1 sprint 4)
--
-- Server-side papers/questions + attempts/answers. Trust boundaries (§12.1):
-- attempts, answers, marks, and timers are written ONLY by the test-engine
-- Edge Function (service role). Questions carry correct answers and marking
-- schemes, so the questions/paper_sources tables have NO client policies at
-- all — the function serves questions without answer keys during an attempt
-- and reveals keys only on a submitted attempt's results.

-- ============================================================
-- papers: one CBSE-pattern paper per row (chapter-scoped)
-- ============================================================
create table papers (
  id text primary key,                          -- e.g. c10-hist-ch2-p1
  chapter_id text not null,                     -- namespaced chapter key (c10-hist-ch2)
  title text not null,
  description text,
  total_marks int not null default 0,           -- maintained on upsert from questions
  objective_marks int not null default 0,       -- auto-markable subtotal
  question_count int not null default 0,
  duration_minutes int not null,
  position int not null default 1,              -- order within the chapter's Test Centre
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table papers enable row level security;

-- Paper metadata (title/marks/duration) is not sensitive — signed-in users can
-- browse the published list (the Test Centre teaser for unentitled users).
-- Drafts are server/admin-only.
create policy "Signed-in users can view published papers"
  on papers for select using (auth.uid() is not null and status = 'published');
create policy "Admins can view all papers"
  on papers for select using (is_admin());

-- ============================================================
-- paper_sources: passages for source-based / case-based questions
-- ============================================================
create table paper_sources (
  paper_id text not null references papers(id) on delete cascade,
  source_id text not null,
  title text,
  body text not null,
  primary key (paper_id, source_id)
);
alter table paper_sources enable row level security;
-- NO client policies — served only via the test-engine function.

-- ============================================================
-- questions: one markable unit per row (answer keys live here)
-- ============================================================
create table questions (
  id uuid primary key default gen_random_uuid(),
  paper_id text not null references papers(id) on delete cascade,
  position int not null,
  section_label text not null default 'A',      -- CBSE section (A objective, B/C short, D long, E source)
  qtype text not null check (qtype in ('mcq', 'text')),
  marks int not null check (marks between 1 and 10),
  prompt text not null,
  source_id text,                               -- links to paper_sources for source-based groups
  options jsonb,                                -- mcq: array of option strings
  correct_index int,                            -- mcq answer key (NEVER leaves the server pre-submit)
  scheme jsonb,                                 -- marking scheme: { model_answer, points: [{point, marks}] }
  created_at timestamptz not null default now(),
  unique (paper_id, position)
);
alter table questions enable row level security;
-- NO client policies — this table holds the answer keys.

create index questions_paper_idx on questions (paper_id, position);

-- ============================================================
-- attempts: one timed run at a paper (server owns the clock)
-- ============================================================
create table attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  paper_id text not null references papers(id) on delete cascade,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'submitted')),
  started_at timestamptz not null default now(),
  deadline timestamptz not null,                -- started_at + duration + grace; server-enforced
  submitted_at timestamptz,
  auto_submitted boolean not null default false,-- deadline lapsed before the student pressed submit
  objective_awarded numeric,                    -- auto-marked subtotal (set on submit)
  objective_max numeric,
  created_at timestamptz not null default now()
);
alter table attempts enable row level security;

create policy "Users can view own attempts"
  on attempts for select using (auth.uid() = user_id);
create policy "Admins can view all attempts"
  on attempts for select using (is_admin());
-- NO insert/update/delete policies: the Edge Function (service role) is the
-- only writer. The server owns started_at, deadline, and marks.

-- One live attempt per user per paper (multiple submitted attempts allowed —
-- unlimited re-attempts are part of the paid offer).
create unique index attempts_one_live_idx
  on attempts (user_id, paper_id) where status = 'in_progress';
create index attempts_user_idx on attempts (user_id, paper_id, created_at desc);

-- ============================================================
-- answers: the student's saved responses, marked on submit
-- ============================================================
create table answers (
  attempt_id uuid not null references attempts(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  response jsonb not null,                      -- {choice: n} for mcq, {text: "..."} for typed
  saved_at timestamptz not null default now(),
  is_correct boolean,                           -- mcq only, set on submit
  marks_awarded numeric,                        -- objective on submit; subjective in Sprint 5 (AI marking)
  marking jsonb,                                -- per-point feedback (Sprint 5)
  primary key (attempt_id, question_id)
);
alter table answers enable row level security;

create policy "Users can view answers on own attempts"
  on answers for select using (
    exists (
      select 1 from attempts a
      where a.id = answers.attempt_id and a.user_id = auth.uid()
    )
  );
create policy "Admins can view all answers"
  on answers for select using (is_admin());
-- NO client write policies — autosave goes through the Edge Function so the
-- server can reject writes past the deadline and own all marks.
