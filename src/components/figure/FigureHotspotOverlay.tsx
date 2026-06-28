import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Figure } from '../../types/figure'

interface FigureHotspotOverlayProps {
  figure: Figure
  sectionColor: string
  activeHotspotId: string | null
  onHotspotClick: (id: string | null) => void
}

export function FigureHotspotOverlay({
  figure,
  sectionColor,
  activeHotspotId,
  onHotspotClick,
}: FigureHotspotOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleDotClick = (id: string) => {
    onHotspotClick(activeHotspotId === id ? null : id)
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden shadow-card">
      <img
        src={figure.imagePath}
        alt={figure.title}
        className="w-full h-auto block"
        draggable={false}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />

      {/* Hotspot pulsing dots */}
      {imageLoaded && figure.hotspots.map((spot) => {
        const isActive = activeHotspotId === spot.id

        return (
          <div key={spot.id}>
            {/* Pulsing ring (behind the dot) */}
            {!isActive && (
              <motion.div
                className="absolute rounded-full pointer-events-none"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: 32,
                  height: 32,
                  marginLeft: -16,
                  marginTop: -16,
                  border: `2px solid ${sectionColor}`,
                  opacity: 0.4,
                }}
                animate={{
                  scale: [1, 1.8, 1],
                  opacity: [0.4, 0, 0.4],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            {/* Clickable dot */}
            <motion.button
              className="absolute rounded-full flex items-center justify-center shadow-lg z-10"
              style={{
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: isActive ? 36 : 28,
                height: isActive ? 36 : 28,
                marginLeft: isActive ? -18 : -14,
                marginTop: isActive ? -18 : -14,
                backgroundColor: isActive ? sectionColor : `${sectionColor}CC`,
                border: '3px solid white',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleDotClick(spot.id)}
              aria-label={`Hotspot: ${spot.label}`}
              layout
            >
              <span className="text-white text-xs font-bold select-none">
                {isActive ? '−' : '+'}
              </span>
            </motion.button>

            {/* Tooltip — flips above the dot when the dot is low, and clamps horizontally,
                so it never gets clipped beneath/beside the image frame */}
            <AnimatePresence>
              {isActive && (() => {
                const tipBelow = spot.y < 58
                const tx = spot.x < 24 ? '-12%' : spot.x > 76 ? '-88%' : '-50%'
                return (
                  <motion.div
                    className="absolute z-20 pointer-events-none"
                    style={{
                      left: `${spot.x}%`,
                      top: `${spot.y}%`,
                      width: 200,
                      transform: `translate(${tx}, ${tipBelow ? '22px' : 'calc(-100% - 22px)'})`,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="rounded-xl px-4 py-3 shadow-lg text-white"
                      style={{ backgroundColor: sectionColor }}
                    >
                      <p className="font-display font-bold text-sm mb-1">{spot.label}</p>
                      <p className="font-body text-xs leading-relaxed opacity-90">{spot.description}</p>
                    </div>
                  </motion.div>
                )
              })()}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
