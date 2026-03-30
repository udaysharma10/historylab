import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TrueFalseActivity } from '../../types/activity'
import { validateTrueFalse } from '../../engine/quizEngine'
import { useSound } from '../../hooks/useSound'

interface TrueFalseCardProps {
  activity: TrueFalseActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

export function TrueFalseCard({ activity, sectionColor, questionNumber, totalQuestions, onAnswer }: TrueFalseCardProps) {
  const [userAnswer, setUserAnswer] = useState<boolean | null>(null)
  const [answered, setAnswered] = useState(false)
  const { playCorrect, playWrong } = useSound()

  const handleAnswer = (answer: boolean) => {
    if (answered) return
    setUserAnswer(answer)
    setAnswered(true)
    const isCorrect = validateTrueFalse(answer, activity.isTrue)
    if (isCorrect) playCorrect()
    else playWrong()
    setTimeout(() => onAnswer(isCorrect, 0), 1200)
  }

  const isCorrectAnswer = userAnswer === activity.isTrue

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
            True or False
          </span>
        </div>

        {/* Statement */}
        <p className="font-display font-bold text-hist-dark text-lg sm:text-xl mb-6 leading-snug">
          "{activity.statement}"
        </p>

        {/* True / False Buttons */}
        <div className="flex gap-3">
          {[true, false].map((value) => {
            const isThis = userAnswer === value
            const isCorrectOption = activity.isTrue === value

            let bg = value ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-red-50 border-red-200 hover:bg-red-100'
            let textColor = value ? 'text-green-700' : 'text-red-700'

            if (answered) {
              if (isCorrectOption) {
                bg = 'bg-green-100 border-green-400 ring-2 ring-green-200'
                textColor = 'text-green-700'
              } else if (isThis && !isCorrectOption) {
                bg = 'bg-red-100 border-red-400 ring-2 ring-red-200'
                textColor = 'text-red-700'
              } else {
                bg = 'bg-gray-50 border-gray-200 opacity-50'
                textColor = 'text-gray-400'
              }
            }

            return (
              <motion.button
                key={String(value)}
                className={`flex-1 py-4 rounded-xl border-2 font-display font-bold text-lg transition-all ${bg} ${textColor}`}
                whileHover={!answered ? { scale: 1.03 } : {}}
                whileTap={!answered ? { scale: 0.97 } : {}}
                animate={answered && isThis && !isCorrectOption ? { x: [0, -5, 5, -5, 5, 0] } : {}}
                transition={answered && isThis && !isCorrectOption ? { duration: 0.4 } : {}}
                onClick={() => handleAnswer(value)}
                disabled={answered}
              >
                <span className="text-2xl block mb-1">{value ? '✓' : '✗'}</span>
                {value ? 'TRUE' : 'FALSE'}
              </motion.button>
            )
          })}
        </div>

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
                    {isCorrectAnswer ? 'Correct!' : `The answer is ${activity.isTrue ? 'TRUE' : 'FALSE'}`}
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
