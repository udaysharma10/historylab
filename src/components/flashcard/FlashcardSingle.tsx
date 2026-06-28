import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'framer-motion'

const SECTION_COLORS: Record<string, string> = {
  s1: '#C36B53', s2: '#5571B5', s3: '#C2893E',
  s4: '#5C9368', s5: '#9B5C9A', s6: '#3F8E84',
}

interface FlashcardSingleProps {
  front: string
  back: string
  sectionId: string
  tags: string[]
  flipped?: boolean
  onFlip?: () => void
  onRate?: (quality: number) => void
  showRating?: boolean
}

export function FlashcardSingle({
  front,
  back,
  sectionId,
  tags,
  flipped = false,
  onFlip,
  onRate,
  showRating = false,
}: FlashcardSingleProps) {
  const [isFlipped, setIsFlipped] = useState(flipped)
  const color = SECTION_COLORS[sectionId] || '#5571B5'

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    onFlip?.()
  }

  // Reset flip state when card changes (front text changes)
  const [prevFront, setPrevFront] = useState(front)
  if (front !== prevFront) {
    setPrevFront(front)
    setIsFlipped(false)
  }

  // Both faces are absolutely positioned (for the 3D flip), so they don't grow the
  // container on their own. Measure each face's natural content height and size the
  // card to the taller one, so a long answer + rating buttons never get clipped.
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)
  const [cardHeight, setCardHeight] = useState(280)

  useLayoutEffect(() => {
    const measure = () => {
      const fh = frontRef.current?.offsetHeight ?? 0
      const bh = backRef.current?.offsetHeight ?? 0
      const ACCENT = 6 // the top accent bar (h-1.5)
      setCardHeight(Math.max(fh, bh) + ACCENT)
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (frontRef.current) ro.observe(frontRef.current)
    if (backRef.current) ro.observe(backRef.current)
    return () => ro.disconnect()
  }, [front, back, showRating, tags])

  return (
    <div className="w-full perspective-1000">
      <motion.div
        className="relative w-full cursor-pointer"
        style={{ height: cardHeight, transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        onClick={handleFlip}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-2xl shadow-card overflow-hidden bg-white"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
          <div ref={frontRef} className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
                S{sectionId.replace('s', '')}
              </span>
              {tags.slice(0, 2).map(tag => (
                <span key={tag} className="text-[10px] font-body text-gray-400 px-1.5 py-0.5 rounded bg-gray-100">
                  {tag}
                </span>
              ))}
            </div>
            <p className="font-body text-lg sm:text-xl font-semibold text-hist-dark leading-snug">
              {front}
            </p>
            <p className="text-center text-gray-300 font-body text-sm mt-6">
              Tap to reveal answer
            </p>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-2xl shadow-card overflow-hidden bg-white"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="h-1.5" style={{ background: `linear-gradient(90deg, #5C9368, #5C936860)` }} />
          <div ref={backRef} className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                Answer
              </span>
            </div>
            <p className="font-body text-base sm:text-lg text-hist-dark leading-relaxed">
              {back}
            </p>

            {showRating && onRate && (
              <div className="mt-6">
                <p className="text-center text-xs text-gray-400 font-body mb-2">How well did you know this?</p>
                <div className="grid grid-cols-3 gap-2">
                  <motion.button
                    className="py-2.5 rounded-xl font-display font-bold text-sm text-white bg-red-400 btn-press"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => { e.stopPropagation(); onRate(1) }}
                  >
                    Didn't Know
                  </motion.button>
                  <motion.button
                    className="py-2.5 rounded-xl font-display font-bold text-sm text-white bg-amber-400 btn-press"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => { e.stopPropagation(); onRate(3) }}
                  >
                    Okay
                  </motion.button>
                  <motion.button
                    className="py-2.5 rounded-xl font-display font-bold text-sm text-white bg-green-500 btn-press"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => { e.stopPropagation(); onRate(5) }}
                  >
                    Easy!
                  </motion.button>
                </div>
              </div>
            )}

            {!showRating && (
              <p className="text-center text-gray-300 font-body text-sm mt-6">
                Tap to see question
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
