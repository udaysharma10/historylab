import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SectionProgress, Achievement } from '../types/progress'
import { markDirty } from '../lib/syncBus'
import { legacyToSnapshot, inferChapterSlug, type LegacyBlob } from '../lib/progressMerge'

// Sprint 0: progress is chapter-keyed (ch1 and ch2 both use section ids
// s1..s4/6, so a flat map conflated them) and every mutation marks a dirty key
// for the sync engine (lib/progressSync.ts). Subsection/quiz ids carry their
// chapter (ch2-* prefix; unprefixed = ch1), so those actions stay flat.
interface ProgressState {
  playerName: string
  totalStars: number
  currentStreak: number
  /** chapter slug → section id → stats */
  chapters: Record<string, Record<string, SectionProgress>>
  achievements: Achievement[]
  completedSubsections: Record<string, boolean>
  narrativeQuizStars: Record<string, number>
  setPlayerName: (name: string) => void
  completeProblem: (chapterId: string, sectionId: string, stars: number) => void
  resetSection: (chapterId: string, sectionId: string) => void
  addAchievement: (achievement: Achievement) => void
  setSectionTotal: (chapterId: string, sectionId: string, total: number) => void
  completeSubsection: (subsectionId: string) => void
  setNarrativeQuizStars: (quizId: string, stars: number) => void
  resetForNewUser: () => void
}

const defaultSection = (): SectionProgress => ({
  completed: 0,
  total: 0,
  stars: 0,
  maxStars: 0,
  bestStreak: 0,
})

const initialData = () => ({
  playerName: '',
  totalStars: 0,
  currentStreak: 0,
  chapters: {} as Record<string, Record<string, SectionProgress>>,
  achievements: [] as Achievement[],
  completedSubsections: {} as Record<string, boolean>,
  narrativeQuizStars: {} as Record<string, number>,
})

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialData(),

      setPlayerName: (name) => set({ playerName: name }),

      completeProblem: (chapterId, sectionId, stars) => {
        set((state) => {
          const section = { ...(state.chapters[chapterId]?.[sectionId] ?? defaultSection()) }
          section.completed += 1
          section.stars += stars
          section.maxStars += 3
          section.lastPlayed = new Date().toISOString()
          const newStreak = state.currentStreak + 1
          if (newStreak > section.bestStreak) {
            section.bestStreak = newStreak
          }
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: { ...state.chapters[chapterId], [sectionId]: section },
            },
            totalStars: state.totalStars + stars,
            currentStreak: newStreak,
          }
        })
        markDirty(`sec:${chapterId}:${sectionId}`, 'meta')
      },

      resetSection: (chapterId, sectionId) => {
        set((state) => {
          const section = state.chapters[chapterId]?.[sectionId]
          if (!section) return state
          return {
            chapters: {
              ...state.chapters,
              [chapterId]: {
                ...state.chapters[chapterId],
                [sectionId]: { ...defaultSection(), total: section.total },
              },
            },
            totalStars: Math.max(0, state.totalStars - section.stars),
          }
        })
        markDirty(`sec:${chapterId}:${sectionId}`, 'meta')
      },

      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, { ...achievement, unlockedAt: new Date().toISOString() }],
        })),

      setSectionTotal: (chapterId, sectionId, total) => {
        set((state) => ({
          chapters: {
            ...state.chapters,
            [chapterId]: {
              ...state.chapters[chapterId],
              [sectionId]: { ...(state.chapters[chapterId]?.[sectionId] ?? defaultSection()), total },
            },
          },
        }))
        markDirty(`sec:${chapterId}:${sectionId}`)
      },

      completeSubsection: (subsectionId) => {
        set((state) => ({
          completedSubsections: { ...state.completedSubsections, [subsectionId]: true },
        }))
        markDirty(`sub:${inferChapterSlug(subsectionId)}:${subsectionId}`)
      },

      setNarrativeQuizStars: (quizId, stars) => {
        set((state) => ({
          narrativeQuizStars: { ...state.narrativeQuizStars, [quizId]: stars },
          totalStars: state.totalStars + stars - (state.narrativeQuizStars[quizId] || 0),
        }))
        markDirty(`quiz:${inferChapterSlug(quizId)}:${quizId}`, 'meta')
      },

      resetForNewUser: () => set(initialData()),
    }),
    {
      name: 'vedansh-history-progress',
      version: 1,
      migrate: (persisted, version) => {
        if (version >= 1) return persisted as ProgressState
        // v0 had a flat `sections` map shared by both chapters — attribute it
        // to ch1 (pilot students only had ch1; see progressMerge.legacyToSnapshot).
        const old = (persisted ?? {}) as LegacyBlob & { playerName?: string; achievements?: Achievement[] }
        const snap = legacyToSnapshot(old)
        return {
          ...initialData(),
          playerName: old.playerName ?? '',
          achievements: old.achievements ?? [],
          totalStars: snap.totalStars,
          currentStreak: snap.currentStreak,
          chapters: snap.chapters,
          completedSubsections: snap.completedSubsections,
          narrativeQuizStars: snap.narrativeQuizStars,
        } as ProgressState
      },
    }
  )
)
