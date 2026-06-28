import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { keyDates } from '../../data/keyDates'
import type { KeyDate } from '../../types/chapter'

const SECTION_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  s1: { label: 'French Revolution', color: '#C36B53', icon: '🇫🇷' },
  s2: { label: 'Making of Nationalism', color: '#5571B5', icon: '🏛️' },
  s3: { label: 'Age of Revolutions', color: '#C2893E', icon: '🔥' },
  s4: { label: 'Germany & Italy', color: '#5C9368', icon: '🗺️' },
  s5: { label: 'Visualising the Nation', color: '#9B5C9A', icon: '🎨' },
  s6: { label: 'Nationalism & Imperialism', color: '#3F8E84', icon: '🌍' },
}

const ALL_SECTIONS = ['all', 's1', 's2', 's3', 's4', 's5', 's6'] as const

interface TimelineExplorerProps {
  onBack: () => void
}

export function TimelineExplorer({ onBack }: TimelineExplorerProps) {
  const [filter, setFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const dates = filter === 'all' ? keyDates : keyDates.filter(d => d.sectionId === filter)
    return [...dates].sort((a, b) => a.year - b.year || a.id.localeCompare(b.id))
  }, [filter])

  // Group by decade for visual structure
  const decades = useMemo(() => {
    const map = new Map<number, KeyDate[]>()
    for (const d of filtered) {
      const decade = Math.floor(d.year / 10) * 10
      if (!map.has(decade)) map.set(decade, [])
      map.get(decade)!.push(d)
    }
    return [...map.entries()].sort(([a], [b]) => a - b)
  }, [filtered])

  const activeColor = filter === 'all' ? '#5571B5' : SECTION_CONFIG[filter]?.color || '#5571B5'

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={onBack}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Timeline
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-hist-blue">
            <span className="text-white text-lg">📅</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-hist-dark">Timeline Explorer</h1>
            <p className="font-body text-sm text-gray-400">{filtered.length} events from 1688 to 1905</p>
          </div>
        </div>
      </div>

      {/* Section filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {ALL_SECTIONS.map(s => {
          const active = filter === s
          const cfg = s === 'all' ? { label: 'All', color: '#5571B5', icon: '📜' } : SECTION_CONFIG[s]
          return (
            <motion.button
              key={s}
              className="font-body text-xs font-bold px-3 py-1.5 rounded-full transition-all"
              style={{
                backgroundColor: active ? cfg.color : `${cfg.color}12`,
                color: active ? 'white' : cfg.color,
                border: `1.5px solid ${active ? cfg.color : 'transparent'}`,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(s)}
            >
              {cfg.icon} {cfg.label}
            </motion.button>
          )
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

        {decades.map(([decade, events], di) => (
          <div key={decade} className="mb-6">
            {/* Decade marker */}
            <motion.div
              className="relative flex items-center gap-3 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: di * 0.05 }}
            >
              <div
                className="w-12 h-7 rounded-full flex items-center justify-center text-xs font-display font-bold text-white z-10"
                style={{ backgroundColor: activeColor }}
              >
                {decade}s
              </div>
            </motion.div>

            {/* Events in this decade */}
            {events.map((event, ei) => {
              const cfg = SECTION_CONFIG[event.sectionId]
              const isExpanded = expandedId === event.id
              const isMajor = event.importance === 'major'

              return (
                <motion.div
                  key={event.id}
                  className="relative pl-14 mb-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: di * 0.05 + ei * 0.03 }}
                >
                  {/* Dot on the timeline */}
                  <div
                    className="absolute left-4 top-4 z-10 rounded-full border-2 border-white"
                    style={{
                      width: isMajor ? 14 : 10,
                      height: isMajor ? 14 : 10,
                      backgroundColor: cfg?.color || '#999',
                      marginLeft: isMajor ? -1 : 1,
                    }}
                  />

                  <motion.button
                    className="w-full text-left bg-white rounded-xl p-4 shadow-card hover:shadow-card-hover transition-shadow"
                    style={{ borderLeft: `3px solid ${cfg?.color || '#999'}` }}
                    onClick={() => setExpandedId(isExpanded ? null : event.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0">
                        <span
                          className="font-display font-bold text-sm px-2 py-0.5 rounded-md text-white"
                          style={{ backgroundColor: cfg?.color || '#999' }}
                        >
                          {event.year}{event.yearEnd ? `–${event.yearEnd}` : ''}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-display font-bold text-hist-dark leading-snug ${isMajor ? 'text-base' : 'text-sm'}`}>
                          {event.event}
                        </h3>
                        {isMajor && (
                          <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-hist-gold/15 text-hist-gold">
                            EXAM IMPORTANT
                          </span>
                        )}
                      </div>
                      <motion.svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#999"
                        strokeWidth="2"
                        className="shrink-0 mt-1"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                      >
                        <path d="M6 9l6 6 6-6" />
                      </motion.svg>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          className="mt-3 pt-3 border-t border-gray-100"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <p className="font-body text-sm text-gray-600 leading-relaxed">
                            {event.detail}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs" style={{ color: cfg?.color }}>
                              {cfg?.icon} {cfg?.label}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </motion.div>
              )
            })}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 font-body">
            No events found for this section.
          </div>
        )}
      </div>
    </div>
  )
}
