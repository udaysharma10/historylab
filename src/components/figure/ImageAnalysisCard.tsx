import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ImageAnalysisActivity } from '../../types/activity'
import type { Figure } from '../../types/figure'

interface ImageAnalysisCardProps {
  activity: ImageAnalysisActivity
  figure: Figure
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onComplete: (correct: number, total: number) => void
}

export function ImageAnalysisCard({
  activity,
  figure,
  sectionColor,
  questionNumber,
  totalQuestions,
  onComplete,
}: ImageAnalysisCardProps) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [revealedAnswer, setRevealedAnswer] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)

  const question = activity.questions[currentQ]
  const isMCQ = !!question.options && question.options.length > 0

  const handleSelectOption = (index: number) => {
    if (answered) return
    setSelectedOption(index)
    setAnswered(true)

    // For MCQ, the correct option contains the answer text
    const correctIdx = question.options!.findIndex(
      opt => question.answer.toLowerCase().includes(opt.toLowerCase())
    )
    const wasCorrect = index === correctIdx

    if (wasCorrect) {
      setCorrectCount(c => c + 1)
    }

    // Auto-advance after delay
    setTimeout(() => advanceQuestion(wasCorrect ? 1 : 0), 1500)
  }

  const handleRevealAnswer = () => {
    setRevealedAnswer(true)
    // Free-text counts as "reviewed" (correct for scoring)
    setTimeout(() => advanceQuestion(1), 2500)
  }

  const advanceQuestion = (_addedCorrect: number) => {
    if (currentQ < activity.questions.length - 1) {
      setCurrentQ(q => q + 1)
      setSelectedOption(null)
      setAnswered(false)
      setRevealedAnswer(false)
    } else {
      // All questions in this activity done
      onComplete(correctCount + _addedCorrect, activity.questions.length)
    }
  }

  // Find correct option index for MCQ
  const correctOptionIdx = isMCQ
    ? question.options!.findIndex(opt => question.answer.toLowerCase().includes(opt.toLowerCase()))
    : -1

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Top accent */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />

      <div className="p-5 sm:p-6">
        {/* Activity header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🖼️</span>
            <span className="font-display font-bold text-sm" style={{ color: sectionColor }}>
              Figure {figure.number} Analysis
            </span>
          </div>
          <span className="font-body text-xs text-gray-400">
            Q{questionNumber}.{currentQ + 1} of {totalQuestions}.{activity.questions.length}
          </span>
        </div>

        {/* Figure image (compact) */}
        <div className="rounded-xl overflow-hidden mb-5 max-h-48 bg-gray-100">
          <img
            src={figure.imagePath}
            alt={figure.title}
            className="w-full h-48 object-contain"
            loading="lazy"
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activity.id}-q${currentQ}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <p className="font-body text-base sm:text-lg font-semibold text-hist-dark mb-5 leading-snug">
              {question.question}
            </p>

            {/* MCQ options */}
            {isMCQ && (
              <div className="space-y-2.5">
                {question.options!.map((option, i) => {
                  let optionStyle = {}
                  let textColor = 'text-hist-dark/80'

                  if (answered) {
                    if (i === correctOptionIdx) {
                      optionStyle = { backgroundColor: '#ECFDF5', border: '2px solid #22C55E' }
                      textColor = 'text-green-800'
                    } else if (i === selectedOption && i !== correctOptionIdx) {
                      optionStyle = { backgroundColor: '#FEF2F2', border: '2px solid #EF4444' }
                      textColor = 'text-red-800'
                    } else {
                      optionStyle = { backgroundColor: '#F9FAFB', border: '2px solid #E5E7EB', opacity: 0.5 }
                    }
                  } else {
                    optionStyle = {
                      backgroundColor: selectedOption === i ? `${sectionColor}10` : 'white',
                      border: `2px solid ${selectedOption === i ? sectionColor : '#E5E7EB'}`,
                    }
                  }

                  return (
                    <motion.button
                      key={i}
                      className={`w-full text-left rounded-xl px-4 py-3 font-body text-sm ${textColor} transition-colors`}
                      style={optionStyle}
                      onClick={() => handleSelectOption(i)}
                      disabled={answered}
                      whileHover={!answered ? { scale: 1.01 } : {}}
                      whileTap={!answered ? { scale: 0.99 } : {}}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                          style={{
                            backgroundColor: answered && i === correctOptionIdx ? '#22C55E' :
                              answered && i === selectedOption ? '#EF4444' :
                              `${sectionColor}15`,
                            color: answered && (i === correctOptionIdx || i === selectedOption) ? 'white' : sectionColor,
                          }}
                        >
                          {answered && i === correctOptionIdx ? '✓' :
                           answered && i === selectedOption && i !== correctOptionIdx ? '✗' :
                           String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* Free-text: Reveal Answer */}
            {!isMCQ && (
              <div>
                {!revealedAnswer ? (
                  <motion.button
                    className="w-full text-center font-display font-bold text-base px-6 py-3 rounded-full text-white shadow-button btn-press"
                    style={{ backgroundColor: sectionColor }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRevealAnswer}
                  >
                    Think about it, then Reveal Answer
                  </motion.button>
                ) : (
                  <motion.div
                    className="rounded-xl p-5"
                    style={{ backgroundColor: '#ECFDF5', border: '2px solid #A7F3D0' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <p className="font-display font-bold text-sm text-green-700 mb-2">Model Answer</p>
                    <p className="font-body text-sm text-green-800 leading-relaxed">{question.answer}</p>
                  </motion.div>
                )}
              </div>
            )}

            {/* Sub-question progress dots */}
            {activity.questions.length > 1 && (
              <div className="flex justify-center gap-2 mt-5">
                {activity.questions.map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full transition-colors"
                    style={{
                      backgroundColor: i < currentQ ? '#22C55E' :
                        i === currentQ ? sectionColor : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
