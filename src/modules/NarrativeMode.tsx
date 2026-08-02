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
  sectionTitle?: string
  subsectionIndex: number
  totalSubsections: number
  onComplete: () => void
  onNextSubsection: () => void
  onBackToSection: () => void
}

export function NarrativeMode({
  subsection,
  sectionColor,
  sectionTitle,
  subsectionIndex,
  totalSubsections,
  onComplete,
  onNextSubsection,
  onBackToSection,
}: NarrativeModeProps) {
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
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

  // Browse-depth signal for the dashboard: an open is not a completion —
  // 'topic-opened' rows are excluded from activity/star counts there.
  useEffect(() => {
    logActivity({
      mode: 'narrative',
      chapter_id: cid,
      section_id: subsection.id.split('-')[0],
      activity_type: 'topic-opened',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subsection.id])

  const totalQuizzes = cards.filter((c) => c.inlineQuiz).length

  const goNext = useCallback(() => {
    if (quizBlocking) return
    if (isLastCard) {
      completeSubsection(subsection.id)
      logActivity({
        mode: 'narrative',
        chapter_id: cid,
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
  }, [quizBlocking, isLastCard, cards.length, playPageTurn, completeSubsection, subsection.id, onComplete, cid, totalQuizzes, quizzesCorrect])

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
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-10">
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
      </div>
    )
  }


  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0, scale: 0.97 }),
  }

  return (
    <div className="min-h-dvh" {...swipeHandlers}>
      {/* ── Immersion top bar (V2, decision #38): one exit, one location ── */}
      <div className="sticky top-0 z-10 flex items-center gap-3.5 px-4 md:px-6 py-3 border-b border-v2-line backdrop-blur-md bg-[rgba(255,253,250,.94)]">
        <button
          className="w-[38px] h-[38px] rounded-[11px] border border-v2-line bg-white text-v2-ink grid place-items-center shrink-0"
          aria-label="Back to section"
          onClick={onBackToSection}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="min-w-0">
          <b className="block text-[13.5px] font-extrabold text-v2-ink truncate">
            Topic {subsectionIndex + 1} · {subsection.title}
          </b>
          {sectionTitle && (
            <span className="block text-[11px] font-bold text-v2-muted truncate">
              {sectionTitle}
            </span>
          )}
        </div>
        <span className="ml-auto shrink-0 text-[11px] font-extrabold text-v2-muted hidden sm:block">
          Topic {subsectionIndex + 1} of {totalSubsections}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 pb-10">
      {/* ── Progress ── */}
      <div className="mb-5">
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
                  <NarrativeCard card={currentCard} sectionColor={sectionColor} chapterId={chapterId || 'ch1'} />
                  <InlineQuizCard
                    quiz={currentCard.inlineQuiz!}
                    cardText=""
                    sectionColor={sectionColor}
                    onAnswered={handleQuizAnswered}
                  />
                </div>
              )
            ) : (
              <NarrativeCard card={currentCard} sectionColor={sectionColor} chapterId={chapterId || 'ch1'} />
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
    </div>
  )
}
