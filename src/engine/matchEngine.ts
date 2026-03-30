// Match-the-following validation logic

export function validateMatches(
  userPairs: [string, string][],
  correctPairs: [string, string][]
): { correct: boolean; results: Map<string, boolean> } {
  const results = new Map<string, boolean>()
  const correctMap = new Map(correctPairs)

  for (const [leftId, rightId] of userPairs) {
    results.set(leftId, correctMap.get(leftId) === rightId)
  }

  const correct = userPairs.length === correctPairs.length &&
    userPairs.every(([leftId, rightId]) => correctMap.get(leftId) === rightId)

  return { correct, results }
}

export function getMatchHint(
  userPairs: [string, string][],
  correctPairs: [string, string][],
  hintLevel: number
): string | null {
  const correctMap = new Map(correctPairs)
  const wrongPairs = userPairs.filter(([leftId, rightId]) => correctMap.get(leftId) !== rightId)

  if (hintLevel === 0 && wrongPairs.length > 0) {
    return `${wrongPairs.length} of your matches are incorrect. Try again!`
  }
  if (hintLevel === 1 && wrongPairs.length > 0) {
    const [wrongLeft] = wrongPairs[0]
    return `The match for "${wrongLeft}" is not correct.`
  }
  return null
}
