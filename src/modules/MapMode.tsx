import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { MapExplorer, MapIdentifyCard, MapLabelCard } from '../components/map'
import { QuizProgress } from '../components/quiz'
import { QuizResults } from '../components/quiz/QuizResults'
import { getMapDefinitions, getMapIdentifyActivities, getMapLabelActivities, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { calculateStars } from '../engine/scoringEngine'
import { calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'
import type { MapIdentifyActivity, MapLabelActivity } from '../types/activity'

type MapPhase = 'home' | 'explore' | 'playing-identify' | 'playing-label' | 'results'

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: '#5C9368' },
  medium: { label: 'Medium', color: '#C2893E' },
  hard: { label: 'Hard', color: '#C36B53' },
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function MapMode() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const completeProblem = useProgressStore(s => s.completeProblem)

  const mapDefinitions = useMemo(() => getMapDefinitions(cid), [cid])
  const baseIdentify = useMemo(() => getMapIdentifyActivities(cid), [cid])
  const baseLabel = useMemo(() => getMapLabelActivities(cid), [cid])
  const SECTION_COLORS = CHAPTER_SECTION_COLORS[cid] || CHAPTER_SECTION_COLORS.ch1
  const hasIdentify = baseIdentify.length > 0
  const hasLabel = baseLabel.length > 0

  const [phase, setPhase] = useState<MapPhase>('home')
  const [identifyActivities, setIdentifyActivities] = useState(baseIdentify)
  const [labelActivities, setLabelActivities] = useState(baseLabel)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionResults, setQuestionResults] = useState<('correct' | 'wrong' | 'unanswered')[]>([])
  const [totalMistakes, setTotalMistakes] = useState(0)
  const [activeType, setActiveType] = useState<'identify' | 'label'>('identify')

  const currentActivities = activeType === 'identify' ? identifyActivities : labelActivities

  const handleStartPractice = useCallback((type: 'identify' | 'label') => {
    setActiveType(type)
    if (type === 'identify') {
      const shuffled = shuffle(baseIdentify)
      setIdentifyActivities(shuffled)
      setQuestionResults(shuffled.map(() => 'unanswered'))
    } else {
      const shuffled = shuffle(baseLabel)
      setLabelActivities(shuffled)
      setQuestionResults(shuffled.map(() => 'unanswered'))
    }
    setCurrentIndex(0)
    setTotalMistakes(0)
    setPhase(type === 'identify' ? 'playing-identify' : 'playing-label')
  }, [baseIdentify, baseLabel])

  const handleAnswer = useCallback((correct: boolean, _hintsUsed: number) => {
    const newResults = [...questionResults]
    newResults[currentIndex] = correct ? 'correct' : 'wrong'
    setQuestionResults(newResults)
    if (!correct) setTotalMistakes(m => m + 1)

    const total = activeType === 'identify' ? identifyActivities.length : labelActivities.length

    if (currentIndex < total - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 300)
    } else {
      const mistakes = newResults.filter(r => r === 'wrong').length
      const stars = calculateStars(mistakes, 0)
      // Save progress for primary section of the activities
      const primarySection = (activeType === 'identify' ? identifyActivities : labelActivities)[0]?.sectionId || 's1'
      completeProblem(cid, primarySection, stars)
      const correctCount = newResults.filter(r => r === 'correct').length
      logActivity({
        chapter_id: cid,
        mode: 'maps',
        section_id: primarySection,
        activity_type: activeType === 'identify' ? 'map-identify' : 'map-label',
        stars_earned: stars,
        score_percent: Math.round((correctCount / newResults.length) * 100),
        total_questions: newResults.length,
        correct_answers: correctCount,
      })
      setTimeout(() => setPhase('results'), 300)
    }
  }, [questionResults, currentIndex, activeType, identifyActivities, labelActivities, completeProblem, cid])

  const correctCount = useMemo(() => questionResults.filter(r => r === 'correct').length, [questionResults])
  const stars = useMemo(() => calculateStars(totalMistakes, 0), [totalMistakes])
  const xp = useMemo(() => calculateXP(stars, 'medium'), [stars])

  // === EXPLORE MODE ===
  if (phase === 'explore') {
    return <MapExplorer onBack={() => setPhase('home')} chapterId={cid} />
  }

  // === PLAYING IDENTIFY ===
  if (phase === 'playing-identify') {
    const activity = identifyActivities[currentIndex] as MapIdentifyActivity
    const color = SECTION_COLORS[activity.sectionId] || '#5571B5'

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Maps
        </motion.button>

        <QuizProgress
          current={currentIndex}
          total={identifyActivities.length}
          results={questionResults}
          sectionColor={color}
        />

        <AnimatePresence mode="wait">
          <motion.div key={activity.id}>
            <MapIdentifyCard
              chapterId={cid}
              activity={activity}
              sectionColor={color}
              questionNumber={currentIndex + 1}
              totalQuestions={identifyActivities.length}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // === PLAYING LABEL ===
  if (phase === 'playing-label') {
    const activity = labelActivities[currentIndex] as MapLabelActivity
    const color = SECTION_COLORS[activity.sectionId] || '#5571B5'

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Maps
        </motion.button>

        <QuizProgress
          current={currentIndex}
          total={labelActivities.length}
          results={questionResults}
          sectionColor={color}
        />

        <AnimatePresence mode="wait">
          <motion.div key={activity.id}>
            <MapLabelCard
              chapterId={cid}
              activity={activity}
              sectionColor={color}
              questionNumber={currentIndex + 1}
              totalQuestions={labelActivities.length}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // === RESULTS PHASE ===
  if (phase === 'results') {
    const typeLabel = activeType === 'identify' ? 'map-identify' : 'map-label'
    return (
      <QuizResults
        sectionColor="#5571B5"
        activityType={typeLabel}
        correct={correctCount}
        total={currentActivities.length}
        stars={stars}
        xpEarned={xp}
        onRetry={() => handleStartPractice(activeType)}
        onBackToSection={() => setPhase('home')}
      />
    )
  }

  // === HOME PHASE ===
  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-hist-dark">Maps</h1>
        <p className="font-body text-sm text-gray-400">{mapDefinitions.length} {mapDefinitions.length === 1 ? 'map' : 'historical maps'} with {baseIdentify.length + baseLabel.length} activities</p>
      </motion.div>

      {/* Three mode cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Explore card */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase('explore')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-teal/10 flex items-center justify-center text-3xl shrink-0">
              🔍
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Explore Maps</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Browse <strong>{mapDefinitions.length} {mapDefinitions.length === 1 ? 'interactive map' : 'historical maps'}</strong>. Tap each marked place to learn why it matters.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {mapDefinitions.map(m => (
                  <span key={m.id} className="w-5 h-2 rounded-full" style={{ backgroundColor: m.sectionColor }} />
                ))}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Identify practice card */}
        {hasIdentify && (
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStartPractice('identify')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-gold/10 flex items-center justify-center text-3xl shrink-0">
              📍
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Practice: Identify Regions</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Read the description and tap the correct region on the map. <strong>{baseIdentify.length} questions</strong> across all maps.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {baseIdentify.map(a => {
                  const d = DIFFICULTY_LABELS[a.difficulty]
                  return (
                    <span
                      key={a.id}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: d.color }}
                    >
                      {d.label}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.button>
        )}

        {/* Label practice card */}
        {hasLabel && (
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStartPractice('label')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-purple/10 flex items-center justify-center text-3xl shrink-0">
              🏷️
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Practice: Label Maps</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Match each name to its marker on the map. <strong>{baseLabel.length} activities</strong> covering the key places.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {baseLabel.map(a => {
                  const d = DIFFICULTY_LABELS[a.difficulty]
                  return (
                    <span
                      key={a.id}
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: d.color }}
                    >
                      {d.label}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </motion.button>
        )}
      </div>

      {/* All activities list */}
      {(hasIdentify || hasLabel) && (
      <div>
        <h3 className="font-display font-bold text-sm text-gray-500 mb-3 uppercase tracking-wide">All Map Activities</h3>
        <div className="space-y-2">
          {[...baseIdentify, ...baseLabel].map((activity, i) => {
            const color = SECTION_COLORS[activity.sectionId] || '#5571B5'
            const diff = DIFFICULTY_LABELS[activity.difficulty]
            const isLabel = activity.type === 'map-label'

            return (
              <motion.div
                key={activity.id}
                className="bg-white rounded-xl p-4 shadow-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.04 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {isLabel ? '🏷️' : '📍'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-hist-dark leading-snug">
                      {isLabel ? (activity as MapLabelActivity).instruction : (activity as MapIdentifyActivity).question}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: diff.color }}>
                        {diff.label}
                      </span>
                      <span className="text-[10px] font-body text-gray-400">
                        {isLabel ? 'Label' : 'Identify'}
                      </span>
                      {activity.examRelevance === 'high' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-hist-gold/15 text-hist-gold">
                          EXAM
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
      )}
    </div>
  )
}
