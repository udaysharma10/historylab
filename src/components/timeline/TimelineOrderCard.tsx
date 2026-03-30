import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TimelinePlaceActivity } from '../../types/activity'
import { validateOrder } from '../../engine/timelineEngine'
import { useSound } from '../../hooks/useSound'

interface TimelineOrderCardProps {
  activity: TimelinePlaceActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function TimelineOrderCard({ activity, sectionColor, questionNumber, totalQuestions, onAnswer }: TimelineOrderCardProps) {
  const correctOrder = useMemo(() =>
    [...activity.events].sort((a, b) => a.year - b.year).map(e => e.id),
    [activity.events]
  )

  const shuffledEvents = useMemo(() => {
    // Ensure we don't show the already-correct order
    let shuffled = shuffle(activity.events)
    const shuffledIds = shuffled.map(e => e.id)
    if (shuffledIds.every((id, i) => id === correctOrder[i]) && shuffled.length > 1) {
      // Swap first two if accidentally in correct order
      [shuffled[0], shuffled[1]] = [shuffled[1], shuffled[0]]
    }
    return shuffled
  }, [activity.events, correctOrder])

  // placed = events the user has placed in order (by tapping from the pool)
  const [placed, setPlaced] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showCorrectOrder, setShowCorrectOrder] = useState(false)
  const { playCorrect, playWrong } = useSound()

  const eventMap = useMemo(() => new Map(activity.events.map(e => [e.id, e])), [activity.events])
  const remaining = useMemo(() => shuffledEvents.filter(e => !placed.includes(e.id)), [shuffledEvents, placed])

  const handleTapEvent = useCallback((id: string) => {
    if (checked) return
    setPlaced(prev => [...prev, id])
  }, [checked])

  const handleRemoveLast = useCallback(() => {
    if (checked || placed.length === 0) return
    setPlaced(prev => prev.slice(0, -1))
  }, [checked, placed.length])

  const handleClear = useCallback(() => {
    if (checked) return
    setPlaced([])
  }, [checked])

  const handleCheck = useCallback(() => {
    if (checked) return
    const correct = validateOrder(placed, correctOrder)
    setIsCorrect(correct)
    setChecked(true)
    if (correct) {
      playCorrect()
    } else {
      playWrong()
      // Show correct order after a delay
      setTimeout(() => setShowCorrectOrder(true), 800)
    }
    setTimeout(() => onAnswer(correct, 0), correct ? 1200 : 2500)
  }, [checked, placed, correctOrder, playCorrect, playWrong, onAnswer])

  const allPlaced = placed.length === activity.events.length

  // Per-event correctness for visual feedback
  const eventResults = useMemo(() => {
    if (!checked) return new Map<string, boolean>()
    const results = new Map<string, boolean>()
    placed.forEach((id, i) => {
      results.set(id, id === correctOrder[i])
    })
    return results
  }, [checked, placed, correctOrder])

  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: '2px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />

      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionColor }}>
              <span className="text-white text-sm font-bold">{questionNumber}</span>
            </div>
            <span className="font-body text-sm text-gray-400">
              Activity {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-display font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}>
            Timeline Order
          </span>
        </div>

        <h3 className="font-display font-bold text-hist-dark text-lg mb-1">Arrange in Chronological Order</h3>
        <p className="font-body text-sm text-gray-400 mb-4">{activity.instruction}</p>

        {/* Placed events (answer zone) */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-display font-bold text-sm text-hist-dark">Your Order</span>
            {placed.length > 0 && !checked && (
              <div className="flex gap-2 ml-auto">
                <motion.button
                  className="text-xs font-body text-gray-400 hover:text-hist-dark underline"
                  onClick={handleRemoveLast}
                  whileTap={{ scale: 0.95 }}
                >
                  Undo
                </motion.button>
                <motion.button
                  className="text-xs font-body text-gray-400 hover:text-red-500 underline"
                  onClick={handleClear}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear
                </motion.button>
              </div>
            )}
          </div>

          <div className="space-y-2 min-h-[60px]">
            {placed.length === 0 && (
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                <p className="font-body text-sm text-gray-300">Tap events below in chronological order (earliest first)</p>
              </div>
            )}

            <AnimatePresence>
              {placed.map((id, i) => {
                const event = eventMap.get(id)!
                const result = eventResults.get(id)

                let bgColor = `${sectionColor}08`
                let borderColor = `${sectionColor}40`
                if (checked) {
                  if (result) {
                    bgColor = '#F0FDF4'
                    borderColor = '#22C55E'
                  } else {
                    bgColor = '#FEF2F2'
                    borderColor = '#EF4444'
                  }
                }

                return (
                  <motion.div
                    key={id}
                    className="flex items-center gap-3 rounded-xl px-4 py-3"
                    style={{ backgroundColor: bgColor, border: `2px solid ${borderColor}` }}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold text-white shrink-0"
                      style={{ backgroundColor: checked ? (result ? '#22C55E' : '#EF4444') : sectionColor }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-display font-bold text-sm text-hist-dark">{event.label}</span>
                      {checked && (
                        <span className="ml-2 font-body text-xs text-gray-400">({event.year})</span>
                      )}
                    </div>
                    {checked && result && <span className="text-green-500 shrink-0">✓</span>}
                    {checked && !result && <span className="text-red-500 shrink-0">✗</span>}
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Remaining events pool */}
        {remaining.length > 0 && !checked && (
          <div className="mb-4">
            <span className="font-display font-bold text-sm text-gray-500 mb-2 block">
              Tap to place ({remaining.length} remaining)
            </span>
            <div className="flex flex-wrap gap-2">
              {remaining.map(event => (
                <motion.button
                  key={event.id}
                  className="font-body text-sm px-4 py-2.5 rounded-xl bg-gray-50 text-hist-dark border-2 border-gray-200 hover:border-gray-300 transition-all"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleTapEvent(event.id)}
                  layout
                >
                  {event.label}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Check button */}
        {!checked && (
          <div className="flex justify-center mt-4">
            <motion.button
              className="text-white font-display text-base px-8 py-2.5 rounded-full shadow-button btn-press disabled:opacity-40"
              style={{ backgroundColor: sectionColor }}
              whileHover={allPlaced ? { scale: 1.05 } : {}}
              whileTap={allPlaced ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={!allPlaced}
            >
              Check Order
            </motion.button>
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {checked && (
            <motion.div
              className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="flex gap-2.5 items-start">
                <motion.span
                  className="text-2xl shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
                >
                  {isCorrect ? '🎉' : '💡'}
                </motion.span>
                <div>
                  <p className={`font-display font-bold text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                    {isCorrect
                      ? 'Perfect chronological order!'
                      : `${eventResults.size > 0 ? [...eventResults.values()].filter(Boolean).length : 0} of ${placed.length} in the correct position`}
                  </p>
                  {!isCorrect && (
                    <p className="font-body text-xs text-amber-600 mt-0.5">
                      Remember these dates — they appear frequently in board exams!
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Correct order reveal */}
        <AnimatePresence>
          {showCorrectOrder && !isCorrect && (
            <motion.div
              className="mt-3 rounded-xl p-4 bg-blue-50 border border-blue-200"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-display font-bold text-sm text-blue-700 mb-2">Correct Order:</p>
              <div className="space-y-1.5">
                {correctOrder.map((id, i) => {
                  const event = eventMap.get(id)!
                  return (
                    <motion.div
                      key={id}
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </span>
                      <span className="font-body text-sm text-blue-800">
                        <strong>{event.year}</strong> — {event.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
