// Scoring, mastery, and XP calculation

import type { MasteryLevel, SectionProgress } from '../types/progress'

export function calculateStars(mistakes: number, hintsUsed: number): 1 | 2 | 3 {
  if (mistakes === 0 && hintsUsed === 0) return 3
  if (mistakes <= 2 && hintsUsed <= 1) return 2
  return 1
}

export function calculateXP(stars: number, difficulty: 'easy' | 'medium' | 'hard'): number {
  const diffMultiplier = { easy: 1, medium: 1.5, hard: 2 }
  return Math.round(stars * 10 * diffMultiplier[difficulty])
}

export function calculateMastery(progress: SectionProgress): MasteryLevel {
  if (progress.total === 0) return 'beginner'
  const pct = (progress.completed / progress.total) * 100
  const avgStars = progress.completed > 0 ? progress.stars / progress.completed : 0

  if (pct >= 80 && avgStars >= 2.5) return 'master'
  if (pct >= 50) return 'confident'
  if (pct >= 25) return 'learning'
  return 'beginner'
}

export function getMasteryColor(level: MasteryLevel): string {
  switch (level) {
    case 'master': return '#C0911F'
    case 'confident': return '#95A5A6'
    case 'learning': return '#CD7F32'
    case 'beginner': return '#BDC3C7'
  }
}
