import { motion } from 'framer-motion'

interface SectionHeaderProps {
  title: string
  sectionNumber: number
  color: string
  progress: number  // 0-100
  totalStars: number
  maxStars: number
}

export function SectionHeader({ title, sectionNumber, color, progress, totalStars, maxStars }: SectionHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-lg"
          style={{ backgroundColor: color }}
        >
          {sectionNumber}
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-hist-dark leading-tight">{title}</h2>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#C99A3A" stroke="#B5841F" strokeWidth="0.5" />
          </svg>
          <span className="font-display font-bold">{totalStars}/{maxStars}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
