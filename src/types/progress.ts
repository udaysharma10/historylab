// Progress and gamification types

export type SectionId = 's1' | 's2' | 's3' | 's4' | 's5' | 's6'

export interface SectionProgress {
  completed: number
  total: number
  stars: number
  maxStars: number
  bestStreak: number
  lastPlayed?: string
}

export type MasteryLevel = 'beginner' | 'learning' | 'confident' | 'master'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt?: string
}

export interface FlashcardReviewState {
  cardId: string
  interval: number
  repetition: number
  easeFactor: number
  nextReview: string
}
