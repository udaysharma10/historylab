import { motion } from 'framer-motion'

interface QuizProgressProps {
  current: number
  total: number
  results: ('correct' | 'wrong' | 'unanswered')[]
  sectionColor: string
}

export function QuizProgress({ current, total, results, sectionColor }: QuizProgressProps) {
  return (
    <div className="flex items-center gap-1.5 justify-center py-3">
      {Array.from({ length: total }).map((_, i) => {
        const result = results[i]
        const isCurrent = i === current

        let bg = '#E5E7EB' // unanswered
        if (result === 'correct') bg = '#22C55E'
        else if (result === 'wrong') bg = '#EF4444'
        else if (isCurrent) bg = sectionColor

        return (
          <motion.div
            key={i}
            className="rounded-full"
            style={{
              width: isCurrent ? 24 : 10,
              height: 10,
              backgroundColor: bg,
              borderRadius: isCurrent ? 5 : '50%',
            }}
            animate={{
              width: isCurrent ? 24 : 10,
              backgroundColor: bg,
            }}
            transition={{ duration: 0.2 }}
          />
        )
      })}
    </div>
  )
}
