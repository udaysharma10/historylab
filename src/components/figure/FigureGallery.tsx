import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { figures } from '../../data/figures'
import type { FigureType } from '../../types/figure'

interface FigureGalleryProps {
  onSelectFigure: (figureId: string) => void
  onBack: () => void
}

const SECTION_COLORS: Record<string, string> = {
  s1: '#C0392B', s2: '#2980B9', s3: '#D9821F',
  s4: '#1F9E57', s5: '#7D3C98', s6: '#16A085',
}

const SECTION_LABELS: Record<string, string> = {
  s1: 'French Revolution',
  s2: 'Making of Nationalism',
  s3: 'Age of Revolutions',
  s4: 'Germany & Italy',
  s5: 'Visualising the Nation',
  s6: 'Nationalism & Imperialism',
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

const TYPE_FILTERS: { value: FigureType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'painting', label: 'Paintings' },
  { value: 'caricature', label: 'Caricatures' },
  { value: 'map', label: 'Maps' },
  { value: 'stamp', label: 'Stamps' },
  { value: 'banner', label: 'Banners' },
  { value: 'almanac', label: 'Almanacs' },
]

export function FigureGallery({ onSelectFigure, onBack }: FigureGalleryProps) {
  const [sectionFilter, setSectionFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<FigureType | 'all'>('all')

  const filteredFigures = useMemo(() => {
    return figures.filter(f => {
      if (sectionFilter !== 'all' && f.sectionId !== sectionFilter) return false
      if (typeFilter !== 'all' && f.type !== typeFilter) return false
      return true
    })
  }, [sectionFilter, typeFilter])

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back button */}
      <motion.button
        className="text-gray-400 font-body text-sm mb-4 flex items-center gap-1 hover:text-hist-dark"
        onClick={onBack}
        whileHover={{ x: -3 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to Figures
      </motion.button>

      {/* Header */}
      <motion.div
        className="mb-5"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-display text-2xl font-bold text-hist-dark mb-1">All Figures</h2>
        <p className="font-body text-sm text-gray-400">
          {filteredFigures.length} figure{filteredFigures.length !== 1 ? 's' : ''}
          {sectionFilter !== 'all' && ` in ${SECTION_LABELS[sectionFilter]}`}
        </p>
      </motion.div>

      {/* Section filter chips */}
      <motion.div
        className="flex flex-wrap gap-2 mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <button
          className="text-xs font-body font-semibold px-3 py-1.5 rounded-full transition-colors"
          style={{
            backgroundColor: sectionFilter === 'all' ? '#2A2750' : '#F3F4F6',
            color: sectionFilter === 'all' ? 'white' : '#6B7280',
          }}
          onClick={() => setSectionFilter('all')}
        >
          All Sections
        </button>
        {Object.entries(SECTION_LABELS).map(([id, label]) => (
          <button
            key={id}
            className="text-xs font-body font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: sectionFilter === id ? SECTION_COLORS[id] : `${SECTION_COLORS[id]}12`,
              color: sectionFilter === id ? 'white' : SECTION_COLORS[id],
            }}
            onClick={() => setSectionFilter(sectionFilter === id ? 'all' : id)}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Type filter chips */}
      <motion.div
        className="flex flex-wrap gap-2 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        {TYPE_FILTERS.map(({ value, label }) => (
          <button
            key={value}
            className="text-xs font-body font-semibold px-3 py-1.5 rounded-full transition-colors"
            style={{
              backgroundColor: typeFilter === value ? '#7D3C98' : '#F3F4F6',
              color: typeFilter === value ? 'white' : '#6B7280',
            }}
            onClick={() => setTypeFilter(typeFilter === value ? 'all' : value)}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Figure grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredFigures.map((figure, i) => {
          const color = SECTION_COLORS[figure.sectionId] || '#2980B9'
          const typeIcon = FIGURE_TYPE_ICONS[figure.type] || '🖼️'

          return (
            <motion.button
              key={figure.id}
              className="bg-white rounded-2xl overflow-hidden shadow-card text-left hover:shadow-card-hover transition-shadow"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectFigure(figure.id)}
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                <img
                  src={figure.imagePath}
                  alt={figure.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Figure number badge */}
                <div
                  className="absolute top-2 left-2 px-2.5 py-1 rounded-lg text-white text-xs font-display font-bold shadow-sm"
                  style={{ backgroundColor: color }}
                >
                  Fig {figure.number}
                </div>
                {/* Exam badge */}
                {figure.examRelevance === 'high' && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold shadow-sm">
                    EXAM
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4">
                <div className="flex items-start gap-2 mb-1.5">
                  <span className="text-base shrink-0">{typeIcon}</span>
                  <h3 className="font-display font-bold text-sm text-hist-dark leading-snug line-clamp-2">
                    {figure.title}
                  </h3>
                </div>
                {figure.artist && (
                  <p className="text-xs text-gray-400 italic font-body mb-2">
                    {figure.artist}{figure.year ? `, ${figure.year}` : ''}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-[11px] font-body text-gray-400">
                    {SECTION_LABELS[figure.sectionId]}
                  </span>
                  <span className="text-[11px] font-body text-gray-300">
                    &middot; {figure.hotspots.length} hotspot{figure.hotspots.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>

      {filteredFigures.length === 0 && (
        <div className="text-center py-12">
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-display font-bold text-gray-400">No figures match your filters</p>
          <p className="font-body text-sm text-gray-300 mt-1">Try adjusting your section or type filters</p>
        </div>
      )}
    </div>
  )
}
