import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SourceReader, SourceQuizCard } from '../components/source'
import { QuizProgress } from '../components/quiz'
import { QuizResults } from '../components/quiz/QuizResults'
import { getSources, getNcertQuestions, getSourceAnalysisActivities, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { calculateStars, calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'
import type { NCERTQuestion } from '../types/chapter'

type ExamPhase = 'home' | 'source-read' | 'source-practice' | 'ncert' | 'results'

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function ExamPractice() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const completeProblem = useProgressStore(s => s.completeProblem)

  const sources = useMemo(() => getSources(cid), [cid])
  const ncertQuestions = useMemo(() => getNcertQuestions(cid), [cid])
  const SECTION_COLORS = CHAPTER_SECTION_COLORS[cid] || CHAPTER_SECTION_COLORS.ch1
  const sourceAnalysisActivities = useMemo(() => getSourceAnalysisActivities(cid), [cid])
  const hasSourcePractice = sourceAnalysisActivities.length > 0
  const hasSources = sources.length > 0

  const [phase, setPhase] = useState<ExamPhase>('home')
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null)
  const [activities, setActivities] = useState(sourceAnalysisActivities)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionResults, setQuestionResults] = useState<('correct' | 'wrong' | 'unanswered')[]>([])
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // NCERT questions state
  const [ncertFilter, setNcertFilter] = useState<'all' | 'write-in-brief' | 'discuss'>('all')
  const [expandedQ, setExpandedQ] = useState<string | null>(null)

  const selectedSource = useMemo(
    () => sources.find(s => s.id === selectedSourceId),
    [selectedSourceId, sources]
  )

  const totalSubQuestions = useMemo(
    () => sourceAnalysisActivities.reduce((sum, a) => sum + a.questions.length, 0),
    [sourceAnalysisActivities]
  )

  const filteredNcert = useMemo(() => {
    if (ncertFilter === 'all') return ncertQuestions
    return ncertQuestions.filter(q => q.type === ncertFilter)
  }, [ncertFilter, ncertQuestions])

  const handleStartSourcePractice = useCallback(() => {
    const shuffled = shuffle(sourceAnalysisActivities)
    setActivities(shuffled)
    setCurrentIndex(0)
    setQuestionResults(shuffled.map(() => 'unanswered'))
    setTotalCorrect(0)
    setTotalQuestions(0)
    setPhase('source-practice')
  }, [sourceAnalysisActivities])

  const handleActivityComplete = useCallback((correct: number, total: number) => {
    const newResults = [...questionResults]
    newResults[currentIndex] = correct === total ? 'correct' : 'wrong'
    setQuestionResults(newResults)
    setTotalCorrect(c => c + correct)
    setTotalQuestions(t => t + total)

    if (currentIndex < activities.length - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 300)
    } else {
      const finalCorrect = totalCorrect + correct
      const finalTotal = totalQuestions + total
      const mistakes = finalTotal - finalCorrect
      const stars = calculateStars(mistakes, 0)
      const primarySection = activities[0]?.sectionId || 's1'
      completeProblem(cid, primarySection, stars)
      logActivity({
        chapter_id: cid,
        mode: 'exam',
        section_id: primarySection,
        activity_type: 'source-comprehension',
        stars_earned: stars,
        score_percent: Math.round((finalCorrect / finalTotal) * 100),
        total_questions: finalTotal,
        correct_answers: finalCorrect,
      })
      setTimeout(() => setPhase('results'), 300)
    }
  }, [questionResults, currentIndex, activities, totalCorrect, totalQuestions, completeProblem, cid])

  const finalMistakes = totalQuestions - totalCorrect
  const stars = useMemo(() => calculateStars(finalMistakes, 0), [finalMistakes])
  const xp = useMemo(() => calculateXP(stars, 'hard'), [stars])

  // === SOURCE READ ===
  if (phase === 'source-read' && selectedSource) {
    return (
      <SourceReader
        source={selectedSource}
        onBack={() => setPhase('home')}
      />
    )
  }

  // === SOURCE PRACTICE ===
  if (phase === 'source-practice') {
    const activity = activities[currentIndex]
    const source = sources.find(s => s.id === activity.sourceId)
    const color = SECTION_COLORS[activity.sectionId] || '#5571B5'

    if (!source) return null

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Exam Prep
        </motion.button>

        <QuizProgress
          current={currentIndex}
          total={activities.length}
          results={questionResults}
          sectionColor={color}
        />

        <AnimatePresence mode="wait">
          <motion.div key={activity.id}>
            <SourceQuizCard
              activity={activity}
              source={source}
              sectionColor={color}
              questionNumber={currentIndex + 1}
              totalQuestions={activities.length}
              onComplete={handleActivityComplete}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // === NCERT QUESTIONS ===
  if (phase === 'ncert') {
    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Exam Prep
        </motion.button>

        <motion.div
          className="mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="font-display text-xl font-bold text-hist-dark mb-1">NCERT Exercise Questions</h2>
          <p className="font-body text-sm text-gray-500">
            Practice answering the exact questions from the textbook
          </p>
        </motion.div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-5">
          {[
            { key: 'all' as const, label: 'All', count: ncertQuestions.length },
            { key: 'write-in-brief' as const, label: 'Write in Brief', count: ncertQuestions.filter(q => q.type === 'write-in-brief').length },
            { key: 'discuss' as const, label: 'Discuss', count: ncertQuestions.filter(q => q.type === 'discuss').length },
          ].map(f => (
            <button
              key={f.key}
              className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                ncertFilter === f.key ? 'bg-hist-red text-white' : 'bg-gray-100 text-gray-500'
              }`}
              onClick={() => setNcertFilter(f.key)}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Questions */}
        <div className="space-y-4">
          {filteredNcert.map((q, i) => (
            <NCERTQuestionCard
              key={q.id}
              question={q}
              index={i}
              expanded={expandedQ === q.id}
              onToggle={() => setExpandedQ(expandedQ === q.id ? null : q.id)}
            />
          ))}
        </div>
      </div>
    )
  }

  // === RESULTS ===
  if (phase === 'results') {
    return (
      <QuizResults
        sectionColor="#C36B53"
        activityType="source-comprehension"
        correct={totalCorrect}
        total={totalQuestions}
        stars={stars}
        xpEarned={xp}
        onRetry={handleStartSourcePractice}
        onBackToSection={() => setPhase('home')}
      />
    )
  }

  // === HOME ===
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-hist-red">
            <span className="text-white text-2xl">📝</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-hist-dark">Exam Prep</h1>
            <p className="font-body text-sm text-gray-400">
              Source analysis, NCERT questions & model answers
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Read Sources */}
        {hasSources && (
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center text-3xl shrink-0">
              📜
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Read Primary Sources</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Study the <strong>{sources.length} source extracts</strong> from the NCERT textbook with detailed analysis.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            {sources.map(source => {
              const color = SECTION_COLORS[source.sectionId] || '#5571B5'
              return (
                <motion.button
                  key={source.id}
                  className="w-full bg-amber-50/50 rounded-xl p-3 text-left hover:bg-amber-50 transition-colors"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { setSelectedSourceId(source.id); setPhase('source-read') }}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white shrink-0"
                      style={{ backgroundColor: color }}
                    >
                      S{source.sectionId.replace('s', '')}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-sm text-hist-dark truncate">
                        {source.label}: {source.title}
                      </p>
                      <p className="font-body text-xs text-gray-400">
                        {source.author}{source.year ? ` (${source.year})` : ''}
                      </p>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>
        )}

        {/* Source Comprehension Practice */}
        {hasSourcePractice && (
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleStartSourcePractice}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-red/10 flex items-center justify-center text-3xl shrink-0">
              🎯
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Source Comprehension Quiz</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Answer <strong>{totalSubQuestions} questions</strong> on {sourceAnalysisActivities.length} sources — MCQ and descriptive, just like the board exam.
              </p>
              <span className="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200">
                High Exam Relevance
              </span>
            </div>
          </div>
        </motion.button>
        )}

        {/* NCERT Exercise Questions */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase('ncert')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-gold/10 flex items-center justify-center text-3xl shrink-0">
              📖
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">NCERT Exercise Questions</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                <strong>{ncertQuestions.length} questions</strong> from the textbook with key points and model answers.
                Practice writing full answers.
              </p>
              <div className="flex gap-2 mt-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-500">
                  {ncertQuestions.filter(q => q.type === 'write-in-brief').length} Write in Brief
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-500">
                  {ncertQuestions.filter(q => q.type === 'discuss').length} Discuss
                </span>
              </div>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  )
}

// === NCERT Question Card (sub-component) ===

function NCERTQuestionCard({
  question,
  index,
  expanded,
  onToggle,
}: {
  question: NCERTQuestion
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  const [showAnswer, setShowAnswer] = useState(false)

  // Reset answer visibility when collapsed
  const [prevExpanded, setPrevExpanded] = useState(expanded)
  if (expanded !== prevExpanded) {
    setPrevExpanded(expanded)
    if (!expanded) setShowAnswer(false)
  }

  const typeColor = question.type === 'write-in-brief' ? '#5571B5' : '#9B5C9A'
  const typeLabel = question.type === 'write-in-brief' ? 'Write in Brief' : 'Discuss'

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-card overflow-hidden"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div className="h-1" style={{ backgroundColor: typeColor }} />

      <button
        className="w-full text-left p-5"
        onClick={onToggle}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: typeColor }}
          >
            {question.number}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: typeColor }}>
                {typeLabel}
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-hist-gold/15 text-hist-gold">
                {question.marks} marks
              </span>
            </div>
            <p className="font-body text-sm font-semibold text-hist-dark leading-snug">
              {question.question}
            </p>
            {question.subParts && !expanded && (
              <p className="font-body text-xs text-gray-400 mt-1">
                {question.subParts.length} sub-parts
              </p>
            )}
          </div>
          <motion.span
            className="text-gray-400 shrink-0 mt-1"
            animate={{ rotate: expanded ? 180 : 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
          </motion.span>
        </div>
      </button>

      {expanded && (
        <motion.div
          className="px-5 pb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Sub-parts */}
          {question.subParts && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-display font-bold text-xs text-gray-500 mb-2 uppercase">Sub-parts</p>
              <div className="space-y-1.5">
                {question.subParts.map((part, i) => (
                  <p key={i} className="font-body text-sm text-hist-dark/80">{part}</p>
                ))}
              </div>
            </div>
          )}

          {/* Key Points */}
          <div className="bg-blue-50 rounded-xl p-4 mb-4">
            <p className="font-display font-bold text-xs text-blue-700 mb-2">Key Points to Include</p>
            <div className="space-y-1.5">
              {question.keyPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="shrink-0 w-4 h-4 rounded-full bg-blue-200 text-blue-700 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="font-body text-xs text-blue-800 leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reveal model answer */}
          {!showAnswer ? (
            <motion.button
              className="w-full text-center font-display font-bold text-sm px-6 py-3 rounded-full text-white shadow-button btn-press"
              style={{ backgroundColor: typeColor }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={(e) => { e.stopPropagation(); setShowAnswer(true) }}
            >
              Try writing your answer first, then Reveal Model Answer
            </motion.button>
          ) : (
            <motion.div
              className="rounded-xl p-5"
              style={{ backgroundColor: '#ECFDF5', border: '2px solid #A7F3D0' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-display font-bold text-sm text-green-700 mb-3">Model Answer</p>
              <p className="font-body text-sm text-green-800 leading-relaxed whitespace-pre-line">
                {question.sampleAnswer}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
