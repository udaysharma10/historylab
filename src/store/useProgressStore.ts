import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SectionId, SectionProgress, Achievement } from '../types/progress'

interface ProgressState {
  playerName: string
  totalStars: number
  currentStreak: number
  sections: Record<SectionId, SectionProgress>
  achievements: Achievement[]
  completedSubsections: Record<string, boolean>
  narrativeQuizStars: Record<string, number>
  setPlayerName: (name: string) => void
  completeProblem: (sectionId: SectionId, stars: number) => void
  resetSection: (sectionId: SectionId) => void
  addAchievement: (achievement: Achievement) => void
  setSectionTotal: (sectionId: SectionId, total: number) => void
  completeSubsection: (subsectionId: string) => void
  setNarrativeQuizStars: (quizId: string, stars: number) => void
}

const defaultSection = (): SectionProgress => ({
  completed: 0,
  total: 0,
  stars: 0,
  maxStars: 0,
  bestStreak: 0,
})

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      playerName: '',
      totalStars: 0,
      currentStreak: 0,
      sections: {
        s1: defaultSection(),
        s2: defaultSection(),
        s3: defaultSection(),
        s4: defaultSection(),
        s5: defaultSection(),
        s6: defaultSection(),
      },
      achievements: [],
      completedSubsections: {},
      narrativeQuizStars: {},

      setPlayerName: (name) => set({ playerName: name }),

      completeProblem: (sectionId, stars) =>
        set((state) => {
          const section = { ...state.sections[sectionId] }
          section.completed += 1
          section.stars += stars
          section.maxStars += 3
          section.lastPlayed = new Date().toISOString()
          const newStreak = state.currentStreak + 1
          if (newStreak > section.bestStreak) {
            section.bestStreak = newStreak
          }
          return {
            sections: { ...state.sections, [sectionId]: section },
            totalStars: state.totalStars + stars,
            currentStreak: newStreak,
          }
        }),

      resetSection: (sectionId) =>
        set((state) => {
          const section = state.sections[sectionId]
          const starsLost = section.stars
          return {
            sections: { ...state.sections, [sectionId]: { ...defaultSection(), total: section.total } },
            totalStars: Math.max(0, state.totalStars - starsLost),
          }
        }),

      addAchievement: (achievement) =>
        set((state) => ({
          achievements: [...state.achievements, { ...achievement, unlockedAt: new Date().toISOString() }],
        })),

      setSectionTotal: (sectionId, total) =>
        set((state) => ({
          sections: { ...state.sections, [sectionId]: { ...state.sections[sectionId], total } },
        })),

      completeSubsection: (subsectionId) =>
        set((state) => ({
          completedSubsections: { ...state.completedSubsections, [subsectionId]: true },
        })),

      setNarrativeQuizStars: (quizId, stars) =>
        set((state) => ({
          narrativeQuizStars: { ...state.narrativeQuizStars, [quizId]: stars },
          totalStars: state.totalStars + stars - (state.narrativeQuizStars[quizId] || 0),
        })),
    }),
    { name: 'vedansh-history-progress' }
  )
)
