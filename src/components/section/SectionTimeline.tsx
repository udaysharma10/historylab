import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { keyDates } from '../../data/keyDates'

interface SectionTimelineProps {
  sectionId: string
  sectionColor: string
}

export function SectionTimeline({ sectionId, sectionColor }: SectionTimelineProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const events = useMemo(() =>
    keyDates
      .filter(d => d.sectionId === sectionId)
      .sort((a, b) => a.year - b.year),
    [sectionId]
  )

  if (events.length === 0) return null

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="px-5 pt-5 pb-3 flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${sectionColor}15` }}
        >
          <span className="text-lg">📅</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-hist-dark text-base">Explore Timeline</h3>
          <p className="text-xs text-gray-400 font-body">{events.length} key events — tap to expand</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <div className="relative pl-6 space-y-0">
          {/* Vertical line */}
          <div
            className="absolute left-[11px] top-2 bottom-2 w-0.5"
            style={{ backgroundColor: `${sectionColor}25` }}
          />

          {events.map((event, i) => {
            const isExpanded = expandedId === event.id
            return (
              <motion.button
                key={event.id}
                className="relative flex gap-3 items-start pb-3 w-full text-left"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setExpandedId(isExpanded ? null : event.id)}
              >
                {/* Dot */}
                <div
                  className="absolute left-[-17px] top-1.5 w-3.5 h-3.5 rounded-full border-2 shrink-0 z-10 transition-colors"
                  style={{
                    borderColor: sectionColor,
                    backgroundColor: isExpanded ? sectionColor : 'white',
                  }}
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Year badge */}
                    <span
                      className="shrink-0 text-xs font-display font-bold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${sectionColor}12`, color: sectionColor }}
                    >
                      {event.year}{event.yearEnd ? `–${event.yearEnd}` : ''}
                    </span>
                    {/* Importance badge */}
                    {event.importance === 'major' && (
                      <span className="text-xs font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                        Important
                      </span>
                    )}
                  </div>

                  <p className="font-body text-sm text-hist-dark/85 mt-1 leading-snug">{event.event}</p>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        className="mt-2 text-xs font-body text-gray-500 leading-relaxed rounded-lg p-3"
                        style={{ backgroundColor: `${sectionColor}06` }}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {event.detail}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
