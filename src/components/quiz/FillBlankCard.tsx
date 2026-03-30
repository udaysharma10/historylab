import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { FillBlankActivity } from '../../types/activity'
import { validateFillBlank } from '../../engine/quizEngine'
import { useSound } from '../../hooks/useSound'
import { HintButton } from '../common/HintButton'

interface FillBlankCardProps {
  activity: FillBlankActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

export function FillBlankCard({ activity, sectionColor, questionNumber, totalQuestions, onAnswer }: FillBlankCardProps) {
  const [answers, setAnswers] = useState<string[]>(activity.blanks.map(() => ''))
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState<boolean[]>([])
  const [hintsUsed, setHintsUsed] = useState(0)
  const { playCorrect, playWrong } = useSound()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const allFilled = answers.every(a => a.trim().length > 0)

  const handleCheck = () => {
    if (checked || !allFilled) return
    const correctAnswers = activity.blanks.map(b => ({ answer: b.answer, alternatives: b.alternatives }))
    const validation = validateFillBlank(answers, correctAnswers)
    setResults(validation.results)
    setChecked(true)
    if (validation.correct) playCorrect()
    else playWrong()
    setTimeout(() => onAnswer(validation.correct, hintsUsed), 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      if (index < activity.blanks.length - 1) {
        inputRefs.current[index + 1]?.focus()
      } else if (allFilled) {
        handleCheck()
      }
    }
  }

  // Split sentence by ___ to render inline inputs
  const parts = activity.sentence.split('_____').length > 1
    ? activity.sentence.split('_____')
    : activity.sentence.split('___')

  let blankIndex = 0

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
            Fill in the Blank
          </span>
        </div>

        {/* Sentence with inline inputs */}
        <div className="font-body text-lg sm:text-xl text-hist-dark leading-[2.2] mb-5">
          {parts.map((part, i) => {
            const currentBlank = blankIndex
            const showInput = i < parts.length - 1
            if (showInput) blankIndex++

            return (
              <span key={i}>
                {part}
                {showInput && (
                  <span className="inline-block mx-1 relative">
                    <input
                      ref={el => { inputRefs.current[currentBlank] = el }}
                      type="text"
                      value={answers[currentBlank]}
                      onChange={e => {
                        const newAnswers = [...answers]
                        newAnswers[currentBlank] = e.target.value
                        setAnswers(newAnswers)
                      }}
                      onKeyDown={e => handleKeyDown(e, currentBlank)}
                      disabled={checked}
                      className={`w-36 sm:w-44 px-2 py-0.5 text-center font-bold border-b-2 bg-transparent outline-none transition-all ${
                        checked
                          ? results[currentBlank]
                            ? 'border-green-500 text-green-700'
                            : 'border-red-500 text-red-600'
                          : 'border-gray-300 focus:border-current'
                      }`}
                      style={!checked ? { borderColor: sectionColor } : undefined}
                      placeholder="..."
                      autoComplete="off"
                      spellCheck={false}
                    />
                    {/* Show correct answer below if wrong */}
                    {checked && !results[currentBlank] && (
                      <motion.span
                        className="absolute -bottom-5 left-0 right-0 text-xs text-green-600 font-bold text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        {activity.blanks[currentBlank].answer}
                      </motion.span>
                    )}
                  </span>
                )}
              </span>
            )
          })}
        </div>

        {/* Check button + Hints */}
        {!checked && (
          <div className="flex flex-col items-center gap-3 mt-6">
            <motion.button
              className="text-white font-display text-base px-8 py-2.5 rounded-full shadow-button btn-press disabled:opacity-40"
              style={{ backgroundColor: sectionColor }}
              whileHover={allFilled ? { scale: 1.05 } : {}}
              whileTap={allFilled ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={!allFilled}
            >
              Check Answer
            </motion.button>
            {activity.hints.length > 0 && (
              <HintButton hints={activity.hints} onHintUsed={() => setHintsUsed(h => h + 1)} />
            )}
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {checked && (
            <motion.div
              className={`mt-6 rounded-xl p-4 ${
                results.every(Boolean)
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
                  {results.every(Boolean) ? '🎉' : '💡'}
                </motion.span>
                <div>
                  <p className={`font-display font-bold text-sm mb-1 ${results.every(Boolean) ? 'text-green-700' : 'text-amber-700'}`}>
                    {results.every(Boolean) ? 'Perfect!' : `${results.filter(Boolean).length} of ${results.length} correct`}
                  </p>
                  <p className="font-body text-sm text-hist-dark/75">
                    {activity.blanks.map(b => b.answer).join(', ')}
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
