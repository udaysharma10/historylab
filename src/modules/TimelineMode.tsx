import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TimelineExplorer, TimelineOrderCard } from '../components/timeline'
import { QuizProgress } from '../components/quiz'
import { QuizResults } from '../components/quiz/QuizResults'
import { getTimelineActivities, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { calculateStars } from '../engine/quizEngine'
import { calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'

// Neha 2026-07-27: the explorer IS the page — no lobby. Practice is reached
// from the section rails (?practice=<sectionId>), not from a mode card here.
type TimelinePhase = 'explore' | 'playing' | 'results'

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function TimelineMode() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const practiceSection = searchParams.get('practice')
  const autoStarted = useRef(false)
  const completeProblem = useProgressStore(s => s.completeProblem)

  const timelineActivities = useMemo(() => getTimelineActivities(cid), [cid])
  const SECTION_COLORS = CHAPTER_SECTION_COLORS[cid] || CHAPTER_SECTION_COLORS.ch1

  const [phase, setPhase] = useState<TimelinePhase>('explore')
  const [activities, setActivities] = useState(timelineActivities)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionResults, setQuestionResults] = useState<('correct' | 'wrong' | 'unanswered')[]>([])
  const [totalMistakes, setTotalMistakes] = useState(0)

  const handleStartPractice = useCallback((sectionId?: string) => {
    const pool = sectionId
      ? timelineActivities.filter(a => a.sectionId === sectionId)
      : timelineActivities
    if (pool.length === 0) return
    const shuffled = shuffle(pool)
    setActivities(shuffled)
    setCurrentIndex(0)
    setQuestionResults(shuffled.map(() => 'unanswered'))
    setTotalMistakes(0)
    setPhase('playing')
  }, [timelineActivities])

  // Section-rail deep link: /timeline?practice=s2 starts that section's
  // ordering activities directly. One-shot; flag set when the timer fires
  // so StrictMode's discarded first effect run doesn't burn it.
  useEffect(() => {
    if (autoStarted.current || !practiceSection) return
    if (!timelineActivities.some(a => a.sectionId === practiceSection)) return
    const t = setTimeout(() => {
      autoStarted.current = true
      handleStartPractice(practiceSection)
    }, 0)
    return () => clearTimeout(t)
  }, [practiceSection, timelineActivities, handleStartPractice])

  // Where "back/done" goes: rail-launched practice returns to its section.
  const exitPractice = useCallback(() => {
    if (practiceSection) {
      navigate(`/chapter/${cid}/section/${practiceSection}`)
    } else {
      setPhase('explore')
    }
  }, [practiceSection, navigate, cid])

  const handleAnswer = useCallback((correct: boolean, _hintsUsed: number) => {
    const newResults = [...questionResults]
    newResults[currentIndex] = correct ? 'correct' : 'wrong'
    setQuestionResults(newResults)
    if (!correct) setTotalMistakes(m => m + 1)

    if (currentIndex < activities.length - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 300)
    } else {
      // Complete — save progress for primary section
      const mistakes = newResults.filter(r => r === 'wrong').length
      const stars = calculateStars(mistakes, 0)
      // Credit the practised section (rail deep link) — falls back to the
      // first activity's section for chapter-wide runs.
      completeProblem(cid, practiceSection ?? activities[0]?.sectionId ?? 's1', stars)
      const correctCount = newResults.filter(r => r === 'correct').length
      logActivity({
        chapter_id: cid,
        mode: 'timeline',
        activity_type: 'timeline-order',
        stars_earned: stars,
        score_percent: Math.round((correctCount / newResults.length) * 100),
        total_questions: newResults.length,
        correct_answers: correctCount,
      })
      setTimeout(() => setPhase('results'), 300)
    }
  }, [questionResults, currentIndex, activities, completeProblem, cid, practiceSection])

  const correctCount = useMemo(() => questionResults.filter(r => r === 'correct').length, [questionResults])
  const stars = useMemo(() => calculateStars(totalMistakes, 0), [totalMistakes])
  const xp = useMemo(() => calculateXP(stars, 'medium'), [stars])

  // === PLAYING PHASE ===
  if (phase === 'playing') {
    const currentActivity = activities[currentIndex]
    const color = SECTION_COLORS[currentActivity.sectionId] || '#5571B5'

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={exitPractice}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Exit practice
        </motion.button>

        <QuizProgress
          current={currentIndex}
          total={activities.length}
          results={questionResults}
          sectionColor={color}
        />

        <AnimatePresence mode="wait">
          <motion.div key={currentActivity.id}>
            <TimelineOrderCard
              activity={currentActivity}
              sectionColor={color}
              questionNumber={currentIndex + 1}
              totalQuestions={activities.length}
              onAnswer={handleAnswer}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // === RESULTS PHASE ===
  if (phase === 'results') {
    return (
      <QuizResults
        sectionColor="#5571B5"
        activityType="timeline-order"
        correct={correctCount}
        total={activities.length}
        stars={stars}
        xpEarned={xp}
        onRetry={() => handleStartPractice(practiceSection ?? undefined)}
        onBackToSection={exitPractice}
      />
    )
  }

  // === EXPLORE — the page itself (Neha: no lobby) ===
  return <TimelineExplorer chapterId={cid} />
}
