-- Sprint 2 — server-side chapter content (plan §3)
--
-- Premium chapter content moves OUT of the JS bundle into this table. There
-- are deliberately NO client RLS policies: the only read path is the
-- get-chapter Edge Function (service role), which checks has_access() first.
-- The UI locks stay cosmetic; this is the real gate.
create table chapter_content (
  chapter_id text primary key,        -- namespaced: 'c10-hist-ch2'
  content jsonb not null,
  updated_at timestamptz not null default now()
);
alter table chapter_content enable row level security;
-- no policies: service-role access only.
