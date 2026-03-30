import { useRef, useCallback } from 'react'

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

const SWIPE_THRESHOLD = 50

export function useSwipe(handlers: SwipeHandlers) {
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const dx = e.changedTouches[0].clientX - touchStart.current.x
    const dy = e.changedTouches[0].clientY - touchStart.current.y
    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (absDx > absDy && absDx > SWIPE_THRESHOLD) {
      if (dx > 0) handlers.onSwipeRight?.()
      else handlers.onSwipeLeft?.()
    } else if (absDy > absDx && absDy > SWIPE_THRESHOLD) {
      if (dy > 0) handlers.onSwipeDown?.()
      else handlers.onSwipeUp?.()
    }

    touchStart.current = null
  }, [handlers])

  return { onTouchStart, onTouchEnd }
}
