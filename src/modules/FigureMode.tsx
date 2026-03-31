import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FigureGallery, FigureDetail, ImageAnalysisCard } from '../components/figure'
import { QuizProgress } from '../components/quiz'
import { QuizResults } from '../components/quiz/QuizResults'
import { figures } from '../data/figures'
import { imageAnalysisActivities } from '../data/activities/imageAnalysis'
import { calculateStars, calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'
import type { SectionId } from '../types/progress'

type FigurePhase = 'home' | 'gallery' | 'detail' | 'practice' | 'results'

const SECTION_COLORS: Record<string, string> = {
  s1: '#C0392B', s2: '#2980B9', s3: '#E67E22',
  s4: '#27AE60', s5: '#7D3C98', s6: '#16A085',
}

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function FigureMode() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const completeProblem = useProgressStore(s => s.completeProblem)

  const [phase, setPhase] = useState<FigurePhase>('home')
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null)
  const [activities, setActivities] = useState(imageAnalysisActivities)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [questionResults, setQuestionResults] = useState<('correct' | 'wrong' | 'unanswered')[]>([])
  const [totalCorrect, setTotalCorrect] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)

  // Figure detail navigation
  const selectedFigure = useMemo(() => figures.find(f => f.id === selectedFigureId), [selectedFigureId])
  const selectedFigureIndex = useMemo(() => figures.findIndex(f => f.id === selectedFigureId), [selectedFigureId])

  const handleSelectFigure = useCallback((figureId: string) => {
    setSelectedFigureId(figureId)
    setPhase('detail')
  }, [])

  const handlePrevFigure = useCallback(() => {
    if (selectedFigureIndex > 0) {
      setSelectedFigureId(figures[selectedFigureIndex - 1].id)
    }
  }, [selectedFigureIndex])

  const handleNextFigure = useCallback(() => {
    if (selectedFigureIndex < figures.length - 1) {
      setSelectedFigureId(figures[selectedFigureIndex + 1].id)
    }
  }, [selectedFigureIndex])

  const handleStartPractice = useCallback(() => {
    const shuffled = shuffle(imageAnalysisActivities)
    setActivities(shuffled)
    setCurrentIndex(0)
    setQuestionResults(shuffled.map(() => 'unanswered'))
    setTotalCorrect(0)
    setTotalQuestions(0)
    setPhase('practice')
  }, [])

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
      completeProblem(primarySection as SectionId, stars)
      logActivity({
        chapter_id: chapterId || 'ch1',
        mode: 'figures',
        section_id: primarySection,
        activity_type: 'image-analysis',
        stars_earned: stars,
        score_percent: Math.round((finalCorrect / finalTotal) * 100),
        total_questions: finalTotal,
        correct_answers: finalCorrect,
      })
      setTimeout(() => setPhase('results'), 300)
    }
  }, [questionResults, currentIndex, activities, totalCorrect, totalQuestions, completeProblem])

  const finalMistakes = totalQuestions - totalCorrect
  const stars = useMemo(() => calculateStars(finalMistakes, 0), [finalMistakes])
  const xp = useMemo(() => calculateXP(stars, 'medium'), [stars])

  // Count exam-important figures
  const examImportantCount = useMemo(() => figures.filter(f => f.examRelevance === 'high').length, [])

  // Total sub-questions across all activities
  const totalSubQuestions = useMemo(
    () => imageAnalysisActivities.reduce((sum, a) => sum + a.questions.length, 0),
    []
  )

  // === GALLERY ===
  if (phase === 'gallery') {
    return <FigureGallery onSelectFigure={handleSelectFigure} onBack={() => setPhase('home')} />
  }

  // === DETAIL ===
  if (phase === 'detail' && selectedFigure) {
    const color = SECTION_COLORS[selectedFigure.sectionId] || '#2980B9'
    return (
      <FigureDetail
        figure={selectedFigure}
        sectionColor={color}
        onBack={() => setPhase('gallery')}
        onPrev={selectedFigureIndex > 0 ? handlePrevFigure : undefined}
        onNext={selectedFigureIndex < figures.length - 1 ? handleNextFigure : undefined}
        currentIndex={selectedFigureIndex}
        totalFigures={figures.length}
      />
    )
  }

  // === PRACTICE ===
  if (phase === 'practice') {
    const activity = activities[currentIndex]
    const figure = figures.find(f => f.id === activity.figureId)
    const color = SECTION_COLORS[activity.sectionId] || '#2980B9'

    if (!figure) return null

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Figures
        </motion.button>

        <QuizProgress
          current={currentIndex}
          total={activities.length}
          results={questionResults}
          sectionColor={color}
        />

        <AnimatePresence mode="wait">
          <motion.div key={activity.id}>
            <ImageAnalysisCard
              activity={activity}
              figure={figure}
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

  // === RESULTS ===
  if (phase === 'results') {
    return (
      <QuizResults
        sectionColor="#7D3C98"
        activityType="image-analysis"
        correct={totalCorrect}
        total={totalQuestions}
        stars={stars}
        xpEarned={xp}
        onRetry={handleStartPractice}
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
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-hist-purple">
            <span className="text-white text-2xl">🖼️</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-hist-dark">Figures</h1>
            <p className="font-body text-sm text-gray-400">
              {figures.length} NCERT figures with {totalSubQuestions} practice questions
            </p>
          </div>
        </div>
      </motion.div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Browse All Figures */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase('gallery')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-purple/10 flex items-center justify-center text-3xl shrink-0">
              🔍
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Browse All Figures</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Explore <strong>{figures.length} paintings, caricatures, maps & stamps</strong> from the NCERT textbook. Interactive hotspots reveal key details.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(SECTION_COLORS).map(([id, color]) => (
                  <span key={id} className="w-5 h-2 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Practice: Image Analysis */}
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
              📝
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Practice: Image Analysis</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Answer questions about <strong>{imageAnalysisActivities.length} figures</strong> ({totalSubQuestions} questions). MCQ + descriptive — just like CBSE board exams.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {imageAnalysisActivities.map(a => (
                  <span
                    key={a.id}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: '#E67E22' }}
                  >
                    Medium
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.button>

        {/* Exam-Important Figures */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPhase('gallery')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center text-3xl shrink-0">
              🎯
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Exam-Important Figures</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                <strong>{examImportantCount} figures</strong> frequently asked in CBSE board exams. Know their symbolism, artist, and historical context.
              </p>
              <span className="inline-block mt-3 text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200">
                High Exam Relevance
              </span>
            </div>
          </div>
        </motion.button>
      </div>

      {/* All figures list */}
      <div>
        <h3 className="font-display font-bold text-sm text-gray-500 mb-3 uppercase tracking-wide">All Figures</h3>
        <div className="space-y-2">
          {figures.map((figure, i) => {
            const color = SECTION_COLORS[figure.sectionId] || '#2980B9'
            const typeIcons: Record<string, string> = {
              painting: '🎨', caricature: '✏️', map: '🗺️',
              photograph: '📷', stamp: '📮', banner: '🏴',
              almanac: '📰', illustration: '🖌️',
            }
            const icon = typeIcons[figure.type] || '🖼️'

            return (
              <motion.button
                key={figure.id}
                className="w-full bg-white rounded-xl p-4 shadow-card text-left hover:shadow-card-hover transition-shadow"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.03 }}
                onClick={() => handleSelectFigure(figure.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-display font-bold text-sm text-hist-dark leading-snug line-clamp-1">
                      Fig {figure.number}: {figure.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      {figure.artist && (
                        <span className="text-[11px] font-body text-gray-400 italic">{figure.artist}</span>
                      )}
                      {figure.examRelevance === 'high' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-hist-gold/15 text-hist-gold">
                          EXAM
                        </span>
                      )}
                      <span className="text-[10px] font-body text-gray-300">
                        {figure.hotspots.length} hotspots
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
