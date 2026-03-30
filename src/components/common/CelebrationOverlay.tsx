import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import confetti from 'canvas-confetti'
import { StarRating } from './StarRating'
import { useSound } from '../../hooks/useSound'

interface CelebrationOverlayProps {
  show: boolean
  stars: number
  message?: string
  onClose: () => void
  onExplore?: () => void
  exploreLabel?: string
}

const HISTORY_MESSAGES = {
  3: ['Brilliant historian!', 'Perfect score!', 'Exam-ready!'],
  2: ['Great knowledge!', 'Well done!', 'Almost perfect!'],
  1: ['Good effort!', 'Keep studying!', 'You\'re learning!'],
}

export function CelebrationOverlay({ show, stars, message, onClose, onExplore, exploreLabel }: CelebrationOverlayProps) {
  const { playLevelUp } = useSound()
  const hasPlayed = useRef(false)

  useEffect(() => {
    if (show && !hasPlayed.current) {
      hasPlayed.current = true
      playLevelUp()

      const duration = 2000
      const end = Date.now() + duration
      const colors = ['#D4A017', '#C0392B', '#2980B9', '#27AE60', '#7D3C98']

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
    if (!show) hasPlayed.current = false
  }, [show, playLevelUp])

  const defaultMessages = HISTORY_MESSAGES[stars as 1 | 2 | 3] || HISTORY_MESSAGES[1]
  const displayMessage = message || defaultMessages[Math.floor(Math.random() * defaultMessages.length)]

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />

          <motion.div
            className="relative z-10 bg-white rounded-3xl p-8 mx-4 text-center shadow-2xl max-w-sm"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="text-6xl mb-4"
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {stars === 3 ? '🏆' : stars === 2 ? '🌟' : '📚'}
            </motion.div>

            <h2 className="font-display text-3xl font-bold text-hist-dark mb-2">
              {stars === 3 ? 'Perfect!' : stars === 2 ? 'Great Job!' : 'Good Try!'}
            </h2>

            <p className="text-gray-600 font-body text-lg mb-4">
              {displayMessage}
            </p>

            <div className="flex justify-center mb-6">
              <StarRating stars={stars} size="lg" />
            </div>

            <div className="flex flex-col gap-3">
              {onExplore && (
                <motion.button
                  className="bg-hist-blue text-white font-display text-lg px-8 py-3 rounded-full shadow-button btn-press"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onExplore}
                >
                  {exploreLabel || '🔍 Explore'}
                </motion.button>
              )}
              <motion.button
                className="bg-hist-green text-white font-display text-lg px-8 py-3 rounded-full shadow-button btn-press"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
              >
                Continue →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
