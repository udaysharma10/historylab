import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HintButtonProps {
  hints: string[]
  onHintUsed?: () => void
}

export function HintButton({ hints, onHintUsed }: HintButtonProps) {
  const [currentHint, setCurrentHint] = useState(-1)

  const showNextHint = () => {
    if (currentHint < hints.length - 1) {
      setCurrentHint((h) => h + 1)
      onHintUsed?.()
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <motion.button
        className="bg-hist-orange text-white font-display px-5 py-2 rounded-full shadow-button btn-press text-sm flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={showNextHint}
        disabled={currentHint >= hints.length - 1}
      >
        <span className="text-lg">💡</span>
        {currentHint < 0 ? 'Need a hint?' : `Hint ${currentHint + 1}/${hints.length}`}
      </motion.button>

      <AnimatePresence>
        {currentHint >= 0 && (
          <motion.div
            key={currentHint}
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-hist-orange/10 border border-hist-orange/30 rounded-xl px-4 py-2 text-sm text-gray-700 max-w-xs text-center"
          >
            {hints[currentHint]}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
