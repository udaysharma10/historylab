import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMapsBySection } from '../../data/getChapter'
import { InteractiveMap } from '../map/InteractiveMap'

interface SectionMapsProps {
  sectionId: string
  sectionColor: string
  chapterId?: string
}

export function SectionMaps({ sectionId, sectionColor, chapterId = 'ch1' }: SectionMapsProps) {
  const maps = getMapsBySection(chapterId, sectionId)
  const [selectedMapId, setSelectedMapId] = useState<string | null>(null)
  const [revealedRegion, setRevealedRegion] = useState<string | null>(null)

  if (maps.length === 0) return null

  const selectedMap = maps.find(m => m.id === selectedMapId)

  // Build highlighted regions — all labeled
  const highlightedRegions = new Map<string, 'correct' | 'wrong' | 'selected' | 'label'>()
  if (selectedMap) {
    selectedMap.regions.forEach(r => highlightedRegions.set(r.id, 'label'))
  }

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
          <span className="text-lg">🗺️</span>
        </div>
        <div>
          <h3 className="font-display font-bold text-hist-dark text-base">Explore Maps</h3>
          <p className="text-xs text-gray-400 font-body">{maps.length} map{maps.length > 1 ? 's' : ''} — tap regions to learn more</p>
        </div>
      </div>

      <div className="px-5 pb-5">
        <AnimatePresence mode="wait">
          {!selectedMap ? (
            // Map cards list
            <motion.div
              key="list"
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {maps.map((map, i) => (
                <motion.button
                  key={map.id}
                  className="w-full text-left rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { setSelectedMapId(map.id); setRevealedRegion(null) }}
                >
                  <div className="aspect-[16/9] overflow-hidden bg-gray-50">
                    <img
                      src={map.imagePath}
                      alt={map.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 flex items-center gap-3">
                    <div className="flex-1">
                      <h4 className="font-display font-bold text-hist-dark text-sm">{map.title}</h4>
                      <p className="text-xs text-gray-400 font-body mt-0.5">
                        {map.regions.length} clickable regions
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-xs font-display font-bold px-3 py-1.5 rounded-full text-white"
                      style={{ backgroundColor: sectionColor }}
                    >
                      Tap to explore
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            // Selected map view
            <motion.div
              key="map"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <button
                className="text-gray-400 font-body text-xs mb-3 flex items-center gap-1 hover:text-hist-dark"
                onClick={() => { setSelectedMapId(null); setRevealedRegion(null) }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                All maps
              </button>

              <h4 className="font-display font-bold text-hist-dark text-base mb-1">{selectedMap.title}</h4>
              <p className="font-body text-xs text-gray-500 mb-3">{selectedMap.subtitle}</p>

              <InteractiveMap
                imagePath={selectedMap.imagePath}
                regions={selectedMap.regions}
                highlightedRegions={highlightedRegions}
                showLabels={true}
                onRegionClick={(id) => setRevealedRegion(id === revealedRegion ? null : id)}
                sectionColor={sectionColor}
              />

              {/* Hint or Region detail */}
              <AnimatePresence mode="wait">
                {!revealedRegion && (
                  <motion.div
                    key="map-hint"
                    className="mt-3 rounded-xl p-3 text-center"
                    style={{ backgroundColor: `${sectionColor}05`, border: `1px dashed ${sectionColor}25` }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-sm text-gray-400 font-body">
                      <span className="text-base mr-1">👆</span> Tap any labeled region on the map to learn about it
                    </p>
                  </motion.div>
                )}
                {revealedRegion && (() => {
                  const region = selectedMap.regions.find(r => r.id === revealedRegion)
                  if (!region) return null
                  return (
                    <motion.div
                      className="mt-3 rounded-xl p-4"
                      style={{ backgroundColor: `${sectionColor}08`, border: `1px solid ${sectionColor}20` }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <h5 className="font-display font-bold text-sm" style={{ color: sectionColor }}>
                        {region.label}
                      </h5>
                      <p className="text-sm font-body text-hist-dark/80 mt-1 leading-relaxed">
                        {region.description}
                      </p>
                    </motion.div>
                  )
                })()}
              </AnimatePresence>

              {/* Exam tip */}
              {selectedMap.examTip && (
                <div className="mt-3 rounded-lg p-3 flex gap-2 items-start bg-amber-50 border border-amber-200">
                  <span className="text-sm shrink-0">💡</span>
                  <p className="font-body text-xs text-amber-800 leading-relaxed">
                    <strong>Exam Tip:</strong> {selectedMap.examTip}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
