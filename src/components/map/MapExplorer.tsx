import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMapDefinitions, CHAPTER_SECTION_LABELS } from '../../data/getChapter'
import { InteractiveMap } from './InteractiveMap'

interface MapExplorerProps {
  onBack: () => void
  chapterId: string
}

export function MapExplorer({ onBack, chapterId }: MapExplorerProps) {
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null)
  const [revealedRegion, setRevealedRegion] = useState<string | null>(null)

  const mapDefinitions = useMemo(() => getMapDefinitions(chapterId), [chapterId])
  const SECTION_LABELS = CHAPTER_SECTION_LABELS[chapterId] || CHAPTER_SECTION_LABELS.ch1

  const selectedMap = mapDefinitions.find(m => m.id === selectedMapId)

  if (selectedMap) {
    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-4 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => { setSelectedMapId(null); setRevealedRegion(null) }}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          All Maps
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-xl font-bold text-hist-dark mb-1">{selectedMap.title}</h2>
          <p className="font-body text-sm text-gray-500 mb-4">{selectedMap.subtitle}</p>

          {/* Map with all regions labeled */}
          <InteractiveMap
            imagePath={selectedMap.imagePath}
            regions={selectedMap.regions}
            highlightedRegions={revealedRegion ? new Map([[revealedRegion, 'label']]) : undefined}
            showLabels={true}
            onRegionClick={(id) => setRevealedRegion(id === revealedRegion ? null : id)}
            sectionColor={selectedMap.sectionColor}
          />

          {/* Region details on tap */}
          <AnimatePresence>
            {revealedRegion && (
              <motion.div
                className="mt-4 bg-white rounded-xl p-4 shadow-card border-l-4"
                style={{ borderColor: selectedMap.sectionColor }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key={revealedRegion}
              >
                <h4 className="font-display font-bold text-hist-dark text-base mb-1">
                  {selectedMap.regions.find(r => r.id === revealedRegion)?.label}
                </h4>
                <p className="font-body text-sm text-gray-600 leading-relaxed">
                  {selectedMap.regions.find(r => r.id === revealedRegion)?.description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Region list */}
          <div className="mt-4">
            <h3 className="font-display font-bold text-sm text-gray-500 mb-3 uppercase tracking-wide">Regions on this Map</h3>
            <div className="space-y-2">
              {selectedMap.regions.map((region, i) => (
                <motion.button
                  key={region.id}
                  className={`w-full text-left bg-white rounded-xl p-3 shadow-card transition-all ${
                    revealedRegion === region.id ? 'ring-2' : ''
                  }`}
                  style={revealedRegion === region.id ? { borderColor: selectedMap.sectionColor, borderWidth: 2 } : {}}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setRevealedRegion(region.id === revealedRegion ? null : region.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ backgroundColor: selectedMap.sectionColor }}
                    >
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-display font-bold text-sm text-hist-dark">{region.label}</span>
                      {region.description && (
                        <p className="font-body text-xs text-gray-400 mt-0.5 truncate">{region.description}</p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Exam tip */}
          <motion.div
            className="mt-4 rounded-xl p-3 bg-hist-gold/10 border border-hist-gold/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-display font-bold text-xs text-hist-gold mb-1">EXAM TIP</p>
            <p className="font-body text-xs text-gray-600">{selectedMap.examTip}</p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Map list view
  return (
    <div className="max-w-lg mx-auto">
      <motion.button
        className="text-gray-400 font-body text-sm mb-4 flex items-center gap-1 hover:text-hist-dark"
        onClick={onBack}
        whileHover={{ x: -3 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back to Maps
      </motion.button>

      <h2 className="font-display text-xl font-bold text-hist-dark mb-1">Explore Maps</h2>
      <p className="font-body text-sm text-gray-500 mb-6">
        Browse <strong>{mapDefinitions.length} {mapDefinitions.length === 1 ? 'interactive map' : 'historical maps'}</strong> from the chapter. Tap each marked place to learn why it matters.
      </p>

      <div className="space-y-4">
        {mapDefinitions.map((map, i) => (
          <motion.button
            key={map.id}
            className="w-full bg-white rounded-2xl overflow-hidden shadow-card text-left hover:shadow-card-hover transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedMapId(map.id)}
          >
            {/* Map preview */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={map.imagePath}
                alt={map.title}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4">
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: map.sectionColor }}
                >
                  {SECTION_LABELS[map.sectionId] || map.sectionId}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-display font-bold text-hist-dark text-base mb-1">{map.title}</h3>
              <p className="font-body text-xs text-gray-500">{map.subtitle}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-body text-gray-400">
                  {map.regions.length} regions to explore
                </span>
                {map.examTip && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-hist-gold/15 text-hist-gold">
                    EXAM
                  </span>
                )}
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
