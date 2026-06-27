import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MapRegion } from '../../data/maps'

interface InteractiveMapProps {
  imagePath: string
  regions: MapRegion[]
  /** Region IDs to highlight (e.g. correct answer) */
  highlightedRegions?: Map<string, 'correct' | 'wrong' | 'selected' | 'label'>
  /** Called when a region is tapped */
  onRegionClick?: (regionId: string) => void
  /** If true, show region labels on the map */
  showLabels?: boolean
  /** If true, dim non-highlighted regions */
  dimUnselected?: boolean
  /** Section color for accents */
  sectionColor?: string
  /** Disable interaction */
  disabled?: boolean
}

const HIGHLIGHT_COLORS = {
  correct: { bg: 'rgba(34, 197, 94, 0.35)', border: '#22C55E' },
  wrong: { bg: 'rgba(239, 68, 68, 0.35)', border: '#EF4444' },
  selected: { bg: 'rgba(59, 130, 246, 0.3)', border: '#3B82F6' },
  label: { bg: 'rgba(139, 92, 246, 0.25)', border: '#8B5CF6' },
}

export function InteractiveMap({
  imagePath,
  regions,
  highlightedRegions,
  onRegionClick,
  showLabels = false,
  dimUnselected = false,
  sectionColor = '#2980B9',
  disabled = false,
}: InteractiveMapProps) {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [tooltip, setTooltip] = useState<{ region: MapRegion; x: number; y: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleRegionClick = (region: MapRegion) => {
    if (disabled) return
    onRegionClick?.(region.id)
  }

  const handlePointerEnter = (region: MapRegion, e: React.PointerEvent) => {
    setHoveredRegion(region.id)
    if (showLabels || highlightedRegions?.has(region.id)) {
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setTooltip({
          region,
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }

  const handlePointerLeave = () => {
    setHoveredRegion(null)
    setTooltip(null)
  }

  return (
    <div ref={containerRef} className="relative w-full rounded-xl overflow-hidden shadow-card">
      {/* Map image */}
      <img
        src={imagePath}
        alt="Historical map"
        className="w-full h-auto block"
        draggable={false}
      />

      {/* Clickable region overlays */}
      {regions.map(region => {
        const highlight = highlightedRegions?.get(region.id)
        const isHovered = hoveredRegion === region.id
        const isDimmed = dimUnselected && !highlight && !isHovered

        let bgColor = 'transparent'
        let borderColor = 'transparent'

        if (highlight) {
          bgColor = HIGHLIGHT_COLORS[highlight].bg
          borderColor = HIGHLIGHT_COLORS[highlight].border
        } else if (isHovered && !disabled) {
          bgColor = `${sectionColor}20`
          borderColor = `${sectionColor}80`
        }

        // Precise location marker at the exact centre of the region
        const markerColor = highlight ? HIGHLIGHT_COLORS[highlight].border : sectionColor
        const centerX = region.x + region.width / 2
        const centerY = region.y + region.height / 2

        return (
          <div key={region.id}>
            {/* Clickable hit-area (rectangle, subtle) */}
            <motion.button
              className="absolute rounded-lg transition-colors"
              style={{
                left: `${region.x}%`,
                top: `${region.y}%`,
                width: `${region.width}%`,
                height: `${region.height}%`,
                backgroundColor: bgColor,
                border: borderColor === 'transparent' ? '2px solid transparent' : `2px solid ${borderColor}`,
                cursor: disabled ? 'default' : 'pointer',
                opacity: isDimmed ? 0.3 : 1,
              }}
              onClick={() => handleRegionClick(region)}
              onPointerEnter={(e) => handlePointerEnter(region, e)}
              onPointerLeave={handlePointerLeave}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              aria-label={`Map region: ${region.label}`}
            />

            {/* Precise pin dot at the centre — marks the exact spot */}
            <motion.div
              className="absolute pointer-events-none rounded-full"
              style={{
                left: `${centerX}%`,
                top: `${centerY}%`,
                width: 14,
                height: 14,
                marginLeft: -7,
                marginTop: -7,
                backgroundColor: markerColor,
                border: '2.5px solid white',
                boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                opacity: isDimmed ? 0.3 : 1,
                zIndex: 5,
              }}
              animate={highlight || isHovered ? { scale: [1, 1.25, 1] } : { scale: 1 }}
              transition={{ duration: 0.8, repeat: (highlight || isHovered) ? Infinity : 0, ease: 'easeInOut' }}
            />
          </div>
        )
      })}

      {/* Region labels on the map */}
      {showLabels && regions.map(region => {
        const highlight = highlightedRegions?.get(region.id)
        if (!highlight) return null

        const color = HIGHLIGHT_COLORS[highlight]
        const labelX = region.x + region.width / 2
        const labelY = region.y + region.height / 2

        return (
          <motion.div
            key={`label-${region.id}`}
            className="absolute pointer-events-none flex items-center justify-center"
            style={{
              left: `${labelX}%`,
              top: `${labelY}%`,
              transform: 'translate(-50%, calc(-100% - 12px))',
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <span
              className="text-[10px] sm:text-xs font-display font-bold px-1.5 py-0.5 rounded-md shadow-sm whitespace-nowrap"
              style={{
                backgroundColor: color.border,
                color: 'white',
              }}
            >
              {region.label}
            </span>
          </motion.div>
        )
      })}

      {/* Tooltip on hover */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            className="absolute z-10 pointer-events-none"
            style={{
              left: Math.min(tooltip.x, (containerRef.current?.offsetWidth ?? 300) - 200),
              top: tooltip.y - 50,
            }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-hist-dark text-white text-xs font-body px-3 py-1.5 rounded-lg shadow-lg max-w-[180px]">
              <strong className="font-display">{tooltip.region.label}</strong>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
