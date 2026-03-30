import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { InlineQuiz } from '../../types/chapter'
import { useSound } from '../../hooks/useSound'

interface InlineQuizCardProps {
  quiz: InlineQuiz
  cardText: string
  sectionColor: string
  onAnswered: (correct: boolean) => void
}

export function InlineQuizCard({ quiz, cardText, sectionColor, onAnswered }: InlineQuizCardProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const { playCorrect, playWrong } = useSound()

  const handleSelect = (index: number) => {
    if (answered) return
    setSelected(index)
    setAnswered(true)
    const isCorrect = index === quiz.correctIndex
    if (isCorrect) playCorrect()
    else playWrong()
    onAnswered(isCorrect)
  }

  const isCorrectAnswer = selected === quiz.correctIndex

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

      {/* Context text */}
      <div className="p-6 sm:p-8 pb-4">
        <p className="font-body text-lg sm:text-xl leading-[1.8] text-hist-dark/85">
          {cardText}
        </p>
      </div>

      {/* Quiz section */}
      <div className="mx-4 mb-5 sm:mx-5">
        <div
          className="rounded-2xl p-5 sm:p-6"
          style={{
            background: `linear-gradient(135deg, ${sectionColor}06, ${sectionColor}12)`,
            border: `2px solid ${sectionColor}20`,
          }}
        >
          {/* Quiz badge */}
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: sectionColor }}
            >
              <span className="text-white text-sm">🧠</span>
            </div>
            <span className="font-display font-bold text-sm" style={{ color: sectionColor }}>
              Quick Check
            </span>
          </div>

          {/* Question */}
          <p className="font-body font-semibold text-hist-dark text-lg mb-5 leading-snug">
            {quiz.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {quiz.options.map((option, i) => {
              const isCorrect = i === quiz.correctIndex
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
                      {quiz.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
