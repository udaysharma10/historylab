import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { MapIdentifyActivity } from '../../types/activity'
import { getMapById } from '../../data/maps'
import { InteractiveMap } from './InteractiveMap'
import { HintButton } from '../common/HintButton'
import { useSound } from '../../hooks/useSound'

interface MapIdentifyCardProps {
  activity: MapIdentifyActivity
  sectionColor: string
  questionNumber: number
  totalQuestions: number
  onAnswer: (correct: boolean, hintsUsed: number) => void
}

export function MapIdentifyCard({ activity, sectionColor, questionNumber, totalQuestions, onAnswer }: MapIdentifyCardProps) {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [checked, setChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const { playCorrect, playWrong } = useSound()

  const mapDef = useMemo(() => getMapById(activity.mapId), [activity.mapId])

  const highlightedRegions = useMemo(() => {
    const map = new Map<string, 'correct' | 'wrong' | 'selected' | 'label'>()
    if (!checked && selectedRegion) {
      map.set(selectedRegion, 'selected')
    }
    if (checked) {
      if (isCorrect) {
        map.set(activity.correctRegionId, 'correct')
      } else {
        if (selectedRegion) map.set(selectedRegion, 'wrong')
        map.set(activity.correctRegionId, 'correct')
      }
    }
    return map
  }, [checked, selectedRegion, isCorrect, activity.correctRegionId])

  const handleRegionClick = useCallback((regionId: string) => {
    if (checked) return
    setSelectedRegion(regionId)
  }, [checked])

  const handleCheck = useCallback(() => {
    if (!selectedRegion || checked) return
    const correct = selectedRegion === activity.correctRegionId
    setIsCorrect(correct)
    setChecked(true)
    if (correct) {
      playCorrect()
    } else {
      playWrong()
    }
    setTimeout(() => onAnswer(correct, hintsUsed), correct ? 1200 : 2200)
  }, [selectedRegion, checked, activity.correctRegionId, hintsUsed, playCorrect, playWrong, onAnswer])

  if (!mapDef) return null

  const selectedLabel = mapDef.regions.find(r => r.id === selectedRegion)?.label
  const correctLabel = mapDef.regions.find(r => r.id === activity.correctRegionId)?.label

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
            Map Identify
          </span>
        </div>

        {/* Question */}
        <h3 className="font-display font-bold text-hist-dark text-lg mb-1">Find on the Map</h3>
        <p className="font-body text-sm text-gray-600 mb-4 leading-relaxed">{activity.question}</p>

        {/* Map */}
        <div className="mb-4">
          <InteractiveMap
            imagePath={mapDef.imagePath}
            regions={mapDef.regions}
            highlightedRegions={highlightedRegions}
            onRegionClick={handleRegionClick}
            showLabels={checked}
            sectionColor={sectionColor}
            disabled={checked}
          />
        </div>

        {/* Selected region indicator */}
        {selectedRegion && !checked && (
          <motion.div
            className="flex items-center gap-2 mb-3 px-4 py-2.5 rounded-xl"
            style={{ backgroundColor: `${sectionColor}10`, border: `2px solid ${sectionColor}30` }}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sectionColor }} />
            <span className="font-body text-sm text-hist-dark">
              Selected: <strong className="font-display">{selectedLabel}</strong>
            </span>
          </motion.div>
        )}

        {/* Hint button */}
        {!checked && (
          <div className="flex justify-center mb-3">
            <HintButton hints={activity.hints} onHintUsed={() => setHintsUsed(h => h + 1)} />
          </div>
        )}

        {/* Check button */}
        {!checked && (
          <div className="flex justify-center">
            <motion.button
              className="text-white font-display text-base px-8 py-2.5 rounded-full shadow-button btn-press disabled:opacity-40"
              style={{ backgroundColor: sectionColor }}
              whileHover={selectedRegion ? { scale: 1.05 } : {}}
              whileTap={selectedRegion ? { scale: 0.95 } : {}}
              onClick={handleCheck}
              disabled={!selectedRegion}
            >
              Check Answer
            </motion.button>
          </div>
        )}

        {/* Result feedback */}
        <AnimatePresence>
          {checked && (
            <motion.div
              className={`mt-4 rounded-xl p-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}
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
                  {isCorrect ? '🎉' : '💡'}
                </motion.span>
                <div>
                  <p className={`font-display font-bold text-sm ${isCorrect ? 'text-green-700' : 'text-amber-700'}`}>
                    {isCorrect
                      ? `Correct! That's ${correctLabel}.`
                      : `Not quite — you selected ${selectedLabel}.`}
                  </p>
                  {!isCorrect && (
                    <p className="font-body text-xs text-amber-600 mt-1">
                      The correct answer is <strong>{correctLabel}</strong> (highlighted in green on the map).
                    </p>
                  )}
                  {mapDef.regions.find(r => r.id === activity.correctRegionId)?.description && (
                    <p className="font-body text-xs text-gray-500 mt-1.5 leading-relaxed">
                      {mapDef.regions.find(r => r.id === activity.correctRegionId)!.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exam tip */}
        {checked && activity.examRelevance === 'high' && (
          <motion.div
            className="mt-3 rounded-xl p-3 bg-hist-gold/10 border border-hist-gold/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="font-display font-bold text-xs text-hist-gold">
              EXAM TIP: This region appears frequently in CBSE board exam map questions!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
