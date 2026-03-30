import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FlashcardReviewState } from '../types/progress'

interface FlashcardStoreState {
  reviewStates: Record<string, FlashcardReviewState>
  updateReviewState: (cardId: string, state: FlashcardReviewState) => void
  getReviewState: (cardId: string) => FlashcardReviewState | undefined
  resetAll: () => void
}

export const useFlashcardStore = create<FlashcardStoreState>()(
  persist(
    (set, get) => ({
      reviewStates: {},

      updateReviewState: (cardId, state) =>
        set((s) => ({
          reviewStates: { ...s.reviewStates, [cardId]: state },
        })),

      getReviewState: (cardId) => get().reviewStates[cardId],

      resetAll: () => set({ reviewStates: {} }),
    }),
    { name: 'vedansh-history-flashcards' }
  )
)
