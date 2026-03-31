import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getKeyDates } from '../../data/getChapter'

interface SectionTimelineProps {
  sectionId: string
  sectionColor: string
  chapterId?: string
}

export function SectionTimeline({ sectionId, sectionColor, chapterId = 'ch1' }: SectionTimelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const events = useMemo(() =>
    getKeyDates(chapterId)
      .filter(d => d.sectionId === sectionId)
      .sort((a, b) => a.year - b.year),
    [sectionId, chapterId]
  )

  if (events.length === 0) return null

  const selectedEvent = events.find(e => e.id === selectedId)

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${sectionColor}15` }}
        >
          <span className="text-lg">📅</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-hist-dark text-base">Explore Timeline</h3>
          <p className="text-xs text-gray-400 font-body">{events.length} key events — select a year to read more</p>
        </div>
      </div>

      {/* Year pills — horizontally scrollable */}
      <div className="px-5 pb-3">
        <div className="flex flex-wrap gap-2">
          {events.map((event, i) => {
            const isSelected = selectedId === event.id
            return (
              <motion.button
                key={event.id}
                className="relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-display font-bold transition-all border-2"
                style={isSelected ? {
                  backgroundColor: sectionColor,
                  borderColor: sectionColor,
                  color: 'white',
                  boxShadow: `0 2px 8px ${sectionColor}40`,
                } : {
                  backgroundColor: 'white',
                  borderColor: `${sectionColor}30`,
                  color: sectionColor,
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedId(isSelected ? null : event.id)}
              >
                {/* Radio-style indicator */}
                <span
                  className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0"
                  style={isSelected ? {
                    borderColor: 'white',
                  } : {
                    borderColor: `${sectionColor}50`,
                  }}
                >
                  {isSelected && (
                    <motion.span
                      className="w-1.5 h-1.5 rounded-full bg-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </span>
                {event.year}{event.yearEnd ? `–${event.yearEnd}` : ''}
                {event.importance === 'major' && (
                  <span className={`text-[10px] px-1 py-0 rounded ${isSelected ? 'bg-white/25 text-white' : 'bg-red-50 text-red-500'}`}>
                    ★
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Selected event detail */}
      <AnimatePresence mode="wait">
        {selectedEvent ? (
          <motion.div
            key={selectedEvent.id}
            className="mx-5 mb-5 rounded-xl overflow-hidden"
            style={{ border: `2px solid ${sectionColor}25` }}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Event header */}
            <div
              className="px-4 py-3 flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${sectionColor}12, ${sectionColor}06)` }}
            >
              <span
                className="text-sm font-display font-bold px-2.5 py-0.5 rounded-full text-white"
                style={{ backgroundColor: sectionColor }}
              >
                {selectedEvent.year}{selectedEvent.yearEnd ? `–${selectedEvent.yearEnd}` : ''}
              </span>
              {selectedEvent.importance === 'major' && (
                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  Exam Important
                </span>
              )}
            </div>

            {/* Event content */}
            <div className="px-4 py-3">
              <h4 className="font-display font-bold text-hist-dark text-base mb-2">
                {selectedEvent.event}
              </h4>
              <p className="font-body text-sm text-hist-dark/75 leading-relaxed">
                {selectedEvent.detail}
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="hint"
            className="mx-5 mb-5 rounded-xl p-4 text-center"
            style={{ backgroundColor: `${sectionColor}05`, border: `1px dashed ${sectionColor}25` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-sm text-gray-400 font-body">
              <span className="text-base mr-1">👆</span> Select a year above to see what happened
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
