import { useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FigureGallery, FigureDetail, ImageAnalysisCard } from '../components/figure'
import { QuizProgress } from '../components/quiz'
import { QuizResults } from '../components/quiz/QuizResults'
import { getFigures, getImageAnalysisActivities, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { calculateStars, calculateXP } from '../engine/scoringEngine'
import { useProgressStore } from '../store/useProgressStore'
import { logActivity } from '../lib/activityLog'

// Neha 2026-07-27: no lobby — the gallery IS the page.
type FigurePhase = 'gallery' | 'detail' | 'practice' | 'results'

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function FigureMode() {
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const completeProblem = useProgressStore(s => s.completeProblem)

  const figures = useMemo(() => getFigures(cid), [cid])
  const SECTION_COLORS = CHAPTER_SECTION_COLORS[cid] || CHAPTER_SECTION_COLORS.ch1
  const figureActivities = useMemo(() => getImageAnalysisActivities(cid), [cid])

  const [phase, setPhase] = useState<FigurePhase>('gallery')
  const [selectedFigureId, setSelectedFigureId] = useState<string | null>(null)
  const [activities, setActivities] = useState(figureActivities)
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
    const shuffled = shuffle(figureActivities)
    setActivities(shuffled)
    setCurrentIndex(0)
    setQuestionResults(shuffled.map(() => 'unanswered'))
    setTotalCorrect(0)
    setTotalQuestions(0)
    setPhase('practice')
  }, [figureActivities])

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
  }, [questionResults, currentIndex, activities, totalCorrect, totalQuestions, completeProblem, cid])

  const finalMistakes = totalQuestions - totalCorrect
  const stars = useMemo(() => calculateStars(finalMistakes, 0), [finalMistakes])
  const xp = useMemo(() => calculateXP(stars, 'medium'), [stars])

  // Image-analysis practice is only available where activities exist (Ch1).
  const hasPractice = figureActivities.length > 0

  // === GALLERY ===
  if (phase === 'gallery') {
    return (
      <FigureGallery
        onSelectFigure={handleSelectFigure}
        chapterId={cid}
        onStartPractice={hasPractice ? handleStartPractice : undefined}
      />
    )
  }

  // === DETAIL ===
  if (phase === 'detail' && selectedFigure) {
    const color = SECTION_COLORS[selectedFigure.sectionId] || '#5571B5'
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
    const color = SECTION_COLORS[activity.sectionId] || '#5571B5'

    if (!figure) return null

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('gallery')}
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
        sectionColor="#9B5C9A"
        activityType="image-analysis"
        correct={totalCorrect}
        total={totalQuestions}
        stars={stars}
        xpEarned={xp}
        onRetry={handleStartPractice}
        onBackToSection={() => setPhase('gallery')}
      />
    )
  }

  // Unreachable fallback (gallery is the default phase).
  return null
}
