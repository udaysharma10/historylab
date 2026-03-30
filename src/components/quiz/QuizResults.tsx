import { motion } from 'framer-motion'
import { CelebrationOverlay } from '../common/CelebrationOverlay'
import { StarRating } from '../common/StarRating'
import { useState } from 'react'

interface QuizResultsProps {
  sectionColor: string
  activityType: string
  correct: number
  total: number
  stars: 1 | 2 | 3
  xpEarned: number
  onRetry: () => void
  onBackToSection: () => void
}

const TYPE_LABELS: Record<string, string> = {
  mcq: 'Multiple Choice',
  'fill-blank': 'Fill in the Blank',
  'true-false': 'True or False',
  'match-following': 'Match the Following',
  'timeline-order': 'Timeline Order',
  'map-identify': 'Map Identify',
  'map-label': 'Map Label',
  'image-analysis': 'Image Analysis',
  'source-comprehension': 'Source Comprehension',
}

export function QuizResults({ sectionColor, activityType, correct, total, stars, xpEarned, onRetry, onBackToSection }: QuizResultsProps) {
  const [showCelebration, setShowCelebration] = useState(true)
  const percentage = Math.round((correct / total) * 100)

  return (
    <>
      <CelebrationOverlay
        show={showCelebration}
        stars={stars}
        onClose={() => setShowCelebration(false)}
      />

      <motion.div
        className="max-w-md mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          <div className="h-2" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />

          <div className="p-6 sm:p-8 text-center">
            {/* Trophy */}
            <motion.div
              className="text-6xl mb-3"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              {stars === 3 ? '🏆' : stars === 2 ? '🌟' : '📚'}
            </motion.div>

            <h2 className="font-display text-2xl font-bold text-hist-dark mb-1">
              {stars === 3 ? 'Perfect Score!' : stars === 2 ? 'Great Job!' : 'Good Effort!'}
            </h2>

            <p className="font-body text-gray-500 text-sm mb-4">
              {TYPE_LABELS[activityType] || activityType}
            </p>

            {/* Stars */}
            <div className="flex justify-center mb-5">
              <StarRating stars={stars} size="lg" />
            </div>

            {/* Score */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-display font-bold text-hist-dark">{correct}/{total}</div>
                <div className="text-xs text-gray-400 font-body">Correct</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-display font-bold" style={{ color: sectionColor }}>{percentage}%</div>
                <div className="text-xs text-gray-400 font-body">Score</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-display font-bold text-hist-gold">+{xpEarned}</div>
                <div className="text-xs text-gray-400 font-body">XP</div>
              </div>
            </div>

            {/* Exam readiness */}
            <div className={`rounded-xl p-3 mb-6 ${
              percentage >= 80 ? 'bg-green-50 border border-green-200' :
              percentage >= 50 ? 'bg-amber-50 border border-amber-200' :
              'bg-red-50 border border-red-200'
            }`}>
              <p className={`font-display font-bold text-sm ${
                percentage >= 80 ? 'text-green-700' :
                percentage >= 50 ? 'text-amber-700' :
                'text-red-700'
              }`}>
                {percentage >= 80 ? 'Exam Ready! You know this topic well.' :
                 percentage >= 50 ? 'Getting there! Review the topics you missed.' :
                 'Keep practising! Re-read the section and try again.'}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <motion.button
                className="text-white font-display text-base px-8 py-3 rounded-full shadow-button btn-press"
                style={{ backgroundColor: sectionColor }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onRetry}
              >
                Try Again
              </motion.button>
              <motion.button
                className="bg-gray-100 text-hist-dark font-display text-base px-8 py-3 rounded-full btn-press"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onBackToSection}
              >
                Back to Section
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  )
}
