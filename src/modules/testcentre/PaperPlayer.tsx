import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  testEngine,
  TestEngineError,
  type StartResult,
  type AnswerResponse,
} from '../../lib/testEngine'

// Sprint 4: the timed paper player. The SERVER owns the clock (attempt
// deadline) — the countdown here is a display computed against a server-time
// offset, and every save/submit is validated server-side. Autosave runs on a
// 15s heartbeat + on question navigation, so a dropped tab loses ≤15s of work.
const AUTOSAVE_MS = 15_000

type Phase = 'loading' | 'playing' | 'submitting' | 'error'

export function PaperPlayer() {
  const navigate = useNavigate()
  const { chapterId, paperId } = useParams<{ chapterId: string; paperId: string }>()
  const cid = chapterId || 'ch1'

  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState('')
  const [data, setData] = useState<StartResult | null>(null)
  const [answers, setAnswers] = useState<Map<string, AnswerResponse>>(new Map())
  const [review, setReview] = useState<Set<string>>(new Set())
  const [index, setIndex] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  // Dirty answers pending sync; ref so the heartbeat sees live state.
  const dirtyRef = useRef<Set<string>>(new Set())
  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])
  const clockOffsetRef = useRef(0) // serverNow - localNow
  const deadlineRef = useRef(0)
  const submittingRef = useRef(false)

  useEffect(() => {
    if (!paperId) return
    testEngine
      .start(paperId)
      .then((res) => {
        clockOffsetRef.current = new Date(res.server_now).getTime() - Date.now()
        deadlineRef.current = new Date(res.attempt.deadline).getTime()
        const restored = new Map<string, AnswerResponse>()
        for (const s of res.saved) restored.set(s.question_id, s.response)
        setAnswers(restored)
        setData(res)
        setPhase('playing')
      })
      .catch((e) => {
        if (e instanceof TestEngineError && e.status === 403) {
          setError('This chapter is locked — unlock it to attempt practice papers.')
        } else {
          setError(e.message || 'Could not open the paper')
        }
        setPhase('error')
      })
  }, [paperId])

  const flushSave = useCallback(async () => {
    if (!data || dirtyRef.current.size === 0) return
    const batch = [...dirtyRef.current]
      .map((qid) => {
        const response = answersRef.current.get(qid)
        return response ? { question_id: qid, response } : null
      })
      .filter((x): x is { question_id: string; response: AnswerResponse } => x !== null)
    if (!batch.length) return
    dirtyRef.current = new Set()
    try {
      await testEngine.save(data.attempt.id, batch)
    } catch (e) {
      if (e instanceof TestEngineError && e.status === 409) {
        // Attempt closed or time up server-side — nothing more to save.
        return
      }
      // Network hiccup: re-mark as dirty so the next heartbeat retries.
      for (const b of batch) dirtyRef.current.add(b.question_id)
    }
  }, [data])

  const doSubmit = useCallback(async () => {
    if (!data || submittingRef.current) return
    submittingRef.current = true
    setPhase('submitting')
    try {
      await flushSave()
      const res = await testEngine.submit(data.attempt.id)
      navigate(`/chapter/${cid}/tests/result/${res.attempt.id}`, { replace: true })
    } catch (e) {
      submittingRef.current = false
      setPhase('playing')
      setError((e as Error).message || 'Submit failed — please try again')
    }
  }, [data, flushSave, navigate, cid])

  // Server-offset countdown; auto-submit at zero.
  useEffect(() => {
    if (phase !== 'playing') return
    const tick = () => {
      const left = deadlineRef.current - (Date.now() + clockOffsetRef.current)
      setRemaining(Math.max(0, left))
      if (left <= 0 && !submittingRef.current) doSubmit()
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [phase, doSubmit])

  // Autosave heartbeat + flush on unmount/tab-hide.
  useEffect(() => {
    if (phase !== 'playing') return
    const id = setInterval(flushSave, AUTOSAVE_MS)
    const onHide = () => {
      if (document.visibilityState === 'hidden') flushSave()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onHide)
      flushSave()
    }
  }, [phase, flushSave])

  const questions = data?.questions ?? []
  const question = questions[index]
  const source = useMemo(
    () =>
      question?.source_id
        ? data?.sources.find((s) => s.source_id === question.source_id)
        : undefined,
    [question, data],
  )

  const setResponse = (qid: string, response: AnswerResponse) => {
    setAnswers((prev) => {
      const next = new Map(prev)
      next.set(qid, response)
      return next
    })
    dirtyRef.current.add(qid)
  }

  const goTo = (i: number) => {
    flushSave()
    setIndex(Math.max(0, Math.min(questions.length - 1, i)))
    setPaletteOpen(false)
  }

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">⏱️</div>
          <p className="text-gray-400 font-body text-sm">Opening your paper…</p>
        </div>
      </div>
    )
  }

  if (phase === 'error' || !data || !question) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-4xl mb-3">🙈</div>
        <p className="font-body text-sm text-gray-600 mb-4">{error || 'Something went wrong.'}</p>
        <button
          className="font-display font-bold text-white rounded-xl px-5 py-2.5 shadow-button btn-press"
          style={{ backgroundColor: '#C05F35' }}
          onClick={() => navigate(`/chapter/${cid}/tests`)}
        >
          Back to Test Centre
        </button>
      </div>
    )
  }

  const answeredCount = [...answers.keys()].filter((qid) =>
    questions.some((q) => q.id === qid),
  ).length
  const mins = remaining !== null ? Math.floor(remaining / 60_000) : 0
  const secs = remaining !== null ? Math.floor((remaining % 60_000) / 1000) : 0
  const lowTime = remaining !== null && remaining < 5 * 60_000
  const isMcq = question.qtype === 'mcq'
  const response = answers.get(question.id)

  return (
    <div className="max-w-3xl mx-auto pb-28">
      {/* Sticky exam bar: timer + progress + palette toggle */}
      <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-md border border-hist-line rounded-2xl shadow-card px-4 py-3 mb-5 flex items-center justify-between gap-3">
        <div>
          <div className="font-display font-bold text-hist-dark text-sm leading-tight">
            {data.paper.title}
          </div>
          <div className="text-xs font-body text-gray-400">
            {answeredCount}/{questions.length} answered
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`font-display font-bold tabular-nums rounded-xl px-3 py-1.5 text-sm ${
              lowTime ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-hist-gold-soft text-hist-dark'
            }`}
          >
            ⏱ {mins}:{secs.toString().padStart(2, '0')}
          </div>
          <button
            className="font-display font-bold text-hist-blue bg-hist-blue/10 rounded-xl px-3 py-1.5 text-sm btn-press"
            onClick={() => setPaletteOpen(!paletteOpen)}
          >
            {index + 1}/{questions.length} ▾
          </button>
        </div>
      </div>

      {/* Question palette */}
      <AnimatePresence>
        {paletteOpen && (
          <motion.div
            className="bg-white border border-hist-line rounded-2xl shadow-card p-4 mb-5"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-wrap gap-2">
              {questions.map((q, i) => {
                const answered = answers.has(q.id)
                const flagged = review.has(q.id)
                return (
                  <button
                    key={q.id}
                    className={`w-9 h-9 rounded-lg font-display font-bold text-xs border transition-colors ${
                      i === index
                        ? 'border-hist-dark bg-hist-dark text-white'
                        : flagged
                          ? 'border-hist-purple bg-hist-purple/15 text-hist-purple'
                          : answered
                            ? 'border-hist-green bg-hist-green/15 text-hist-green'
                            : 'border-hist-line bg-white text-gray-400'
                    }`}
                    onClick={() => goTo(i)}
                  >
                    {i + 1}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-4 mt-3 text-[11px] font-body text-gray-400">
              <span>🟩 answered</span>
              <span>🟪 marked for review</span>
              <span>⬜ not yet</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question card */}
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-white border border-hist-line rounded-2xl shadow-card p-5 sm:p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase text-hist-blue bg-hist-blue/10 rounded-full px-2.5 py-1">
              Section {question.section_label}
            </span>
            <span className="text-[11px] font-bold text-gray-400">
              Q{question.position} · {question.marks} mark{question.marks > 1 ? 's' : ''}
            </span>
          </div>
          <button
            className={`text-[11px] font-bold rounded-full px-2.5 py-1 border transition-colors ${
              review.has(question.id)
                ? 'text-hist-purple border-hist-purple bg-hist-purple/10'
                : 'text-gray-400 border-hist-line'
            }`}
            onClick={() =>
              setReview((prev) => {
                const next = new Set(prev)
                if (next.has(question.id)) next.delete(question.id)
                else next.add(question.id)
                return next
              })
            }
          >
            {review.has(question.id) ? '★ Marked' : '☆ Mark for review'}
          </button>
        </div>

        {source && (
          <div className="bg-hist-gold-soft/50 border-l-4 border-hist-gold rounded-r-xl px-4 py-3 mb-4">
            {source.title && (
              <div className="font-display font-bold text-sm text-hist-dark mb-1">
                📜 {source.title}
              </div>
            )}
            <p className="font-body text-sm text-hist-ink whitespace-pre-line leading-relaxed">
              {source.body}
            </p>
          </div>
        )}

        <p className="font-body text-[15px] text-hist-dark leading-relaxed whitespace-pre-line mb-5">
          {question.prompt}
        </p>

        {isMcq && question.options ? (
          <div className="space-y-2.5">
            {question.options.map((opt, i) => {
              const selected = response && 'choice' in response && response.choice === i
              return (
                <button
                  key={i}
                  className={`w-full text-left font-body text-sm rounded-xl border-2 px-4 py-3 transition-colors ${
                    selected
                      ? 'border-hist-blue bg-hist-blue/10 text-hist-dark font-semibold'
                      : 'border-hist-line hover:border-hist-blue/40 text-hist-ink'
                  }`}
                  onClick={() => setResponse(question.id, { choice: i })}
                >
                  <span className="font-display font-bold mr-2 text-hist-blue">
                    {String.fromCharCode(97 + i)})
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        ) : (
          <div>
            <textarea
              className="w-full min-h-[180px] font-body text-sm text-hist-dark border-2 border-hist-line focus:border-hist-blue rounded-xl px-4 py-3 outline-none resize-y leading-relaxed"
              placeholder={`Write your answer here… (aim for ~${question.marks * 30} words for ${question.marks} marks)`}
              value={response && 'text' in response ? response.text : ''}
              onChange={(e) => setResponse(question.id, { text: e.target.value })}
            />
            <div className="text-right text-[11px] font-body text-gray-400 mt-1">
              {response && 'text' in response
                ? `${response.text.trim().split(/\s+/).filter(Boolean).length} words`
                : 'Answers save automatically'}
            </div>
          </div>
        )}
      </motion.div>

      {/* Bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-hist-line px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-3">
          <button
            className="font-display font-bold text-hist-dark bg-white border border-hist-line rounded-xl px-4 py-2.5 text-sm btn-press disabled:opacity-40"
            disabled={index === 0}
            onClick={() => goTo(index - 1)}
          >
            ← Previous
          </button>
          {index < questions.length - 1 ? (
            <button
              className="font-display font-bold text-white rounded-xl px-5 py-2.5 text-sm shadow-button btn-press"
              style={{ backgroundColor: '#5571B5' }}
              onClick={() => goTo(index + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="font-display font-bold text-white rounded-xl px-5 py-2.5 text-sm shadow-button btn-press"
              style={{ backgroundColor: '#C05F35' }}
              onClick={() => setConfirmOpen(true)}
            >
              Submit paper
            </button>
          )}
          <button
            className="font-display font-bold text-hist-red bg-hist-red/10 rounded-xl px-4 py-2.5 text-sm btn-press"
            onClick={() => setConfirmOpen(true)}
          >
            Finish
          </button>
        </div>
      </div>

      {/* Submit confirmation */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setConfirmOpen(false)}
          >
            <motion.div
              className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-card text-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-4xl mb-2">📤</div>
              <h3 className="font-display text-lg font-bold text-hist-dark mb-1">
                Submit your paper?
              </h3>
              <p className="font-body text-sm text-gray-500 mb-4">
                You've answered {answeredCount} of {questions.length} questions.
                {answeredCount < questions.length &&
                  ` ${questions.length - answeredCount} unanswered will score 0.`}{' '}
                Objective questions are marked instantly.
              </p>
              <div className="space-y-2">
                <button
                  className="w-full font-display font-bold text-white rounded-xl px-5 py-3 shadow-button btn-press disabled:opacity-60"
                  style={{ backgroundColor: '#C05F35' }}
                  disabled={phase === 'submitting'}
                  onClick={doSubmit}
                >
                  {phase === 'submitting' ? 'Submitting…' : 'Yes, submit'}
                </button>
                <button
                  className="w-full font-display font-bold text-gray-500 rounded-xl px-5 py-2.5 text-sm"
                  onClick={() => setConfirmOpen(false)}
                >
                  Keep writing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
