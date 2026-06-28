import { motion } from 'framer-motion'
import { StarRating } from '../common/StarRating'
import { useSound } from '../../hooks/useSound'
import { useEffect, useRef } from 'react'
import confetti from 'canvas-confetti'

interface SubsectionCompleteProps {
  subsectionTitle: string
  totalCards: number
  quizzesCorrect: number
  totalQuizzes: number
  sectionColor: string
  isLastSubsection: boolean
  onContinue: () => void
  onBackToSection: () => void
}

export function SubsectionComplete({
  subsectionTitle,
  totalCards,
  quizzesCorrect,
  totalQuizzes,
  sectionColor,
  isLastSubsection,
  onContinue,
  onBackToSection,
}: SubsectionCompleteProps) {
  const { playLevelUp } = useSound()
  const hasPlayed = useRef(false)

  const stars = totalQuizzes === 0
    ? 3
    : quizzesCorrect === totalQuizzes
      ? 3
      : quizzesCorrect >= totalQuizzes * 0.5
        ? 2
        : 1

  useEffect(() => {
    if (hasPlayed.current) return
    hasPlayed.current = true
    playLevelUp()

    if (stars >= 2) {
      const colors = [sectionColor, '#C0911F', '#5C9368', '#5571B5']
      const end = Date.now() + 1500
      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors,
        })
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors,
        })
        if (Date.now() < end) requestAnimationFrame(frame)
      }
      frame()
    }
  }, [playLevelUp, sectionColor, stars])

  return (
    <motion.div
      className="flex items-center justify-center min-h-[50vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 shadow-card max-w-md w-full text-center"
        initial={{ scale: 0.8, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <motion.div
          className="text-6xl mb-3"
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {stars === 3 ? '🏆' : stars === 2 ? '🌟' : '📚'}
        </motion.div>

        <h2 className="font-display text-2xl font-bold text-hist-dark mb-1">
          {stars === 3 ? 'Excellent!' : stars === 2 ? 'Well Done!' : 'Good Start!'}
        </h2>

        <p className="text-gray-500 font-body text-sm mb-2">
          You completed
        </p>
        <p className="font-display font-bold mb-4" style={{ color: sectionColor }}>
          {subsectionTitle}
        </p>

        <div className="flex justify-center mb-4">
          <StarRating stars={stars} size="lg" />
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6 text-sm">
          <div className="text-center">
            <div className="font-display font-bold text-xl text-hist-dark">{totalCards}</div>
            <div className="text-gray-400">Cards Read</div>
          </div>
          {totalQuizzes > 0 && (
            <div className="text-center">
              <div className="font-display font-bold text-xl text-hist-dark">
                {quizzesCorrect}/{totalQuizzes}
              </div>
              <div className="text-gray-400">Quiz Score</div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {!isLastSubsection && (
            <motion.button
              className="text-white font-display text-lg px-8 py-3 rounded-full shadow-button btn-press"
              style={{ backgroundColor: sectionColor }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
            >
              Next Topic →
            </motion.button>
          )}
          <motion.button
            className="bg-gray-100 text-hist-dark font-display px-8 py-3 rounded-full text-base"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onBackToSection}
          >
            {isLastSubsection ? '← Back to Section' : 'Back to Overview'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}
