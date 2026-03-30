import { useState } from 'react'
import { motion } from 'framer-motion'
import { FigureHotspotOverlay } from './FigureHotspotOverlay'
import { FigureAnalysisPanel } from './FigureAnalysisPanel'
import type { Figure } from '../../types/figure'

interface FigureDetailProps {
  figure: Figure
  sectionColor: string
  onBack: () => void
  onPrev?: () => void
  onNext?: () => void
  currentIndex?: number
  totalFigures?: number
}

const FIGURE_TYPE_ICONS: Record<string, string> = {
  painting: '🎨',
  caricature: '✏️',
  map: '🗺️',
  photograph: '📷',
  stamp: '📮',
  banner: '🏴',
  almanac: '📰',
  illustration: '🖌️',
}

const FIGURE_TYPE_LABELS: Record<string, string> = {
  painting: 'Painting',
  caricature: 'Caricature',
  map: 'Map',
  photograph: 'Photograph',
  stamp: 'Stamp',
  banner: 'Banner',
  almanac: 'Almanac',
  illustration: 'Illustration',
}

export function FigureDetail({
  figure,
  sectionColor,
  onBack,
  onPrev,
  onNext,
  currentIndex,
  totalFigures,
}: FigureDetailProps) {
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null)

  const typeIcon = FIGURE_TYPE_ICONS[figure.type] || '🖼️'
  const typeLabel = FIGURE_TYPE_LABELS[figure.type] || 'Figure'

  return (
    <motion.div
      className="max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Back button */}
      <motion.button
        className="text-gray-400 font-body text-sm mb-4 flex items-center gap-1 hover:text-hist-dark"
        onClick={onBack}
        whileHover={{ x: -3 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to Gallery
      </motion.button>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        {/* Top accent */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />

        {/* Header */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{typeIcon}</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-display font-bold text-lg" style={{ color: sectionColor }}>
                    Figure {figure.number}
                  </span>
                  <span className="text-xs font-body font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}
                  >
                    {typeLabel}
                  </span>
                </div>
                {figure.artist && (
                  <p className="text-sm text-gray-400 italic font-body mt-0.5">
                    {figure.artist}{figure.year ? `, ${figure.year}` : ''}
                  </p>
                )}
              </div>
            </div>
            {figure.examRelevance === 'high' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200 shrink-0">
                Exam Important
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="font-display text-xl sm:text-2xl font-bold text-hist-dark leading-snug mb-2">
            "{figure.title}"
          </h2>
          <p className="font-body text-sm text-gray-500 leading-relaxed mb-5">{figure.caption}</p>

          {/* Interactive figure with hotspots */}
          <div className="mb-5">
            <FigureHotspotOverlay
              figure={figure}
              sectionColor={sectionColor}
              activeHotspotId={activeHotspotId}
              onHotspotClick={setActiveHotspotId}
            />
          </div>

          {/* Hotspot tag pills */}
          {figure.hotspots.length > 0 && (
            <div className="mb-6">
              <p className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider mb-2">
                Tap hotspots on the image, or click below
              </p>
              <div className="flex flex-wrap gap-1.5">
                {figure.hotspots.map((spot) => (
                  <motion.button
                    key={spot.id}
                    className="text-xs px-3 py-1.5 rounded-full font-body font-semibold transition-colors"
                    style={{
                      backgroundColor: activeHotspotId === spot.id ? sectionColor : `${sectionColor}12`,
                      color: activeHotspotId === spot.id ? 'white' : sectionColor,
                      border: `1px solid ${activeHotspotId === spot.id ? sectionColor : `${sectionColor}25`}`,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveHotspotId(activeHotspotId === spot.id ? null : spot.id)}
                  >
                    {spot.label}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="border-t mb-5" style={{ borderColor: `${sectionColor}15` }} />

          {/* Analysis — always expanded */}
          <div className="mb-2">
            <h3 className="font-display font-bold text-base mb-4" style={{ color: sectionColor }}>
              Figure Analysis
            </h3>
            <FigureAnalysisPanel analysis={figure.analysis} sectionColor={sectionColor} />
          </div>
        </div>

        {/* Navigation footer */}
        {(onPrev || onNext) && (
          <div className="border-t px-5 py-4 flex items-center justify-between" style={{ borderColor: `${sectionColor}10` }}>
            <motion.button
              className="flex items-center gap-1.5 font-body text-sm disabled:opacity-30"
              style={{ color: sectionColor }}
              disabled={!onPrev}
              onClick={onPrev}
              whileHover={onPrev ? { x: -3 } : {}}
              whileTap={onPrev ? { scale: 0.95 } : {}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
              Previous
            </motion.button>

            {currentIndex !== undefined && totalFigures !== undefined && (
              <span className="font-body text-xs text-gray-400">
                {currentIndex + 1} of {totalFigures}
              </span>
            )}

            <motion.button
              className="flex items-center gap-1.5 font-body text-sm disabled:opacity-30"
              style={{ color: sectionColor }}
              disabled={!onNext}
              onClick={onNext}
              whileHover={onNext ? { x: 3 } : {}}
              whileTap={onNext ? { scale: 0.95 } : {}}
            >
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
