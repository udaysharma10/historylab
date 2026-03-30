import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MatchActivity } from '../../types/activity'
import { validateMatches } from '../../engine/matchEngine'
import { useSound } from '../../hooks/useSound'

interface MatchColumnsProps {
  activity: MatchActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

const PAIR_COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']

export function MatchColumns({ activity, sectionColor, questionNumber, totalQuestions, onAnswer }: MatchColumnsProps) {
  // Shuffle right column on mount
  const shuffledRight = useMemo(() => {
    const arr = [...activity.rightColumn]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [activity.rightColumn])

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)
  const [pairs, setPairs] = useState<Map<string, string>>(new Map())
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<Map<string, boolean>>(new Map())
  const { playCorrect, playWrong } = useSound()

  const handleLeftClick = (id: string) => {
    if (checked) return
    // If already paired, unpair it
    if (pairs.has(id)) {
      const newPairs = new Map(pairs)
      newPairs.delete(id)
      setPairs(newPairs)
      setSelectedLeft(null)
      return
    }
    setSelectedLeft(id)
  }

  const handleRightClick = (id: string) => {
    if (checked || !selectedLeft) return
    // Check if this right item is already used
    const usedBy = [...pairs.entries()].find(([, r]) => r === id)
    if (usedBy) {
      // Unpair the previous connection
      const newPairs = new Map(pairs)
      newPairs.delete(usedBy[0])
      newPairs.set(selectedLeft, id)
      setPairs(newPairs)
    } else {
      const newPairs = new Map(pairs)
      newPairs.set(selectedLeft, id)
      setPairs(newPairs)
    }
    setSelectedLeft(null)
  }

  const handleCheck = () => {
    if (checked) return
    const userPairs: [string, string][] = [...pairs.entries()]
    const validation = validateMatches(userPairs, activity.correctPairs)
    setResults(validation.results)
    setChecked(true)
    if (validation.correct) playCorrect()
    else playWrong()
    setTimeout(() => onAnswer(validation.correct, 0), 1500)
  }

  const allPaired = pairs.size === activity.leftColumn.length

  // Get color for a paired left item
  const getPairColor = (leftId: string): string | null => {
    const pairedRight = pairs.get(leftId)
    if (!pairedRight) return null
    const pairIndex = [...pairs.keys()].indexOf(leftId)
    return PAIR_COLORS[pairIndex % PAIR_COLORS.length]
  }

  // Get color for a right item if it's paired
  const getRightPairColor = (rightId: string): string | null => {
    const entry = [...pairs.entries()].find(([, r]) => r === rightId)
    if (!entry) return null
    return getPairColor(entry[0])
  }

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: sectionColor }}
            >
              <span className="text-white text-sm font-bold">{questionNumber}</span>
            </div>
            <span className="font-body text-sm text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-display font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}>
            Match the Following
          </span>
        </div>

        <h3 className="font-display font-bold text-hist-dark text-lg mb-1">{activity.title}</h3>
        <p className="font-body text-sm text-gray-400 mb-4">
          {selectedLeft ? 'Now tap an item on the right to pair' : 'Tap an item on the left, then tap its match on the right'}
        </p>

        {/* Two columns */}
        <div className="grid grid-cols-2 gap-3">
          {/* Left column */}
          <div className="space-y-2">
            {activity.leftColumn.map((item) => {
              const pairColor = getPairColor(item.id)
              const isSelected = selectedLeft === item.id
              const isPaired = pairs.has(item.id)
              const resultCorrect = results.get(item.id)

              let borderStyle = '2px solid #E5E7EB'
              let bgColor = 'white'

              if (checked) {
                if (resultCorrect === true) {
                  borderStyle = '2px solid #22C55E'
                  bgColor = '#F0FDF4'
                } else if (resultCorrect === false) {
                  borderStyle = '2px solid #EF4444'
                  bgColor = '#FEF2F2'
                }
              } else if (isSelected) {
                borderStyle = `3px solid ${sectionColor}`
                bgColor = `${sectionColor}08`
              } else if (pairColor) {
                borderStyle = `2px solid ${pairColor}`
                bgColor = `${pairColor}10`
              }

              return (
                <motion.button
                  key={item.id}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-body text-sm leading-snug transition-all"
                  style={{ border: borderStyle, backgroundColor: bgColor }}
                  whileHover={!checked ? { scale: 1.02 } : {}}
                  whileTap={!checked ? { scale: 0.98 } : {}}
                  animate={checked && resultCorrect === false ? { x: [0, -3, 3, -3, 3, 0] } : {}}
                  onClick={() => handleLeftClick(item.id)}
                  disabled={checked}
                >
                  <div className="flex items-center gap-2">
                    {isPaired && pairColor && !checked && (
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pairColor }} />
                    )}
                    {checked && resultCorrect === true && <span className="text-green-500 shrink-0">✓</span>}
                    {checked && resultCorrect === false && <span className="text-red-500 shrink-0">✗</span>}
                    <span className="text-hist-dark">{item.text}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>

          {/* Right column */}
          <div className="space-y-2">
            {shuffledRight.map((item) => {
              const pairColor = getRightPairColor(item.id)
              const isPaired = [...pairs.values()].includes(item.id)

              let borderStyle = '2px solid #E5E7EB'
              let bgColor = 'white'

              if (checked) {
                // Find which left was paired with this right
                const pairedLeft = [...pairs.entries()].find(([, r]) => r === item.id)
                if (pairedLeft) {
                  const correct = results.get(pairedLeft[0])
                  if (correct) {
                    borderStyle = '2px solid #22C55E'
                    bgColor = '#F0FDF4'
                  } else {
                    borderStyle = '2px solid #EF4444'
                    bgColor = '#FEF2F2'
                  }
                }
              } else if (pairColor) {
                borderStyle = `2px solid ${pairColor}`
                bgColor = `${pairColor}10`
              } else if (selectedLeft && !isPaired) {
                borderStyle = `2px dashed ${sectionColor}60`
              }

              return (
                <motion.button
                  key={item.id}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-body text-sm leading-snug transition-all"
                  style={{ border: borderStyle, backgroundColor: bgColor }}
                  whileHover={!checked && selectedLeft ? { scale: 1.02 } : {}}
                  whileTap={!checked && selectedLeft ? { scale: 0.98 } : {}}
                  onClick={() => handleRightClick(item.id)}
                  disabled={checked || !selectedLeft}
                >
                  <div className="flex items-center gap-2">
                    {isPaired && pairColor && !checked && (
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: pairColor }} />
                    )}
                    <span className="text-hist-dark">{item.text}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Check button */}
        {!checked && (
          <div className="flex justify-center mt-5">
            <motion.button
              className="text-white font-display text-base px-8 py-2.5 rounded-full shadow-button btn-press disabled:opacity-40"
              style={{ backgroundColor: sectionColor }}
              whileHover={allPaired ? { scale: 1.05 } : {}}
              whileTap={allPaired ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={!allPaired}
            >
              Check Matches
            </motion.button>
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {checked && (
            <motion.div
              className={`mt-4 rounded-xl p-4 ${
                [...results.values()].every(Boolean)
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-amber-50 border border-amber-200'
              }`}
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
                  {[...results.values()].every(Boolean) ? '🎉' : '💡'}
                </motion.span>
                <p className={`font-display font-bold text-sm ${[...results.values()].every(Boolean) ? 'text-green-700' : 'text-amber-700'}`}>
                  {[...results.values()].every(Boolean)
                    ? 'All matches correct!'
                    : `${[...results.values()].filter(Boolean).length} of ${results.size} correct`}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
