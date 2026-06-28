import { motion } from 'framer-motion'

interface StarRatingProps {
  stars: number
  maxStars?: number
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const sizes = { sm: 20, md: 32, lg: 48 }

export function StarRating({ stars, maxStars = 3, size = 'md', animated = true }: StarRatingProps) {
  const px = sizes[size]

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: maxStars }).map((_, i) => {
        const filled = i < stars
        return (
          <motion.svg
            key={i}
            width={px}
            height={px}
            viewBox="0 0 24 24"
            initial={animated && filled ? { scale: 0, rotate: -180 } : false}
            animate={animated && filled ? { scale: 1, rotate: 0 } : {}}
            transition={{ delay: i * 0.2, type: 'spring', stiffness: 300 }}
          >
            <path
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
              fill={filled ? '#C99A3A' : '#E0E0E0'}
              stroke={filled ? '#B5841F' : '#CCCCCC'}
              strokeWidth="0.5"
            />
            {filled && (
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill="url(#starShine)"
                opacity="0.3"
              />
            )}
            <defs>
              <linearGradient id="starShine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
          </motion.svg>
        )
      })}
    </div>
  )
}
