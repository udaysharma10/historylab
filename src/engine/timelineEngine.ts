// Timeline placement validation logic

export interface PlacedEvent {
  eventId: string
  placedYear: number
}

export interface CorrectEvent {
  id: string
  year: number
}

export type PlacementResult = 'correct' | 'close' | 'wrong'

export function validatePlacement(
  placedEvents: PlacedEvent[],
  correctEvents: CorrectEvent[],
  toleranceYears: number = 2
): { correct: boolean; results: Map<string, PlacementResult> } {
  const results = new Map<string, PlacementResult>()
  const correctMap = new Map(correctEvents.map(e => [e.id, e.year]))

  for (const { eventId, placedYear } of placedEvents) {
    const correctYear = correctMap.get(eventId)
    if (correctYear === undefined) {
      results.set(eventId, 'wrong')
      continue
    }
    const diff = Math.abs(placedYear - correctYear)
    if (diff === 0) {
      results.set(eventId, 'correct')
    } else if (diff <= toleranceYears) {
      results.set(eventId, 'close')
    } else {
      results.set(eventId, 'wrong')
    }
  }

  const correct = placedEvents.length === correctEvents.length &&
    [...results.values()].every(r => r === 'correct')

  return { correct, results }
}

export function validateOrder(eventIds: string[], correctOrder: string[]): boolean {
  if (eventIds.length !== correctOrder.length) return false
  return eventIds.every((id, i) => id === correctOrder[i])
}
