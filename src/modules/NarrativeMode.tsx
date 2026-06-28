import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Subsection } from '../types/chapter'
import { NarrativeCard } from '../components/narrative/NarrativeCard'
import { InlineQuizCard } from '../components/narrative/InlineQuizCard'
import { SubsectionComplete } from '../components/narrative/SubsectionComplete'
import { useSwipe } from '../hooks/useSwipe'
import { useSound } from '../hooks/useSound'
import { useProgressStore } from '../store/useProgressStore'
import { useParams } from 'react-router-dom'
import { logActivity } from '../lib/activityLog'

interface NarrativeModeProps {
  subsection: Subsection
  sectionColor: string
  subsectionIndex: number
  totalSubsections: number
  onComplete: () => void
  onNextSubsection: () => void
  onBackToSection: () => void
}

export function NarrativeMode({
  subsection,
  sectionColor,
  subsectionIndex,
  totalSubsections,
  onComplete,
  onNextSubsection,
  onBackToSection,
}: NarrativeModeProps) {
  const { chapterId } = useParams<{ chapterId: string }>()
  const cards = subsection.narrativeCards
  const [cardIndex, setCardIndex] = useState(0)
  const [direction, setDirection] = useState(1)
  const [quizAnswered, setQuizAnswered] = useState<Record<string, boolean>>({})
  const [quizzesCorrect, setQuizzesCorrect] = useState(0)
  const [showComplete, setShowComplete] = useState(false)
  const { playPageTurn, playClick } = useSound()
  const completeSubsection = useProgressStore((s) => s.completeSubsection)

  const currentCard = cards[cardIndex]
  const isLastCard = cardIndex === cards.length - 1
  const hasQuiz = !!currentCard?.inlineQuiz
  const quizBlocking = hasQuiz && !quizAnswered[currentCard.id]

  const totalQuizzes = cards.filter((c) => c.inlineQuiz).length

  const goNext = useCallback(() => {
    if (quizBlocking) return
    if (isLastCard) {
      completeSubsection(subsection.id)
      logActivity({
        mode: 'narrative',
        chapter_id: chapterId || 'ch1',
        section_id: subsection.id.split('-')[0],
        activity_type: 'subsection-read',
        total_questions: totalQuizzes,
        correct_answers: quizzesCorrect,
      })
      setShowComplete(true)
      onComplete()
      return
    }
    setDirection(1)
    setCardIndex((i) => Math.min(i + 1, cards.length - 1))
    playPageTurn()
  }, [quizBlocking, isLastCard, cards.length, playPageTurn, completeSubsection, subsection.id, onComplete])

  const goPrev = useCallback(() => {
    if (cardIndex === 0) return
    setDirection(-1)
    setCardIndex((i) => Math.max(i - 1, 0))
    playPageTurn()
  }, [cardIndex, playPageTurn])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (showComplete) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev, showComplete])

  // Swipe navigation
  const swipeHandlers = useSwipe({
    onSwipeLeft: goNext,
    onSwipeRight: goPrev,
  })

  const handleQuizAnswered = (correct: boolean) => {
    setQuizAnswered((prev) => ({ ...prev, [currentCard.id]: true }))
    if (correct) setQuizzesCorrect((c) => c + 1)
  }

  const handleContinueToNext = () => {
    playClick()
    onNextSubsection()
  }

  if (showComplete) {
    return (
      <SubsectionComplete
        subsectionTitle={subsection.title}
        totalCards={cards.length}
        quizzesCorrect={quizzesCorrect}
        totalQuizzes={totalQuizzes}
        sectionColor={sectionColor}
        isLastSubsection={subsectionIndex >= totalSubsections - 1}
        onContinue={handleContinueToNext}
        onBackToSection={onBackToSection}
      />
    )
  }


  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  }

  return (
    <div className="max-w-2xl mx-auto pb-4" {...swipeHandlers}>
      {/* ── Header: Title + Progress ── */}
      <div className="mb-5">
        {/* Back to section link */}
        <button
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-hist-dark font-body mb-2 transition-colors"
          onClick={onBackToSection}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to overview
        </button>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-bold text-xs shrink-0"
              style={{ backgroundColor: sectionColor }}
            >
              {subsectionIndex + 1}
            </div>
            <h3 className="font-display font-bold text-hist-dark text-base sm:text-lg leading-tight truncate">
              {subsection.title}
            </h3>
          </div>
        </div>

        {/* Segmented progress bar */}
        <div className="flex gap-1">
          {cards.map((_, i) => (
            <div
              key={i}
              className="h-1 flex-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: i <= cardIndex ? sectionColor : '#E5E7EB',
                opacity: i === cardIndex ? 1 : i < cardIndex ? 0.6 : 0.3,
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400 font-body">
            {cards[cardIndex]?.type === 'vocabulary' ? '📖 Vocabulary'
              : cards[cardIndex]?.type === 'source' ? '📜 Source'
              : cards[cardIndex]?.type === 'figure' ? '🖼️ Figure'
              : cards[cardIndex]?.type === 'timeline-ref' ? '📅 Timeline'
              : cards[cardIndex]?.type === 'map-ref' ? '🗺️ Map'
              : cards[cardIndex]?.inlineQuiz ? '🧠 Quiz'
              : '📄 Reading'}
          </span>
          <span className="text-xs font-body font-semibold" style={{ color: sectionColor }}>
            {cardIndex + 1} of {cards.length}
          </span>
        </div>
      </div>

      {/* ── Card Area ── */}
      <div className="relative min-h-[280px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentCard.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {hasQuiz ? (
              currentCard.type === 'text' ? (
                // Text card + quiz: the quiz card renders the context text itself.
                <InlineQuizCard
                  quiz={currentCard.inlineQuiz!}
                  cardText={currentCard.text}
                  sectionColor={sectionColor}
                  onAnswered={handleQuizAnswered}
                />
              ) : (
                // Rich card (flowchart/table/figure/…) + quiz: show the full card body
                // (steps/table/image/highlight) AND the quiz beneath it. Previously the quiz
                // replaced the body entirely, hiding the tappable steps/table.
                <div className="space-y-4">
                  <NarrativeCard card={currentCard} sectionColor={sectionColor} />
                  <InlineQuizCard
                    quiz={currentCard.inlineQuiz!}
                    cardText=""
                    sectionColor={sectionColor}
                    onAnswered={handleQuizAnswered}
                  />
                </div>
              )
            ) : (
              <NarrativeCard card={currentCard} sectionColor={sectionColor} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between mt-6 gap-4">
        <motion.button
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-display text-sm font-bold transition-all ${
            cardIndex === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-hist-dark bg-white shadow-card hover:shadow-card-hover active:scale-[0.97]'
          }`}
          onClick={goPrev}
          disabled={cardIndex === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </motion.button>

        <motion.button
          className={`flex items-center gap-2 px-7 py-3 rounded-xl font-display text-sm font-bold text-white shadow-button btn-press transition-all ${
            quizBlocking ? 'opacity-40 cursor-not-allowed' : ''
          }`}
          style={{ backgroundColor: quizBlocking ? '#9CA3AF' : sectionColor }}
          whileHover={!quizBlocking ? { scale: 1.02 } : {}}
          whileTap={!quizBlocking ? { scale: 0.97 } : {}}
          onClick={goNext}
          disabled={quizBlocking}
        >
          {isLastCard ? (
            <>
              Complete
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </>
          ) : (
            <>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </>
          )}
        </motion.button>
      </div>

      {/* Quiz blocking hint */}
      <AnimatePresence>
        {quizBlocking && (
          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span className="text-sm text-gray-400 font-body bg-gray-50 px-4 py-1.5 rounded-full inline-flex items-center gap-2">
              <span className="text-base">👆</span>
              Answer the quiz above to continue
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keyboard hint - desktop only */}
      <p className="text-center text-xs text-gray-300 mt-4 hidden sm:block font-body">
        Use arrow keys or swipe to navigate
      </p>
    </div>
  )
}
