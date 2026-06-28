import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FlashcardSingle } from '../components/flashcard'
import { getFlashcards, getChapter, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { useFlashcardStore } from '../store/useFlashcardStore'
import { calculateNextReview, createInitialReviewState, isDueForReview } from '../engine/spacedRepetition'

type FlashcardPhase = 'home' | 'browse' | 'practice' | 'stats'

// Section names will be derived from chapter data inside the component

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export function FlashcardMode() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const flashcards = useMemo(() => getFlashcards(cid), [cid])
  const chapter = getChapter(cid)
  const SECTION_COLORS = CHAPTER_SECTION_COLORS[cid] || {}
  const SECTION_NAMES: Record<string, string> = useMemo(() => {
    const names: Record<string, string> = {}
    chapter?.sections.forEach(s => { names[s.id] = s.title })
    return names
  }, [chapter])
  const { reviewStates, updateReviewState } = useFlashcardStore()

  const [phase, setPhase] = useState<FlashcardPhase>('home')
  const [sectionFilter, setSectionFilter] = useState<string | null>(null)
  const [practiceCards, setPracticeCards] = useState(flashcards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [practiceMode, setPracticeMode] = useState<'all' | 'due' | 'section'>('all')

  // Stats
  const [sessionReviewed, setSessionReviewed] = useState(0)
  const [sessionCorrect, setSessionCorrect] = useState(0)

  const today = new Date().toISOString().split('T')[0]

  // Due cards
  const dueCards = useMemo(() => {
    return flashcards.filter(card => {
      const state = reviewStates[card.id]
      if (!state) return true // Never reviewed = due
      return isDueForReview(state, today)
    })
  }, [reviewStates, today])

  // Cards studied (have review state)
  const studiedCount = useMemo(() => Object.keys(reviewStates).length, [reviewStates])

  // Mastered cards (interval >= 21 days)
  const masteredCount = useMemo(() => {
    return Object.values(reviewStates).filter(s => s.interval >= 21).length
  }, [reviewStates])

  // Learning cards (have state but interval < 21)
  const learningCount = useMemo(() => {
    return Object.values(reviewStates).filter(s => s.interval < 21).length
  }, [reviewStates])

  // Section counts
  const sectionCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const card of flashcards) {
      counts[card.sectionId] = (counts[card.sectionId] || 0) + 1
    }
    return counts
  }, [])

  // Filtered cards for browse
  const browseCards = useMemo(() => {
    if (!sectionFilter) return flashcards
    return flashcards.filter(c => c.sectionId === sectionFilter)
  }, [sectionFilter])

  const handleStartPractice = useCallback((mode: 'all' | 'due' | 'section', section?: string) => {
    let cards = flashcards
    if (mode === 'due') {
      cards = dueCards.length > 0 ? dueCards : flashcards
    } else if (mode === 'section' && section) {
      cards = flashcards.filter(c => c.sectionId === section)
    }
    const shuffled = shuffle(cards).slice(0, 20) // Max 20 cards per session
    setPracticeCards(shuffled)
    setPracticeMode(mode)
    setCurrentIndex(0)
    setSessionReviewed(0)
    setSessionCorrect(0)
    setPhase('practice')
  }, [dueCards])

  const handleRate = useCallback((quality: number) => {
    const card = practiceCards[currentIndex]
    const currentState = reviewStates[card.id] || createInitialReviewState()
    const nextState = calculateNextReview(quality, currentState)

    updateReviewState(card.id, {
      cardId: card.id,
      interval: nextState.interval,
      repetition: nextState.repetition,
      easeFactor: nextState.easeFactor,
      nextReview: nextState.nextReview,
    })

    setSessionReviewed(r => r + 1)
    if (quality >= 3) setSessionCorrect(c => c + 1)

    if (currentIndex < practiceCards.length - 1) {
      setTimeout(() => setCurrentIndex(i => i + 1), 300)
    } else {
      setTimeout(() => setPhase('stats'), 300)
    }
  }, [practiceCards, currentIndex, reviewStates, updateReviewState])

  // === BROWSE ===
  if (phase === 'browse') {
    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Flashcards
        </motion.button>

        {/* Section filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
              !sectionFilter ? 'bg-hist-dark text-white' : 'bg-gray-100 text-gray-500'
            }`}
            onClick={() => setSectionFilter(null)}
          >
            All ({flashcards.length})
          </button>
          {Object.entries(SECTION_COLORS).map(([id, color]) => (
            <button
              key={id}
              className="text-xs font-bold px-3 py-1.5 rounded-full transition-colors text-white"
              style={{
                backgroundColor: sectionFilter === id ? color : `${color}30`,
                color: sectionFilter === id ? 'white' : color,
              }}
              onClick={() => setSectionFilter(sectionFilter === id ? null : id)}
            >
              S{id.replace('s', '')} ({sectionCounts[id] || 0})
            </button>
          ))}
        </div>

        {/* Cards list */}
        <div className="space-y-3">
          {browseCards.map((card, i) => {
            const color = SECTION_COLORS[card.sectionId] || '#2980B9'
            const state = reviewStates[card.id]
            const mastered = state && state.interval >= 21

            return (
              <motion.div
                key={card.id}
                className="bg-white rounded-xl p-4 shadow-card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-semibold text-hist-dark leading-snug mb-1">
                      {card.front}
                    </p>
                    <p className="font-body text-xs text-gray-400 leading-snug line-clamp-2">
                      {card.back}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {mastered && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-100 text-green-600">
                          Mastered
                        </span>
                      )}
                      {state && !mastered && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">
                          Learning
                        </span>
                      )}
                      {!state && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-400">
                          New
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
    )
  }

  // === PRACTICE ===
  if (phase === 'practice') {
    const card = practiceCards[currentIndex]
    const color = SECTION_COLORS[card.sectionId] || '#2980B9'

    return (
      <div className="max-w-lg mx-auto">
        <motion.button
          className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
          onClick={() => setPhase('home')}
          whileHover={{ x: -3 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          Back to Flashcards
        </motion.button>

        {/* Progress bar */}
        <div className="flex gap-1 mb-5">
          {practiceCards.map((_, i) => (
            <div
              key={i}
              className="h-1.5 flex-1 rounded-full transition-colors"
              style={{
                backgroundColor: i < currentIndex ? '#1F9E57' :
                  i === currentIndex ? color : '#E5E7EB',
              }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="font-body text-sm text-gray-400">
            Card {currentIndex + 1} of {practiceCards.length}
          </span>
          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
            {SECTION_NAMES[card.sectionId] || card.sectionId}
          </span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={card.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <FlashcardSingle
              front={card.front}
              back={card.back}
              sectionId={card.sectionId}
              tags={card.tags}
              showRating={true}
              onRate={handleRate}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  // === STATS (Session Results) ===
  if (phase === 'stats') {
    const pct = sessionReviewed > 0 ? Math.round((sessionCorrect / sessionReviewed) * 100) : 0

    return (
      <div className="max-w-md mx-auto">
        <motion.div
          className="bg-white rounded-2xl shadow-card overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-2" style={{ background: 'linear-gradient(90deg, #7D3C98, #7D3C9860)' }} />
          <div className="p-6 sm:p-8 text-center">
            <motion.div
              className="text-6xl mb-3"
              animate={{ rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {pct >= 80 ? '🧠' : pct >= 50 ? '📚' : '💪'}
            </motion.div>

            <h2 className="font-display text-2xl font-bold text-hist-dark mb-1">
              {pct >= 80 ? 'Excellent Memory!' : pct >= 50 ? 'Good Progress!' : 'Keep Practising!'}
            </h2>
            <p className="font-body text-sm text-gray-500 mb-5">Flashcard Review Complete</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-display font-bold text-hist-dark">{sessionReviewed}</div>
                <div className="text-xs text-gray-400 font-body">Reviewed</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-display font-bold text-hist-green">{sessionCorrect}</div>
                <div className="text-xs text-gray-400 font-body">Knew It</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-display font-bold text-hist-purple">{pct}%</div>
                <div className="text-xs text-gray-400 font-body">Score</div>
              </div>
            </div>

            {/* Overall progress */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
              <p className="font-display font-bold text-sm text-hist-dark mb-2">Overall Progress</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold text-gray-400">{flashcards.length - studiedCount}</div>
                  <div className="text-[10px] text-gray-400">New</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-amber-500">{learningCount}</div>
                  <div className="text-[10px] text-amber-500">Learning</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-500">{masteredCount}</div>
                  <div className="text-[10px] text-green-500">Mastered</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <motion.button
                className="bg-hist-purple text-white font-display text-base px-8 py-3 rounded-full shadow-button btn-press"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleStartPractice(practiceMode)}
              >
                Practice Again
              </motion.button>
              <motion.button
                className="bg-gray-100 text-hist-dark font-display text-base px-8 py-3 rounded-full btn-press"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setPhase('home')}
              >
                Back to Flashcards
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
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
            <span className="text-white text-2xl">🃏</span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-hist-dark">Flashcards</h1>
            <p className="font-body text-sm text-gray-400">
              {flashcards.length} cards with spaced repetition
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick stats bar */}
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-card mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-lg font-display font-bold text-hist-blue">{dueCards.length}</div>
            <div className="text-[10px] text-gray-400 font-body">Due Today</div>
          </div>
          <div>
            <div className="text-lg font-display font-bold text-gray-400">{flashcards.length - studiedCount}</div>
            <div className="text-[10px] text-gray-400 font-body">New</div>
          </div>
          <div>
            <div className="text-lg font-display font-bold text-amber-500">{learningCount}</div>
            <div className="text-[10px] text-amber-500 font-body">Learning</div>
          </div>
          <div>
            <div className="text-lg font-display font-bold text-green-500">{masteredCount}</div>
            <div className="text-[10px] text-green-500 font-body">Mastered</div>
          </div>
        </div>
      </motion.div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {/* Due Today */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStartPractice('due')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-blue/10 flex items-center justify-center text-3xl shrink-0">
              🔄
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Review Due Cards</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                <strong>{dueCards.length} cards</strong> are due for review today. SM-2 spaced repetition keeps your memory fresh.
              </p>
              {dueCards.length === 0 && (
                <span className="inline-block mt-2 text-xs font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                  All caught up!
                </span>
              )}
            </div>
          </div>
        </motion.button>

        {/* Practice All */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleStartPractice('all')}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-gold/10 flex items-center justify-center text-3xl shrink-0">
              🧠
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Practice All</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                Random selection of <strong>20 cards</strong> from all {flashcards.length} flashcards. Flip, recall, and rate yourself.
              </p>
            </div>
          </div>
        </motion.button>

        {/* Browse All */}
        <motion.button
          className="bg-white rounded-2xl p-6 shadow-card text-left hover:shadow-card-hover transition-shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => { setSectionFilter(null); setPhase('browse') }}
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-hist-purple/10 flex items-center justify-center text-3xl shrink-0">
              📋
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-hist-dark mb-1">Browse All Cards</h2>
              <p className="font-body text-sm text-gray-500 leading-relaxed">
                View all <strong>{flashcards.length} flashcards</strong> across all sections. Filter by section to study specific topics.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {Object.entries(SECTION_COLORS).map(([id, color]) => (
                  <span key={id} className="w-5 h-2 rounded-full" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </motion.button>
      </div>

      {/* Practice by Section */}
      <div>
        <h3 className="font-display font-bold text-sm text-gray-500 mb-3 uppercase tracking-wide">Practice by Section</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(SECTION_COLORS).map(([id, color], i) => (
            <motion.button
              key={id}
              className="bg-white rounded-xl p-4 shadow-card text-left hover:shadow-card-hover transition-shadow"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.04 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleStartPractice('section', id)}
            >
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: color }}
                >
                  {id.replace('s', '')}
                </div>
                <span className="font-display font-bold text-sm text-hist-dark">
                  S{id.replace('s', '')}
                </span>
              </div>
              <p className="font-body text-xs text-gray-400 leading-snug">
                {SECTION_NAMES[id]}
              </p>
              <p className="font-body text-[10px] text-gray-300 mt-1">
                {sectionCounts[id] || 0} cards
              </p>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
