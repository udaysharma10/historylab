// Pure merge rules for cross-device sync (Sprint 0). No I/O, no store imports —
// keep it that way so the rules stay unit-testable in plain Node.
//
// Locked merge policy (plan §9.1): KEEP-HIGHEST. A student can never lose
// progress by signing in somewhere else.
//   - section stats:  element-wise max of the counters
//   - subsections:    union (done anywhere = done)
//   - quiz stars:     max
//   - totals/streak:  max(local, server, derived-from-merged-parts)
//   - flashcards:     last-write-wins per card by lastReviewedAt (SM-2 state is
//                     a chain — the most recent review is the true state)
import type { SectionProgress, FlashcardReviewState } from '../types/progress'

export interface ProgressSnapshot {
  totalStars: number
  currentStreak: number
  /** chapter slug → section id → stats */
  chapters: Record<string, Record<string, SectionProgress>>
  completedSubsections: Record<string, boolean>
  narrativeQuizStars: Record<string, number>
}

export interface ProgressMeta {
  totalStars: number
  currentStreak: number
}

export const emptySnapshot = (): ProgressSnapshot => ({
  totalStars: 0,
  currentStreak: 0,
  chapters: {},
  completedSubsections: {},
  narrativeQuizStars: {},
})

/**
 * Subsection/quiz/flashcard ids carry their chapter: ch2+ ids are prefixed
 * (ch2-s1-hook, ch2-fc-001); unprefixed ids are ch1 (the app's original
 * chapter). This is the storage convention — new chapters MUST prefix ids.
 */
export function inferChapterSlug(itemId: string): string {
  const m = /^(ch\d+)-/.exec(itemId)
  return m ? m[1] : 'ch1'
}

export function mergeSection(a?: SectionProgress, b?: SectionProgress): SectionProgress {
  return {
    completed: Math.max(a?.completed ?? 0, b?.completed ?? 0),
    total: Math.max(a?.total ?? 0, b?.total ?? 0),
    stars: Math.max(a?.stars ?? 0, b?.stars ?? 0),
    maxStars: Math.max(a?.maxStars ?? 0, b?.maxStars ?? 0),
    bestStreak: Math.max(a?.bestStreak ?? 0, b?.bestStreak ?? 0),
    lastPlayed: [a?.lastPlayed, b?.lastPlayed].filter(Boolean).sort().pop(),
  }
}

function sectionEquals(a: SectionProgress, b?: SectionProgress): boolean {
  if (!b) return false
  return (
    a.completed === b.completed &&
    a.total === b.total &&
    a.stars === b.stars &&
    a.maxStars === b.maxStars &&
    a.bestStreak === b.bestStreak &&
    (a.lastPlayed ?? null) === (b.lastPlayed ?? null)
  )
}

/**
 * Merge local state with the server snapshot. Returns the merged state plus
 * the dirty keys (syncBus format) where merged ≠ server, i.e. rows the client
 * must push so the server catches up.
 */
export function mergeProgress(
  local: ProgressSnapshot,
  server: ProgressSnapshot | null
): { merged: ProgressSnapshot; dirtyKeys: string[] } {
  const srv = server ?? emptySnapshot()
  const dirty = new Set<string>()
  const merged = emptySnapshot()

  const chapterSlugs = new Set([...Object.keys(local.chapters), ...Object.keys(srv.chapters)])
  for (const slug of chapterSlugs) {
    const out: Record<string, SectionProgress> = {}
    const sids = new Set([
      ...Object.keys(local.chapters[slug] ?? {}),
      ...Object.keys(srv.chapters[slug] ?? {}),
    ])
    for (const sid of sids) {
      const m = mergeSection(local.chapters[slug]?.[sid], srv.chapters[slug]?.[sid])
      out[sid] = m
      if (!sectionEquals(m, srv.chapters[slug]?.[sid])) dirty.add(`sec:${slug}:${sid}`)
    }
    merged.chapters[slug] = out
  }

  for (const id of new Set([
    ...Object.keys(local.completedSubsections),
    ...Object.keys(srv.completedSubsections),
  ])) {
    if (!local.completedSubsections[id] && !srv.completedSubsections[id]) continue
    merged.completedSubsections[id] = true
    if (!srv.completedSubsections[id]) dirty.add(`sub:${inferChapterSlug(id)}:${id}`)
  }

  for (const id of new Set([
    ...Object.keys(local.narrativeQuizStars),
    ...Object.keys(srv.narrativeQuizStars),
  ])) {
    const m = Math.max(local.narrativeQuizStars[id] ?? 0, srv.narrativeQuizStars[id] ?? 0)
    merged.narrativeQuizStars[id] = m
    if (m !== (srv.narrativeQuizStars[id] ?? -1)) dirty.add(`quiz:${inferChapterSlug(id)}:${id}`)
  }

  // Totals: keep-highest of both devices and of the recomputed sum — after an
  // element-wise merge the parts can legitimately exceed either device's total.
  const derived =
    Object.values(merged.chapters).reduce(
      (sum, sections) => sum + Object.values(sections).reduce((s, sec) => s + sec.stars, 0),
      0
    ) + Object.values(merged.narrativeQuizStars).reduce((s, n) => s + n, 0)
  merged.totalStars = Math.max(local.totalStars, srv.totalStars, derived)
  merged.currentStreak = Math.max(local.currentStreak, srv.currentStreak)
  if (merged.totalStars !== srv.totalStars || merged.currentStreak !== srv.currentStreak) {
    dirty.add('meta')
  }

  return { merged, dirtyKeys: [...dirty] }
}

export function mergeFlashcards(
  local: Record<string, FlashcardReviewState>,
  server: Record<string, FlashcardReviewState>
): { merged: Record<string, FlashcardReviewState>; dirtyIds: string[] } {
  const merged: Record<string, FlashcardReviewState> = {}
  const dirty: string[] = []
  for (const id of new Set([...Object.keys(local), ...Object.keys(server)])) {
    const l = local[id]
    const s = server[id]
    if (!l) {
      merged[id] = s
    } else if (!s) {
      merged[id] = l
      dirty.push(id)
    } else if ((l.lastReviewedAt ?? '') > (s.lastReviewedAt ?? '')) {
      merged[id] = l
      dirty.push(id)
    } else {
      merged[id] = s
    }
  }
  return { merged, dirtyIds: dirty }
}

/**
 * Shape of the pre-Sprint-0 store blob: the localStorage persist v0 state and
 * the server's legacy 'global' rows both look like this. All section stats are
 * attributed to ch1 — the pilot cohort only had Chapter 1 (Ch2 was allowlist-
 * gated to the team, whose mixed stats we knowingly accept under ch1).
 */
export interface LegacyBlob {
  totalStars?: number
  currentStreak?: number
  sections?: Record<string, SectionProgress>
  completedSubsections?: Record<string, boolean>
  narrativeQuizStars?: Record<string, number>
}

export function legacyToSnapshot(blob: LegacyBlob): ProgressSnapshot {
  const sections: Record<string, SectionProgress> = {}
  for (const [sid, sec] of Object.entries(blob.sections ?? {})) {
    // Drop untouched default rows so they don't create pointless server rows.
    if (sec.completed || sec.stars || sec.total || sec.bestStreak) {
      sections[sid] = { ...sec }
    }
  }
  return {
    totalStars: blob.totalStars ?? 0,
    currentStreak: blob.currentStreak ?? 0,
    chapters: Object.keys(sections).length ? { ch1: sections } : {},
    completedSubsections: { ...(blob.completedSubsections ?? {}) },
    narrativeQuizStars: { ...(blob.narrativeQuizStars ?? {}) },
  }
}
