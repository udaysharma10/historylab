import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MCQActivity } from '../../types/activity'
import { validateMCQ } from '../../engine/quizEngine'
import { useSound } from '../../hooks/useSound'
import { HintButton } from '../common/HintButton'

interface MCQCardProps {
  activity: MCQActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

export function MCQCard({ activity, sectionColor, questionNumber, totalQuestions, onAnswer }: MCQCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const { playCorrect, playWrong } = useSound()

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    const isCorrect = validateMCQ(index, activity.correctIndex)
    if (isCorrect) playCorrect()
    else playWrong()
    setTimeout(() => onAnswer(isCorrect, hintsUsed), 1200)
  }

  const isCorrectAnswer = selected === activity.correctIndex

  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: '2px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      {/* Top accent */}
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
          {activity.examRelevance === 'high' && (
            <span className="text-xs font-display font-bold px-2.5 py-1 rounded-full bg-hist-gold/15 text-hist-gold">
              Exam Important
            </span>
          )}
        </div>

        {/* Question */}
        <p className="font-display font-bold text-hist-dark text-lg sm:text-xl mb-5 leading-snug">
          {activity.question}
        </p>

        {/* Options */}
        <div className="space-y-2.5">
          {activity.options.map((option, i) => {
            const isCorrect = i === activity.correctIndex
            const isSelected = i === selected

            let bg = 'bg-white'
            let border = 'border-gray-200'
            let ring = ''

            if (answered) {
              if (isCorrect) {
                bg = 'bg-green-50'
                border = 'border-green-400'
                ring = 'ring-2 ring-green-100'
              } else if (isSelected) {
                bg = 'bg-red-50'
                border = 'border-red-400'
                ring = 'ring-2 ring-red-100'
              } else {
                bg = 'bg-gray-50'
                border = 'border-gray-200'
                ring = 'opacity-50'
              }
            }

            return (
              <motion.button
                key={i}
                className={`w-full text-left px-4 py-3.5 rounded-xl border-2 font-body text-base transition-all ${bg} ${border} ${ring}`}
                whileHover={!answered ? { scale: 1.01, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } : {}}
                whileTap={!answered ? { scale: 0.99 } : {}}
                onClick={() => handleSelect(i)}
                disabled={answered}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                    answered && isCorrect
                      ? 'bg-green-500 text-white scale-110'
                      : answered && isSelected && !isCorrect
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-100 text-gray-500'
                  }`}>
                    {answered && isCorrect ? '✓' : answered && isSelected && !isCorrect ? '✗' : String.fromCharCode(65 + i)}
                  </span>
                  <span className={`leading-snug ${answered && !isCorrect && !isSelected ? 'text-gray-400' : 'text-hist-dark'}`}>
                    {option}
                  </span>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Hints (before answering) */}
        {!answered && activity.hints.length > 0 && (
          <div className="mt-4 flex justify-center">
            <HintButton hints={activity.hints} onHintUsed={() => setHintsUsed(h => h + 1)} />
          </div>
        )}

        {/* Explanation */}
        <AnimatePresence>
          {answered && (
            <motion.div
              className={`mt-4 rounded-xl p-4 ${
                isCorrectAnswer
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
                  {isCorrectAnswer ? '🎉' : '💡'}
                </motion.span>
                <div>
                  <p className={`font-display font-bold text-sm mb-1 ${isCorrectAnswer ? 'text-green-700' : 'text-amber-700'}`}>
                    {isCorrectAnswer ? 'Correct!' : 'Not quite — here\'s why:'}
                  </p>
                  <p className="font-body text-base text-hist-dark/75 leading-relaxed">
                    {activity.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
