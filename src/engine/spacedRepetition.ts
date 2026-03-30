// SM-2 spaced repetition algorithm for flashcard review scheduling

export interface ReviewState {
  interval: number
  repetition: number
  easeFactor: number
  nextReview: string
}

export function createInitialReviewState(): ReviewState {
  return {
    interval: 1,
    repetition: 0,
    easeFactor: 2.5,
    nextReview: new Date().toISOString().split('T')[0],
  }
}

/**
 * SM-2 algorithm
 * @param quality 0-5 where 0=complete blackout, 5=perfect response
 */
export function calculateNextReview(quality: number, current: ReviewState): ReviewState {
  const q = Math.max(0, Math.min(5, quality))

  let { interval, repetition, easeFactor } = current

  if (q >= 3) {
    // Correct response
    if (repetition === 0) {
      interval = 1
    } else if (repetition === 1) {
      interval = 6
    } else {
      interval = Math.round(interval * easeFactor)
    }
    repetition += 1
  } else {
    // Incorrect — reset
    repetition = 0
    interval = 1
  }

  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))

  const nextDate = new Date()
  nextDate.setDate(nextDate.getDate() + interval)

  return {
    interval,
    repetition,
    easeFactor,
    nextReview: nextDate.toISOString().split('T')[0],
  }
}

export function isDueForReview(state: ReviewState, today?: string): boolean {
  const todayStr = today || new Date().toISOString().split('T')[0]
  return state.nextReview <= todayStr
}
