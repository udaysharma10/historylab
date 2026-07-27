-- Sprint 1 — access & admin (plan §9.1)
--
-- Server-side admin identity, commerce/access tables (products, purchases,
-- entitlements, examiner_reviews, payment_events), public capture tables
-- (class_interest, parent_updates), has_access(), guardian/DPDPA columns on
-- profiles, and retirement of the teacher-role policies (privilege hole: any
-- user could update their own role to 'teacher' and read same-school data).
--
-- Content/product ids are namespaced (c10-hist-ch2) — plan §9.1 Sprint 1.

-- ============================================================
-- admins: server-side admin identity (no client policies at all)
-- ============================================================
create table admins (
  user_id uuid primary key references profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table admins enable row level security;
-- Deliberately NO policies: clients can neither read nor write this table.
-- Manage via SQL editor / service role only.

create or replace function is_admin()
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from admins where user_id = auth.uid())
$$;

-- Seed known admin accounts (only those that already have profiles).
insert into admins (user_id)
select id from profiles
where lower(email) in ('udaysharma10@gmail.com', 'uday@teknomatics.com', 'nehaudaysharma@gmail.com')
on conflict do nothing;

-- ============================================================
-- Close the teacher-role privilege hole, replace with admin visibility
-- ============================================================
drop policy if exists "Teachers can view school profiles" on profiles;
drop policy if exists "Teachers can view school login sessions" on login_sessions;
drop policy if exists "Teachers can view school activity" on activity_logs;

create policy "Admins can view all profiles"
  on profiles for select using (is_admin());
create policy "Admins can view all login sessions"
  on login_sessions for select using (is_admin());
create policy "Admins can view all activity"
  on activity_logs for select using (is_admin());
create policy "Admins can view all progress"
  on student_progress for select using (is_admin());

-- ============================================================
-- profiles: guardian email + DPDPA parental consent (plan §5)
-- ============================================================
alter table profiles
  add column if not exists guardian_email text,
  add column if not exists guardian_consent_at timestamptz;

-- ============================================================
-- products: chapter SKUs + add-ons (namespaced ids)
-- ============================================================
create table products (
  id text primary key,                -- 'c10-hist-ch2', 'examiner-review'
  name text not null,
  kind text not null default 'chapter' check (kind in ('chapter', 'addon')),
  price_paise int not null,           -- current selling price (19900 launch)
  list_price_paise int,               -- struck-through list price (49900)
  is_free boolean not null default false,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table products enable row level security;
create policy "Anyone can view active products"
  on products for select using (active or is_admin());
create policy "Admins manage products"
  on products for all using (is_admin()) with check (is_admin());

insert into products (id, name, kind, price_paise, list_price_paise, is_free) values
  ('c10-hist-ch1', 'Chapter 1 — The Rise of Nationalism in Europe', 'chapter', 0, null, true),
  ('c10-hist-ch2', 'Chapter 2 — Nationalism in India', 'chapter', 19900, 49900, false),
  ('examiner-review', 'Senior CBSE Examiner review (per paper)', 'addon', 14900, null, false);

-- ============================================================
-- purchases: one row per checkout attempt (writes: Edge Functions only)
-- ============================================================
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id text not null references products(id),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  amount_paise int,
  status text not null default 'created' check (status in ('created', 'paid', 'refunded')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table purchases enable row level security;
create policy "Users view own purchases"
  on purchases for select using (auth.uid() = user_id or is_admin());
-- No client insert/update: create-order + webhook Edge Functions use service role.

-- ============================================================
-- entitlements: THE access table — one row = one unlocked chapter
-- ============================================================
create table entitlements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  chapter_id text not null,           -- namespaced product id ('c10-hist-ch2')
  source text not null check (source in ('purchase', 'admin_grant')),
  purchase_id uuid references purchases(id),
  granted_by uuid references profiles(id),
  note text,
  created_at timestamptz not null default now(),
  unique (user_id, chapter_id)
);
alter table entitlements enable row level security;
create policy "Users view own entitlements"
  on entitlements for select using (auth.uid() = user_id or is_admin());
create policy "Admins grant entitlements"
  on entitlements for insert
  with check (is_admin() and source = 'admin_grant' and granted_by = auth.uid());
create policy "Admins revoke entitlements"
  on entitlements for delete using (is_admin());
-- 'purchase'-source rows are written by the webhook (service role, Sprint 3).

-- Replace the Round-8 client email allowlist with real grants (team keeps Ch2).
insert into entitlements (user_id, chapter_id, source, granted_by, note)
select p.id, 'c10-hist-ch2', 'admin_grant',
       (select id from profiles where lower(email) = 'udaysharma10@gmail.com' limit 1),
       'Team (replaces Round-8 client allowlist)'
from profiles p
where lower(p.email) in ('udaysharma10@gmail.com', 'uday@teknomatics.com',
                         'nehaudaysharma@gmail.com', 'neha.sharma-socials@ggn.hxls.org')
on conflict do nothing;

-- ============================================================
-- has_access: the single server-side access check (used by Edge Functions)
-- ============================================================
create or replace function has_access(p_user uuid, p_chapter text)
returns boolean
language sql security definer stable
set search_path = public
as $$
  select exists (select 1 from products where id = p_chapter and is_free and active)
      or exists (select 1 from entitlements where user_id = p_user and chapter_id = p_chapter)
$$;

-- ============================================================
-- examiner_reviews: human-marking add-on queue (worked in Sprint 5)
-- ============================================================
create table examiner_reviews (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null,           -- FK to attempts added in Sprint 4
  user_id uuid not null references profiles(id) on delete cascade,
  purchase_id uuid references purchases(id),
  status text not null default 'queued' check (status in ('queued', 'in_review', 'returned')),
  examiner_id uuid references profiles(id),
  returned_at timestamptz,
  created_at timestamptz not null default now()
);
alter table examiner_reviews enable row level security;
create policy "Users view own examiner reviews"
  on examiner_reviews for select using (auth.uid() = user_id or is_admin());
create policy "Admins work the examiner queue"
  on examiner_reviews for update using (is_admin()) with check (is_admin());

-- ============================================================
-- payment_events: immutable webhook audit log (service-role writes only)
-- ============================================================
create table payment_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  razorpay_event_id text unique,
  type text,
  raw jsonb,
  created_at timestamptz not null default now()
);
alter table payment_events enable row level security;
create policy "Admins view payment events"
  on payment_events for select using (is_admin());

-- ============================================================
-- Public capture tables (landing page, Sprint 2): insert-only for visitors,
-- read for admins. Turnstile shields the forms (plan §12).
-- ============================================================
create table class_interest (
  id uuid primary key default gen_random_uuid(),
  class_label text not null,          -- 'class-9', 'class-6-8', ...
  email text not null,
  created_at timestamptz not null default now(),
  unique (class_label, email)
);
alter table class_interest enable row level security;
create policy "Anyone can register class interest"
  on class_interest for insert with check (true);
create policy "Admins view class interest"
  on class_interest for select using (is_admin());

create table parent_updates (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);
alter table parent_updates enable row level security;
create policy "Anyone can subscribe to parent updates"
  on parent_updates for insert with check (true);
create policy "Admins view parent updates"
  on parent_updates for select using (is_admin());
