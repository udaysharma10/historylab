-- Milestone B — Examiner Review (decision #39, locked 2026-07-27):
-- NO AI marking. Neha marks every submitted-for-review attempt by hand.
-- ₹149 per attempt (product 'examiner-review', seeded Sprint 1), no cap
-- (capacity handled operationally), no refunds, in-app-only notification.
-- Lifecycle: paid -> marked (re-publish allowed = silent edits).
-- Examiner marks live HERE (marks jsonb), not on answers rows — unanswered
-- questions have no answers row, and one owner makes edits trivial.

-- Purchases learn which attempt an addon purchase is for.
alter table purchases add column if not exists attempt_id uuid references attempts(id) on delete set null;

-- Rework the Sprint-1 placeholder lifecycle (queued/in_review/returned — never used).
alter table examiner_reviews drop constraint if exists examiner_reviews_status_check;
alter table examiner_reviews alter column status set default 'paid';
update examiner_reviews set status = 'paid' where status in ('queued', 'in_review');
update examiner_reviews set status = 'marked' where status = 'returned';
alter table examiner_reviews add constraint examiner_reviews_status_check
  check (status in ('paid', 'marked', 'refunded'));

alter table examiner_reviews add column if not exists marks jsonb;          -- {question_id: {marks: n, comment: ""}}
alter table examiner_reviews add column if not exists overall_comment text;
alter table examiner_reviews add column if not exists marked_at timestamptz;

-- One review per attempt, and "the paper stays always": attempts cascade from
-- papers, so RESTRICT here blocks deleting any attempt (and transitively any
-- paper) that carries a paid review. UI guards give the friendly message.
alter table examiner_reviews
  add constraint examiner_reviews_attempt_fk
  foreign key (attempt_id) references attempts(id) on delete restrict;
create unique index if not exists examiner_reviews_attempt_idx on examiner_reviews (attempt_id);
create index if not exists examiner_reviews_status_idx on examiner_reviews (status, created_at);
