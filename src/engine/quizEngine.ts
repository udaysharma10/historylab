// Pure quiz validation and scoring logic — no React dependency

export function validateMCQ(selectedIndex: number, correctIndex: number): boolean {
  return selectedIndex === correctIndex
}

export function validateFillBlank(
  userAnswers: string[],
  correctAnswers: { answer: string; alternatives: string[] }[]
): { correct: boolean; results: boolean[] } {
  const results = userAnswers.map((userAnswer, i) => {
    const correct = correctAnswers[i]
    if (!correct) return false
    const normalized = userAnswer.trim().toLowerCase()
    const allAccepted = [correct.answer, ...correct.alternatives].map(a => a.trim().toLowerCase())
    return allAccepted.includes(normalized)
  })
  return { correct: results.every(Boolean), results }
}

export function validateTrueFalse(userAnswer: boolean, correct: boolean): boolean {
  return userAnswer === correct
}

export function calculateStars(mistakes: number, hintsUsed: number): 1 | 2 | 3 {
  if (mistakes === 0 && hintsUsed === 0) return 3
  if (mistakes <= 2 && hintsUsed <= 1) return 2
  return 1
}

export function calculateQuizScore(correct: number, total: number): number {
  return Math.round((correct / total) * 100)
}

export function getProgressiveHint(hints: string[], hintLevel: number): string | null {
  if (hintLevel < 0 || hintLevel >= hints.length) return null
  return hints[hintLevel]
}
