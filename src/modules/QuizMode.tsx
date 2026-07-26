import { useState, useMemo, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getChapter, getMcqActivities, getFillBlankActivities, getTrueFalseActivities, getMatchActivities, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { MCQCard, FillBlankCard, TrueFalseCard, MatchColumns, QuizProgress, QuizResults } from '../components/quiz'
import { calculateStars } from '../engine/quizEngine'
import { calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'
import type { MCQActivity, FillBlankActivity, TrueFalseActivity, MatchActivity } from '../types/activity'

type ActivityType = 'mcq' | 'fill-blank' | 'true-false' | 'match-following'
type QuizPhase = 'pick-type' | 'playing' | 'results'

const TYPE_CONFIG: { type: ActivityType; label: string; icon: string }[] = [
  { type: 'mcq', label: 'Multiple Choice', icon: '🔤' },
  { type: 'fill-blank', label: 'Fill in the Blank', icon: '✏️' },
  { type: 'true-false', label: 'True or False', icon: '⚖️' },
  { type: 'match-following', label: 'Match the Following', icon: '🔗' },
]

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function QuizMode() {
  const { sectionId, chapterId } = useParams<{ sectionId: string; chapterId: string }>()
  const navigate = useNavigate()
  const completeProblem = useProgressStore(s => s.completeProblem)

  const cid = chapterId || 'ch1'
  const chapter = getChapter(cid)
  const section = chapter?.sections.find(s => s.id === sectionId)
  const sectionColors = CHAPTER_SECTION_COLORS[cid] || {}
  const color = sectionColors[sectionId || ''] || '#3E3548'

  // Get chapter-specific activities
  const chMcq = useMemo(() => getMcqActivities(cid), [cid])
  const chFb = useMemo(() => getFillBlankActivities(cid), [cid])
  const chTf = useMemo(() => getTrueFalseActivities(cid), [cid])
  const chMatch = useMemo(() => getMatchActivities(cid), [cid])

  function getActivities(sid: string, type: ActivityType) {
    switch (type) {
      case 'mcq': return chMcq.filter(a => a.sectionId === sid)
      case 'fill-blank': return chFb.filter(a => a.sectionId === sid)
      case 'true-false': return chTf.filter(a => a.sectionId === sid)
      case 'match-following': return chMatch.filter(a => a.sectionId === sid)
    }
  }

  const [phase, setPhase] = useState<QuizPhase>('pick-type')
  const [activityType, setActivityType] = useState<ActivityType | null>(null)
  const [activities, setActivities] = useState<(MCQActivity | FillBlankActivity | TrueFalseActivity | MatchActivity)[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionResults, setQuestionResults] = useState<('correct' | 'wrong' | 'unanswered')[]>([])
  const [totalMistakes, setTotalMistakes] = useState(0)
  const [totalHints, setTotalHints] = useState(0)

  // Available counts per type for this section
  const counts = useMemo(() => ({
    mcq: chMcq.filter(a => a.sectionId === sectionId).length,
    'fill-blank': chFb.filter(a => a.sectionId === sectionId).length,
    'true-false': chTf.filter(a => a.sectionId === sectionId).length,
    'match-following': chMatch.filter(a => a.sectionId === sectionId).length,
  }), [sectionId, chMcq, chFb, chTf, chMatch])

  const handleSelectType = useCallback((type: ActivityType) => {
    const items = getActivities(sectionId || '', type) as (MCQActivity | FillBlankActivity | TrueFalseActivity | MatchActivity)[]
    setActivityType(type)
    setActivities(shuffle(items))
    setCurrentIndex(0)
    setQuestionResults(items.map(() => 'unanswered'))
    setTotalMistakes(0)
    setTotalHints(0)
    setPhase('playing')
  }, [sectionId])

  const handleAnswer = useCallback((correct: boolean, hintsUsed: number) => {
    const newResults = [...questionResults]
    newResults[currentIndex] = correct ? 'correct' : 'wrong'
    setQuestionResults(newResults)
    if (!correct) setTotalMistakes(m => m + 1)
    setTotalHints(h => h + hintsUsed)

    // Move to next or results
    if (currentIndex < activities.length - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 300)
    } else {
      // Quiz complete — save progress
      const mistakes = newResults.filter(r => r === 'wrong').length
      const stars = calculateStars(mistakes, hintsUsed)
      completeProblem(cid, sectionId ?? 's1', stars)
      const correctCount = newResults.filter(r => r === 'correct').length
      logActivity({
        mode: 'quiz',
        chapter_id: cid,
        section_id: sectionId,
        activity_type: activityType,
        stars_earned: stars,
        score_percent: Math.round((correctCount / newResults.length) * 100),
        total_questions: newResults.length,
        correct_answers: correctCount,
        hints_used: hintsUsed,
      })
      setTimeout(() => setPhase('results'), 300)
    }
  }, [questionResults, currentIndex, activities.length, completeProblem, sectionId, activityType, cid])

  const handleRetry = () => {
    if (activityType) handleSelectType(activityType)
  }

  const cidSafe = chapterId || 'ch1'
  const handleBackToSection = () => {
    navigate(`/chapter/${cidSafe}/section/${sectionId}`)
  }

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-xl font-bold text-hist-dark mb-2">Section Not Found</h2>
          <motion.button
            className="bg-hist-gold text-white font-display px-6 py-2.5 rounded-full shadow-button btn-press mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    )
  }

  // === PICK TYPE PHASE ===
  if (phase === 'pick-type') {
    return (
      <div className="max-w-lg mx-auto px-4 pt-5 pb-8">
        {/* Header */}
        <div className="mb-6">
          {/* Immersion exit — quiz is Altitude 3, one way out (decision #37) */}
          <button
            className="flex items-center gap-1.5 text-[12.5px] font-bold text-hist-muted hover:text-hist-dark transition-colors mb-3"
            onClick={handleBackToSection}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            Back to Section {section.number}
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color }}>
              <span className="text-white text-lg">🧠</span>
            </div>
            <div>
              <h1 className="font-display text-xl font-bold text-hist-dark">Practice Quiz</h1>
              <p className="font-body text-sm text-gray-400">Section {section.number}: {section.title}</p>
            </div>
          </div>
        </div>

        {/* Activity type cards */}
        <div className="grid grid-cols-2 gap-3">
          {TYPE_CONFIG.map((cfg, i) => {
            const count = counts[cfg.type]
            const disabled = count === 0

            return (
              <motion.button
                key={cfg.type}
                className={`bg-white rounded-2xl p-5 shadow-card text-center transition-all ${
                  disabled ? 'opacity-40 cursor-not-allowed' : 'hover:shadow-card-hover'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: disabled ? 0.4 : 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={!disabled ? { scale: 1.03 } : {}}
                whileTap={!disabled ? { scale: 0.97 } : {}}
                onClick={() => !disabled && handleSelectType(cfg.type)}
                disabled={disabled}
              >
                <div className="text-3xl mb-2">{cfg.icon}</div>
                <h3 className="font-display font-bold text-hist-dark text-sm mb-1">{cfg.label}</h3>
                <span className="font-body text-xs px-2.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>
                  {count} {count === 1 ? 'question' : 'questions'}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Total count */}
        <motion.p
          className="text-center font-body text-sm text-gray-400 mt-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {Object.values(counts).reduce((a, b) => a + b, 0)} total quiz questions for this section
        </motion.p>
      </div>
    )
  }

  // === PLAYING PHASE ===
  if (phase === 'playing' && activityType) {
    const currentActivity = activities[currentIndex]

    return (
      <div className="max-w-lg mx-auto px-4 pt-5 pb-8">
        {/* Back button */}
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('pick-type')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to quiz types
        </motion.button>

        {/* Progress dots */}
        <QuizProgress
          current={currentIndex}
          total={activities.length}
          results={questionResults}
          sectionColor={color}
        />

        {/* Current question card */}
        <AnimatePresence mode="wait">
          <motion.div key={currentActivity.id}>
            {activityType === 'mcq' && (
              <MCQCard
                activity={currentActivity as MCQActivity}
                sectionColor={color}
                questionNumber={currentIndex + 1}
                totalQuestions={activities.length}
                onAnswer={handleAnswer}
              />
            )}
            {activityType === 'fill-blank' && (
              <FillBlankCard
                activity={currentActivity as FillBlankActivity}
                sectionColor={color}
                questionNumber={currentIndex + 1}
                totalQuestions={activities.length}
                onAnswer={handleAnswer}
              />
            )}
            {activityType === 'true-false' && (
              <TrueFalseCard
                activity={currentActivity as TrueFalseActivity}
                sectionColor={color}
                questionNumber={currentIndex + 1}
                totalQuestions={activities.length}
                onAnswer={handleAnswer}
              />
            )}
            {activityType === 'match-following' && (
              <MatchColumns
                activity={currentActivity as MatchActivity}
                sectionColor={color}
                questionNumber={currentIndex + 1}
                totalQuestions={activities.length}
                onAnswer={handleAnswer}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // === RESULTS PHASE ===
  if (phase === 'results' && activityType) {
    const correctCount = questionResults.filter(r => r === 'correct').length
    const stars = calculateStars(totalMistakes, totalHints)
    const avgDifficulty = activities.length > 0
      ? (activities.filter(a => a.difficulty === 'hard').length > activities.length / 2 ? 'hard' : activities.filter(a => a.difficulty === 'easy').length > activities.length / 2 ? 'easy' : 'medium') as 'easy' | 'medium' | 'hard'
      : 'medium' as const
    const xp = calculateXP(stars, avgDifficulty)

    return (
      <QuizResults
        sectionColor={color}
        activityType={activityType}
        correct={correctCount}
        total={activities.length}
        stars={stars}
        xpEarned={xp}
        onRetry={handleRetry}
        onBackToSection={handleBackToSection}
      />
    )
  }

  return null
}
