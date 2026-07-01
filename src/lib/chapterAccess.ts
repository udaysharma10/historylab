// Chapter access control (feedback-trial gate).
//
// Chapter 1 is free for everyone. Other chapters are unlocked only for the
// emails below (plus admin teachers). This lets Neha share the link with
// students so they see ONLY Chapter 1 for feedback, while the team keeps full
// access to Chapter 2.
//
// NOTE: this is a client-side (UI) gate. All chapter content still ships in the
// JS bundle, so it deters casual access, not a determined user reading the
// bundle. A true server-enforced lock is the separate PLAN_SUBSCRIPTION_LAUNCH
// work. To add/remove a trial user, edit CHAPTER_UNLOCK_EMAILS below.
import { getChapter } from '../data/books'
import { isAdminTeacher } from './adminEmails'

// Emails allowed to access gated (non-free) chapters. Keep lowercase.
export const CHAPTER_UNLOCK_EMAILS = [
  'udaysharma10@gmail.com',
  'uday@teknomatics.com', // admin (also in adminEmails) — listed here for clarity
  'nehaudaysharma@gmail.com',
  'neha.sharma-socials@ggn.hxls.org',
]

/** True if this email may open the gated (non-free) chapters. */
export function hasChapterUnlock(email: string | undefined | null): boolean {
  if (!email) return false
  const e = email.trim().toLowerCase()
  return isAdminTeacher(e) || CHAPTER_UNLOCK_EMAILS.includes(e)
}

/**
 * Whether a user may open a given chapter.
 * - Chapter must be built/live.
 * - Free chapters (Ch1) are open to everyone.
 * - Gated chapters (Ch2+) require an unlock email.
 */
export function canAccessChapter(chapterId: string, email: string | undefined | null): boolean {
  const ch = getChapter('history-10', chapterId)
  if (!ch || ch.status !== 'live') return false
  if (ch.isFree) return true
  return hasChapterUnlock(email)
}
