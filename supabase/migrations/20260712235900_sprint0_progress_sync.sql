-- Sprint 0 — cross-device sync (plan §9.1)
--
-- Reshapes student_progress from a write-only blob (one 'global' row per user)
-- into fine-grained rows that merge safely across devices, adds sync columns to
-- flashcard_state (SM-2 state was localStorage-only until now), and namespaces
-- chapter ids to the canonical content-id format (c10-hist-ch1) from day one.
--
-- Row model for student_progress after this migration:
--   kind='section'    item_id=<sectionId>     progress_data=SectionProgress json
--   kind='subsection' item_id=<subsectionId>  progress_data={"done":true}
--   kind='quiz'       item_id=<quizId>        progress_data={"stars":n}
--   kind='meta'       item_id='meta', chapter_id='global'
--                     progress_data={"totalStars":n,"currentStreak":n}
--   kind='legacy'     the pre-Sprint-0 blob rows (client merges then deletes them)

-- ============================================================
-- student_progress: blob → fine-grained rows
-- ============================================================
alter table student_progress drop constraint student_progress_pkey;
alter table student_progress rename column section_id to item_id;
alter table student_progress add column kind text not null default 'section';

-- The old write-only sync stored the whole store blob under section_id='global'.
update student_progress set kind = 'legacy' where item_id = 'global';

-- Namespace chapter ids (c10-hist-ch1 format, plan §9.1 Sprint 1 note).
update student_progress set chapter_id = 'ch1' where chapter_id is null;
update student_progress set chapter_id = 'c10-hist-' || chapter_id
  where chapter_id ~ '^ch[0-9]+$';

alter table student_progress alter column chapter_id set not null;
alter table student_progress alter column chapter_id drop default;

alter table student_progress add constraint student_progress_kind_check
  check (kind in ('meta', 'section', 'subsection', 'quiz', 'legacy'));
alter table student_progress add primary key (user_id, chapter_id, kind, item_id);

-- Client deletes its own legacy row after the one-time keep-highest merge.
create policy "Users can delete own progress"
  on student_progress for delete using (auth.uid() = user_id);

-- ============================================================
-- flashcard_state: enable sync (table existed but was never written)
-- ============================================================
alter table flashcard_state add column if not exists updated_at timestamptz not null default now();

update flashcard_state set chapter_id =
  case when card_id ~ '^ch[0-9]+-'
       then 'c10-hist-' || substring(card_id from '^(ch[0-9]+)')
       else 'c10-hist-ch1' end;
alter table flashcard_state alter column chapter_id set not null;
alter table flashcard_state alter column chapter_id drop default;

create policy "Users can delete own flashcard state"
  on flashcard_state for delete using (auth.uid() = user_id);

create index if not exists flashcard_state_due_idx
  on flashcard_state (user_id, next_review_at);

-- ============================================================
-- activity_logs: namespace chapter ids + query index
-- ============================================================
-- Keep the 'ch1' default for now: the live client (main) still inserts short
-- slugs; a Sprint 1 migration re-canonicalises stragglers once main is updated.
update activity_logs set chapter_id = coalesce(chapter_id, 'ch1');
update activity_logs set chapter_id = 'c10-hist-' || chapter_id
  where chapter_id ~ '^ch[0-9]+$';

create index if not exists activity_logs_user_time_idx
  on activity_logs (user_id, completed_at desc);
