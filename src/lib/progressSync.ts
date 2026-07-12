// Offline-first sync engine (Sprint 0). Local Zustand stores stay the source
// of truth for the UI; this module hydrates them from Supabase at sign-in
// (keep-highest merge — see progressMerge.ts) and flushes dirty keys back on a
// debounce. The dirty queue is persisted (syncBus), so offline work survives
// reloads and is pushed when connectivity returns.
//
// Shared-device guard: local state belongs to the first account that signs in
// on this device (that claim IS the pilot localStorage migration). If a
// different account signs in later, local stores are reset and re-hydrated
// from that account's server state instead of polluting it.
import { supabase } from './supabase'
import { chapterKey, chapterSlug, META_CHAPTER } from './contentIds'
import {
  mergeProgress,
  mergeFlashcards,
  legacyToSnapshot,
  emptySnapshot,
  inferChapterSlug,
  type ProgressSnapshot,
  type LegacyBlob,
} from './progressMerge'
import { setFlusher, peekQueue, clearKeys, clearQueue, markDirty } from './syncBus'
import { useProgressStore } from '../store/useProgressStore'
import { useFlashcardStore } from '../store/useFlashcardStore'
import type { FlashcardReviewState } from '../types/progress'

const OWNER_KEY = 'historylab-owner'
const RETRY_MS = 30_000
const CHUNK = 200

let activeUserId: string | null = null
let hydrated = false
let flushing = false
let legacyCleanupPending = false
let retryTimer: ReturnType<typeof setTimeout> | null = null

interface ProgressRow {
  chapter_id: string
  kind: string
  item_id: string
  progress_data: Record<string, unknown>
}

interface FlashcardRow {
  card_id: string
  ease_factor: number
  interval_days: number
  repetitions: number
  next_review_at: string | null
  last_reviewed_at: string | null
}

function scheduleRetry() {
  if (retryTimer) clearTimeout(retryTimer)
  retryTimer = setTimeout(() => {
    retryTimer = null
    if (!hydrated) {
      hydrate().catch(scheduleRetry)
    } else {
      flush()
    }
  }, RETRY_MS)
}

function localProgressSnapshot(): ProgressSnapshot {
  const s = useProgressStore.getState()
  return {
    totalStars: s.totalStars,
    currentStreak: s.currentStreak,
    chapters: s.chapters,
    completedSubsections: s.completedSubsections,
    narrativeQuizStars: s.narrativeQuizStars,
  }
}

function serverSnapshotFromRows(rows: ProgressRow[]): ProgressSnapshot {
  let snap = emptySnapshot()
  for (const row of rows) {
    const slug = chapterSlug(row.chapter_id)
    const data = row.progress_data ?? {}
    switch (row.kind) {
      case 'meta':
        snap.totalStars = Number(data.totalStars ?? 0)
        snap.currentStreak = Number(data.currentStreak ?? 0)
        break
      case 'section':
        ;(snap.chapters[slug] ??= {})[row.item_id] = {
          completed: Number(data.completed ?? 0),
          total: Number(data.total ?? 0),
          stars: Number(data.stars ?? 0),
          maxStars: Number(data.maxStars ?? 0),
          bestStreak: Number(data.bestStreak ?? 0),
          lastPlayed: (data.lastPlayed as string) || undefined,
        }
        break
      case 'subsection':
        snap.completedSubsections[row.item_id] = true
        break
      case 'quiz':
        snap.narrativeQuizStars[row.item_id] = Number(data.stars ?? 0)
        break
      case 'legacy': {
        // Pre-Sprint-0 blob — fold it in keep-highest, then it gets deleted
        // after the first successful flush.
        legacyCleanupPending = true
        snap = mergeProgress(legacyToSnapshot(data as LegacyBlob), snap).merged
        break
      }
    }
  }
  return snap
}

function reviewStateFromRow(row: FlashcardRow): FlashcardReviewState {
  return {
    cardId: row.card_id,
    interval: row.interval_days,
    repetition: row.repetitions,
    easeFactor: row.ease_factor,
    nextReview: (row.next_review_at ?? new Date().toISOString()).slice(0, 10),
    lastReviewedAt: row.last_reviewed_at ?? undefined,
  }
}

async function hydrate(): Promise<void> {
  if (!activeUserId) return
  const userId = activeUserId

  const [progressRes, flashRes] = await Promise.all([
    supabase
      .from('student_progress')
      .select('chapter_id, kind, item_id, progress_data')
      .eq('user_id', userId),
    supabase
      .from('flashcard_state')
      .select('card_id, ease_factor, interval_days, repetitions, next_review_at, last_reviewed_at')
      .eq('user_id', userId),
  ])
  if (progressRes.error) throw progressRes.error
  if (flashRes.error) throw flashRes.error
  if (activeUserId !== userId) return // signed out / switched mid-fetch

  const server = serverSnapshotFromRows((progressRes.data ?? []) as ProgressRow[])
  const { merged, dirtyKeys } = mergeProgress(localProgressSnapshot(), server)
  useProgressStore.setState({
    totalStars: merged.totalStars,
    currentStreak: merged.currentStreak,
    chapters: merged.chapters,
    completedSubsections: merged.completedSubsections,
    narrativeQuizStars: merged.narrativeQuizStars,
  })

  const serverCards: Record<string, FlashcardReviewState> = {}
  for (const row of (flashRes.data ?? []) as FlashcardRow[]) {
    serverCards[row.card_id] = reviewStateFromRow(row)
  }
  const fc = mergeFlashcards(useFlashcardStore.getState().reviewStates, serverCards)
  useFlashcardStore.setState({ reviewStates: fc.merged })

  hydrated = true
  const fcKeys = fc.dirtyIds.map((id) => `fc:${inferChapterSlug(id)}:${id}`)
  if (dirtyKeys.length || fcKeys.length) {
    markDirty(...dirtyKeys, ...fcKeys)
  } else {
    // Covers legacy-row cleanup and any keys queued while hydration was in
    // flight (flush no-ops when there is nothing to do).
    flush()
  }
}

async function flush(): Promise<void> {
  if (!activeUserId || !hydrated || flushing) return
  const userId = activeUserId
  const keys = peekQueue()
  if (keys.length === 0 && !legacyCleanupPending) return
  flushing = true

  try {
    const progress = useProgressStore.getState()
    const cards = useFlashcardStore.getState().reviewStates
    const now = new Date().toISOString()

    const progressRows: Record<string, unknown>[] = []
    const flashRows: Record<string, unknown>[] = []
    const handled: string[] = []

    for (const key of keys) {
      if (key === 'meta') {
        progressRows.push({
          user_id: userId,
          chapter_id: META_CHAPTER,
          kind: 'meta',
          item_id: 'meta',
          progress_data: {
            totalStars: progress.totalStars,
            currentStreak: progress.currentStreak,
          },
          updated_at: now,
        })
        handled.push(key)
        continue
      }
      const [type, slug, ...rest] = key.split(':')
      const itemId = rest.join(':')
      if (type === 'sec') {
        const sec = progress.chapters[slug]?.[itemId]
        if (sec) {
          progressRows.push({
            user_id: userId,
            chapter_id: chapterKey(slug),
            kind: 'section',
            item_id: itemId,
            progress_data: sec,
            updated_at: now,
          })
        }
      } else if (type === 'sub') {
        if (progress.completedSubsections[itemId]) {
          progressRows.push({
            user_id: userId,
            chapter_id: chapterKey(slug),
            kind: 'subsection',
            item_id: itemId,
            progress_data: { done: true },
            updated_at: now,
          })
        }
      } else if (type === 'quiz') {
        if (itemId in progress.narrativeQuizStars) {
          progressRows.push({
            user_id: userId,
            chapter_id: chapterKey(slug),
            kind: 'quiz',
            item_id: itemId,
            progress_data: { stars: progress.narrativeQuizStars[itemId] },
            updated_at: now,
          })
        }
      } else if (type === 'fc') {
        const st = cards[itemId]
        if (st) {
          flashRows.push({
            user_id: userId,
            card_id: itemId,
            chapter_id: chapterKey(slug),
            ease_factor: st.easeFactor,
            interval_days: st.interval,
            repetitions: st.repetition,
            next_review_at: `${st.nextReview}T00:00:00.000Z`,
            last_reviewed_at: st.lastReviewedAt ?? now,
            updated_at: now,
          })
        }
      }
      handled.push(key)
    }

    for (let i = 0; i < progressRows.length; i += CHUNK) {
      const { error } = await supabase
        .from('student_progress')
        .upsert(progressRows.slice(i, i + CHUNK), {
          onConflict: 'user_id,chapter_id,kind,item_id',
        })
      if (error) throw error
    }
    for (let i = 0; i < flashRows.length; i += CHUNK) {
      const { error } = await supabase
        .from('flashcard_state')
        .upsert(flashRows.slice(i, i + CHUNK), { onConflict: 'user_id,card_id' })
      if (error) throw error
    }

    clearKeys(handled)

    if (legacyCleanupPending) {
      const { error } = await supabase
        .from('student_progress')
        .delete()
        .eq('user_id', userId)
        .eq('kind', 'legacy')
      if (!error) legacyCleanupPending = false
    }
  } catch {
    scheduleRetry() // queue keeps the keys; try again later
  } finally {
    flushing = false
  }
}

function onOnline() {
  if (!hydrated) {
    hydrate().catch(scheduleRetry)
  } else {
    flush()
  }
}

export function startSync(userId: string) {
  if (activeUserId === userId) return
  activeUserId = userId
  hydrated = false
  legacyCleanupPending = false

  // First account to sign in on this device claims any pre-auth local state
  // (that is the pilot-student migration). A different account gets a reset.
  const owner = localStorage.getItem(OWNER_KEY)
  if (owner && owner !== userId) {
    useProgressStore.getState().resetForNewUser()
    useFlashcardStore.setState({ reviewStates: {} })
    clearQueue()
  }
  localStorage.setItem(OWNER_KEY, userId)

  setFlusher(() => {
    flush()
  })
  window.addEventListener('online', onOnline)
  hydrate().catch(scheduleRetry)
}

export function stopSync() {
  activeUserId = null
  hydrated = false
  setFlusher(null)
  window.removeEventListener('online', onOnline)
  if (retryTimer) clearTimeout(retryTimer)
  retryTimer = null
}
