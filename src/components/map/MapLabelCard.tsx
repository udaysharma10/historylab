import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MapLabelActivity } from '../../types/activity'
import { getMapById } from '../../data/getChapter'
import { InteractiveMap } from './InteractiveMap'
import { useSound } from '../../hooks/useSound'

interface MapLabelCardProps {
  chapterId: string
  activity: MapLabelActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

export function MapLabelCard({ chapterId, activity, sectionColor, questionNumber, totalQuestions, onAnswer }: MapLabelCardProps) {
  // Currently selected label from the pool (waiting to be placed)
  const [activeLabelId, setActiveLabelId] = useState<string | null>(null)
  // Mapping: labelId → regionId (user's placements)
  const [placements, setPlacements] = useState<Map<string, string>>(new Map())
  const [checked, setChecked] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const { playCorrect, playWrong } = useSound()

  const mapDef = useMemo(() => getMapById(chapterId, activity.mapId), [chapterId, activity.mapId])

  // Which regions have been assigned (regionId → labelId)
  // Unplaced labels
  const unplacedLabels = useMemo(() =>
    activity.labels.filter(l => !placements.has(l.id)),
    [activity.labels, placements]
  )

  // Build highlighted regions
  const highlightedRegions = useMemo(() => {
    const map = new Map<string, 'correct' | 'wrong' | 'selected' | 'label'>()

    if (!checked) {
      // Show placed labels
      placements.forEach((regionId) => {
        map.set(regionId, 'label')
      })
    } else {
      // Show correctness
      activity.labels.forEach(label => {
        const placedRegion = placements.get(label.id)
        if (placedRegion === label.correctRegionId) {
          map.set(placedRegion, 'correct')
        } else {
          if (placedRegion) map.set(placedRegion, 'wrong')
          map.set(label.correctRegionId, 'correct')
        }
      })
    }

    return map
  }, [checked, placements, activity.labels])

  const handleRegionClick = useCallback((regionId: string) => {
    if (checked) return

    // If we have an active label, place it
    if (activeLabelId) {
      // Remove any existing label from this region
      const newPlacements = new Map(placements)
      // Remove if this label was placed elsewhere
      newPlacements.delete(activeLabelId)
      // Remove if another label was on this region
      newPlacements.forEach((r, l) => {
        if (r === regionId) newPlacements.delete(l)
      })
      // Place the label
      newPlacements.set(activeLabelId, regionId)
      setPlacements(newPlacements)
      setActiveLabelId(null)
      return
    }

    // If tapping a region that has a label, remove it
    const labelOnRegion = Array.from(placements.entries()).find(([, r]) => r === regionId)
    if (labelOnRegion) {
      const newPlacements = new Map(placements)
      newPlacements.delete(labelOnRegion[0])
      setPlacements(newPlacements)
    }
  }, [checked, activeLabelId, placements])

  const handleLabelClick = useCallback((labelId: string) => {
    if (checked) return
    setActiveLabelId(prev => prev === labelId ? null : labelId)
  }, [checked])

  const handleCheck = useCallback(() => {
    if (checked || placements.size < activity.labels.length) return

    let correct = 0
    activity.labels.forEach(label => {
      if (placements.get(label.id) === label.correctRegionId) correct++
    })

    setCorrectCount(correct)
    setChecked(true)

    const allCorrect = correct === activity.labels.length
    if (allCorrect) {
      playCorrect()
    } else {
      playWrong()
    }

    setTimeout(() => onAnswer(allCorrect, 0), allCorrect ? 1200 : 2500)
  }, [checked, placements, activity.labels, playCorrect, playWrong, onAnswer])

  const handleClear = useCallback(() => {
    if (checked) return
    setPlacements(new Map())
    setActiveLabelId(null)
  }, [checked])

  if (!mapDef) return null

  const allPlaced = placements.size === activity.labels.length

  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: '2px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />

      <div className="p-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionColor }}>
              <span className="text-white text-sm font-bold">{questionNumber}</span>
            </div>
            <span className="font-body text-sm text-gray-400">
              Question {questionNumber} of {totalQuestions}
            </span>
          </div>
          <span className="text-xs font-display font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}>
            Map Label
          </span>
        </div>

        {/* Instruction */}
        <h3 className="font-display font-bold text-hist-dark text-lg mb-1">Label the Map</h3>
        <p className="font-body text-sm text-gray-600 mb-2 leading-relaxed">{activity.instruction}</p>
        <p className="font-body text-xs text-gray-400 mb-4">
          Tap a label below, then tap the correct region on the map.
        </p>

        {/* Label pool */}
        {!checked && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold text-sm text-gray-500">
                Labels ({unplacedLabels.length} remaining)
              </span>
              {placements.size > 0 && (
                <motion.button
                  className="text-xs font-body text-gray-400 hover:text-red-500 underline"
                  onClick={handleClear}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear All
                </motion.button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {activity.labels.map(label => {
                const isPlaced = placements.has(label.id)
                const isActive = activeLabelId === label.id

                return (
                  <motion.button
                    key={label.id}
                    className={`font-body text-sm px-3 py-2 rounded-xl border-2 transition-all ${
                      isPlaced
                        ? 'bg-gray-100 text-gray-400 border-gray-200 line-through'
                        : isActive
                          ? 'text-white border-transparent shadow-lg'
                          : 'bg-white text-hist-dark border-gray-200 hover:border-gray-300'
                    }`}
                    style={isActive ? { backgroundColor: sectionColor, borderColor: sectionColor } : {}}
                    whileHover={!isPlaced ? { scale: 1.03, y: -2 } : {}}
                    whileTap={!isPlaced ? { scale: 0.97 } : {}}
                    onClick={() => handleLabelClick(label.id)}
                    disabled={isPlaced}
                    layout
                  >
                    {label.text}
                  </motion.button>
                )
              })}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="mb-4">
          <InteractiveMap
            imagePath={mapDef.imagePath}
            regions={mapDef.regions}
            highlightedRegions={highlightedRegions}
            onRegionClick={handleRegionClick}
            showLabels={true}
            dimUnselected={!!activeLabelId}
            sectionColor={sectionColor}
            disabled={checked}
          />
        </div>

        {/* Placed labels summary */}
        {!checked && placements.size > 0 && (
          <div className="mb-4 space-y-1.5">
            {Array.from(placements.entries()).map(([labelId, regionId]) => {
              const label = activity.labels.find(l => l.id === labelId)!
              const region = mapDef.regions.find(r => r.id === regionId)

              return (
                <motion.div
                  key={labelId}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  layout
                >
                  <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="font-body text-xs text-purple-800">
                    <strong>{label.text}</strong> → {region?.label || regionId}
                  </span>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Check button */}
        {!checked && (
          <div className="flex justify-center">
            <motion.button
              className="text-white font-display text-base px-8 py-2.5 rounded-full shadow-button btn-press disabled:opacity-40"
              style={{ backgroundColor: sectionColor }}
              whileHover={allPlaced ? { scale: 1.05 } : {}}
              whileTap={allPlaced ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={!allPlaced}
            >
              Check Labels
            </motion.button>
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {checked && (
            <motion.div
              className={`mt-4 rounded-xl p-4 ${
                correctCount === activity.labels.length
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-amber-50 border border-amber-200'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
            >
              <div className="flex gap-2.5 items-start">
                <motion.span
                  className="text-2xl shrink-0"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, delay: 0.3 }}
                >
                  {correctCount === activity.labels.length ? '🎉' : '💡'}
                </motion.span>
                <div>
                  <p className={`font-display font-bold text-sm ${
                    correctCount === activity.labels.length ? 'text-green-700' : 'text-amber-700'
                  }`}>
                    {correctCount === activity.labels.length
                      ? 'All labels correct!'
                      : `${correctCount} of ${activity.labels.length} labels correct`}
                  </p>
                  {correctCount < activity.labels.length && (
                    <div className="mt-2 space-y-1">
                      {activity.labels
                        .filter(l => placements.get(l.id) !== l.correctRegionId)
                        .map(label => {
                          const correctRegion = mapDef.regions.find(r => r.id === label.correctRegionId)
                          return (
                            <p key={label.id} className="font-body text-xs text-amber-600">
                              <strong>{label.text}</strong> → {correctRegion?.label || label.correctRegionId}
                            </p>
                          )
                        })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
