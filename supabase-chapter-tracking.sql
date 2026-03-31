-- ============================================================
-- Add chapter_id tracking to activity_logs and student_progress
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add chapter_id column to activity_logs
ALTER TABLE activity_logs
ADD COLUMN IF NOT EXISTS chapter_id text DEFAULT 'ch1';

-- 2. Add chapter_id column to student_progress
ALTER TABLE student_progress
ADD COLUMN IF NOT EXISTS chapter_id text DEFAULT 'ch1';

-- 3. Add chapter_id column to flashcard_state
ALTER TABLE flashcard_state
ADD COLUMN IF NOT EXISTS chapter_id text DEFAULT 'ch1';

-- 4. Update existing rows to ch1 (they were all Chapter 1)
UPDATE activity_logs SET chapter_id = 'ch1' WHERE chapter_id IS NULL;
UPDATE student_progress SET chapter_id = 'ch1' WHERE chapter_id IS NULL;
UPDATE flashcard_state SET chapter_id = 'ch1' WHERE chapter_id IS NULL;

-- ============================================================
-- Verify
-- ============================================================
-- SELECT chapter_id, COUNT(*) FROM activity_logs GROUP BY chapter_id;
-- SELECT chapter_id, COUNT(*) FROM student_progress GROUP BY chapter_id;
