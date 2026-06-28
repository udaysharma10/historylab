import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { TimelineExplorer, TimelineOrderCard } from '../components/timeline'
import { QuizProgress } from '../components/quiz'
import { QuizResults } from '../components/quiz/QuizResults'
import { timelineActivities } from '../data/activities/timelineActivities'
import { calculateStars } from '../engine/quizEngine'
import { calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'
import type { SectionId } from '../types/progress'

type TimelinePhase = 'home' | 'explore' | 'pick-activity' | 'playing' | 'results'

const SECTION_COLORS: Record<string, string> = {
  s1: '#C0392B', s2: '#2980B9', s3: '#D9821F',
  s4: '#1F9E57', s5: '#7D3C98', s6: '#16A085',
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: 'Easy', color: '#1F9E57' },
  medium: { label: 'Medium', color: '#D9821F' },
  hard: { label: 'Hard', color: '#C0392B' },
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function TimelineMode() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const completeProblem = useProgressStore(s => s.completeProblem)

  const [phase, setPhase] = useState<TimelinePhase>('home')
  const [activities, setActivities] = useState(timelineActivities)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionResults, setQuestionResults] = useState<('correct' | 'wrong' | 'unanswered')[]>([])
  const [totalMistakes, setTotalMistakes] = useState(0)

  const handleStartPractice = useCallback(() => {
    const shuffled = shuffle(timelineActivities)
    setActivities(shuffled)
    setCurrentIndex(0)
    setQuestionResults(shuffled.map(() => 'unanswered'))
    setTotalMistakes(0)
    setPhase('playing')
  }, [])

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
      completeProblem('s1' as SectionId, stars)
      const correctCount = newResults.filter(r => r === 'correct').length
      logActivity({
        chapter_id: chapterId || 'ch1',
        mode: 'timeline',
        activity_type: 'timeline-order',
        stars_earned: stars,
        score_percent: Math.round((correctCount / newResults.length) * 100),
        total_questions: newResults.length,
        correct_answers: correctCount,
      })
      setTimeout(() => setPhase('results'), 300)
    }
  }, [questionResults, currentIndex, activities.length, completeProblem])

  const correctCount = useMemo(() => questionResults.filter(r => r === 'correct').length, [questionResults])
  const stars = useMemo(() => calculateStars(totalMistakes, 0), [totalMistakes])
  const xp = useMemo(() => calculateXP(stars, 'medium'), [stars])

  // === EXPLORE MODE ===
  if (phase === 'explore') {
    return <TimelineExplorer onBack={() => setPhase('home')} />
  }

  // === PLAYING PHASE ===
  if (phase === 'playing') {
    const currentActivity = activities[currentIndex]
    const color = SECTION_COLORS[currentActivity.sectionId] || '#2980B9'

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Timeline
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
        sectionColor="#2980B9"
        activityType="timeline-order"
        correct={correctCount}
        total={activities.length}
        stars={stars}
        xpEarned={xp}
        onRetry={handleStartPractice}
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
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => navigate('/')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Home
        </motion.button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-hist-blue">
            <span className="text-white text-2xl">📅</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-hist-dark">Timeline</h1>
            <p className="font-body text-sm text-gray-400">1688 – 1905: Key events of European nationalism</p>
          </div>
        </div>
      </motion.div>

      {/* Two mode cards */}
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
            <div className="w-14 h-14 rounded-xl bg-hist-blue/10 flex items-center justify-center text-3xl shrink-0">
              🔍
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Explore Timeline</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Browse all <strong>34 key events</strong> from 1688 to 1905 on an interactive timeline. Filter by section and learn the details.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(SECTION_COLORS).map(([id, color]) => (
                  <span key={id} className="w-5 h-2 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Practice card */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartPractice}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-gold/10 flex items-center justify-center text-3xl shrink-0">
              🧩
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Practice: Order Events</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Arrange events in chronological order. <strong>7 activities</strong> covering French Revolution, unification of Germany & Italy, and more.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {timelineActivities.map(a => {
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
      </div>

      {/* Activity preview list */}
      <div>
        <h3 className="font-display font-bold text-sm text-gray-500 mb-3 uppercase tracking-wide">All Timeline Activities</h3>
        <div className="space-y-2">
          {timelineActivities.map((activity, i) => {
            const color = SECTION_COLORS[activity.sectionId] || '#2980B9'
            const diff = DIFFICULTY_LABELS[activity.difficulty]

            return (
              <motion.div
                key={activity.id}
                className="bg-white rounded-xl p-4 shadow-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {activity.events.length}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-hist-dark leading-snug">{activity.instruction}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: diff.color }}>
                        {diff.label}
                      </span>
                      <span className="text-[10px] font-body text-gray-400">
                        {activity.events.length} events
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
    </div>
  )
}
