import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  testEngine,
  TestEngineError,
  type StartResult,
  type PlayerQuestion,
  type AnswerResponse,
} from '../../lib/testEngine'

// Paper player — aligned to mockups/launch-07-paper-player.html (2026-07-19
// mockup-alignment pass): sticky exam bar with the full palette inline,
// source-based sub-questions grouped on one page with (a)/(b)/(c) labels,
// per-question "Board technique" hint, live "Saved · Xs ago" indicator,
// submit card with answered/blank/time chips. The SERVER owns the clock —
// the countdown is display-only against a server-time offset, and every
// save/submit is validated server-side. Autosave: 15s heartbeat + page turns.
const AUTOSAVE_MS = 15_000

type Phase = 'loading' | 'playing' | 'submitting' | 'error'

/** Consecutive questions sharing a source render as one page (a/b/c). */
interface Page {
  sourceId: string | null
  questions: PlayerQuestion[]
}

function buildPages(questions: PlayerQuestion[]): Page[] {
  const pages: Page[] = []
  for (const q of questions) {
    const last = pages[pages.length - 1]
    if (q.source_id && last && last.sourceId === q.source_id) {
      last.questions.push(q)
    } else {
      pages.push({ sourceId: q.source_id, questions: [q] })
    }
  }
  return pages
}

export function PaperPlayer() {
  const navigate = useNavigate()
  const { chapterId, paperId } = useParams<{ chapterId: string; paperId: string }>()
  const cid = chapterId || 'ch1'

  const [phase, setPhase] = useState<Phase>('loading')
  const [error, setError] = useState('')
  const [data, setData] = useState<StartResult | null>(null)
  const [answers, setAnswers] = useState<Map<string, AnswerResponse>>(new Map())
  const [pageIndex, setPageIndex] = useState(0)
  const [remaining, setRemaining] = useState<number | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [savedAgo, setSavedAgo] = useState<number | null>(null)
  const [hasDirty, setHasDirty] = useState(false)

  const dirtyRef = useRef<Set<string>>(new Set())
  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])
  const clockOffsetRef = useRef(0)
  const deadlineRef = useRef(0)
  const submittingRef = useRef(false)
  const lastSavedRef = useRef<number | null>(null)

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
      lastSavedRef.current = Date.now()
      setSavedAgo(0)
      setHasDirty(dirtyRef.current.size > 0)
    } catch (e) {
      if (e instanceof TestEngineError && e.status === 409) return
      for (const b of batch) dirtyRef.current.add(b.question_id)
      setHasDirty(true)
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

  // Countdown + saved-ago ticker; auto-submit at zero (server enforces anyway).
  useEffect(() => {
    if (phase !== 'playing') return
    const tick = () => {
      const left = deadlineRef.current - (Date.now() + clockOffsetRef.current)
      setRemaining(Math.max(0, left))
      setSavedAgo(
        lastSavedRef.current === null
          ? null
          : Math.round((Date.now() - lastSavedRef.current) / 1000),
      )
      if (left <= 0 && !submittingRef.current) doSubmit()
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [phase, doSubmit])

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

  const questions = useMemo(() => data?.questions ?? [], [data])
  const pages = useMemo(() => buildPages(questions), [questions])
  const page = pages[pageIndex]

  const setResponse = (qid: string, response: AnswerResponse) => {
    setAnswers((prev) => {
      const next = new Map(prev)
      next.set(qid, response)
      return next
    })
    dirtyRef.current.add(qid)
    setHasDirty(true)
  }

  const goTo = (i: number) => {
    flushSave()
    setPageIndex(Math.max(0, Math.min(pages.length - 1, i)))
    window.scrollTo({ top: 0 })
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

  if (phase === 'error' || !data || !page) {
    return (
      <div className="max-w-md mx-auto px-4 text-center py-16">
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

  const answeredIds = new Set(
    [...answers.keys()].filter((qid) => questions.some((q) => q.id === qid)),
  )
  const blankQuestions = questions.filter((q) => !answeredIds.has(q.id))
  const pageAnswered = (p: Page) => p.questions.every((q) => answeredIds.has(q.id))
  const firstBlankPage = pages.findIndex((p) => p.questions.some((q) => !answeredIds.has(q.id)))

  const mins = remaining !== null ? Math.floor(remaining / 60_000) : 0
  const secs = remaining !== null ? Math.floor((remaining % 60_000) / 1000) : 0
  const lowTime = remaining !== null && remaining < 5 * 60_000
  const source = page.sourceId
    ? data.sources.find((s) => s.source_id === page.sourceId)
    : undefined
  const isLastPage = pageIndex === pages.length - 1
  const subLabels = 'abcdefgh'

  return (
    <div className="max-w-3xl mx-auto px-4 pt-5 pb-24">
      {/* Sticky exam bar: title · palette · timer (launch-07) */}
      <div className="sticky top-[64px] z-30 bg-white/95 backdrop-blur-md border border-hist-line rounded-2xl shadow-card px-4 py-3 mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <b className="block font-display font-bold text-hist-dark text-sm leading-tight truncate">
            {data.paper.title}
          </b>
          <span className="text-[11.5px] font-semibold text-hist-muted">
            {data.paper.total_marks} marks · {answeredIds.size}/{questions.length} answered
          </span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-w-[46%] justify-center">
          {pages.map((p, i) => (
            <button
              key={i}
              className={`w-8 h-8 rounded-[9px] font-display font-bold text-[11.5px] border transition-colors ${
                i === pageIndex
                  ? 'border-hist-gold bg-hist-gold text-white'
                  : pageAnswered(p)
                    ? 'border-hist-green/40 bg-hist-green/15 text-hist-green'
                    : 'border-hist-line bg-white text-hist-muted'
              }`}
              onClick={() => goTo(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div
          className={`font-display font-bold tabular-nums rounded-xl px-3 py-1.5 text-sm shrink-0 ${
            lowTime ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-hist-gold-soft text-hist-dark'
          }`}
        >
          ⏱ {mins}:{secs.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Page card */}
      <motion.div
        key={pageIndex}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18 }}
        className="bg-white border border-hist-line rounded-2xl shadow-card p-5 sm:p-7"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wide text-hist-gold">
            Question {page.questions[0].position}
            {page.questions.length > 1 &&
              `–${page.questions[page.questions.length - 1].position}`}{' '}
            · Section {page.questions[0].section_label}
          </span>
          <span className="text-[11px] font-extrabold uppercase text-hist-indigo bg-hist-indigo-soft rounded-full px-2.5 py-1">
            {page.questions.length > 1
              ? `${page.questions.map((q) => q.marks).join('+')} = ${page.questions.reduce((s, q) => s + q.marks, 0)} marks`
              : `${page.questions[0].marks} mark${page.questions[0].marks > 1 ? 's' : ''}`}
          </span>
        </div>

        {source && (
          <div className="bg-hist-gold-soft/50 border-l-4 border-hist-gold rounded-r-xl px-4 py-3 mb-4">
            <div className="text-[11px] font-extrabold uppercase tracking-wide text-hist-gold mb-1">
              📜 Source · read the extract, then answer{source.title ? ` — ${source.title}` : ''}
            </div>
            <p className="font-body text-sm text-hist-ink whitespace-pre-line leading-relaxed">
              {source.body}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {page.questions.map((q, qi) => {
            const response = answers.get(q.id)
            const isMcq = q.qtype === 'mcq'
            return (
              <div key={q.id}>
                <h2 className="font-display text-[17px] font-semibold text-hist-dark leading-snug whitespace-pre-line mb-1.5">
                  {page.questions.length > 1 && (
                    <span className="text-hist-gold mr-1.5">({subLabels[qi]})</span>
                  )}
                  {q.prompt}
                  {page.questions.length > 1 && (
                    <span className="ml-2 text-[10.5px] font-extrabold uppercase text-hist-muted align-middle">
                      {q.marks} mark{q.marks > 1 ? 's' : ''}
                    </span>
                  )}
                </h2>

                {q.hint && (
                  <div className="flex gap-2 items-start bg-hist-indigo-soft/60 border border-[#DED7F0] rounded-xl px-3.5 py-2.5 mb-3 mt-2">
                    <span>💡</span>
                    <p className="font-body text-[12.5px] text-hist-ink leading-relaxed">
                      <b>Board technique:</b> {q.hint}
                    </p>
                  </div>
                )}

                {isMcq && q.options ? (
                  <div className="space-y-2.5 mt-3">
                    {q.options.map((opt, i) => {
                      const selected = response && 'choice' in response && response.choice === i
                      return (
                        <button
                          key={i}
                          className={`w-full flex items-center gap-3 text-left font-body text-sm rounded-xl border-2 px-4 py-3 transition-colors ${
                            selected
                              ? 'border-hist-blue bg-hist-blue/10 text-hist-dark font-semibold'
                              : 'border-hist-line hover:border-hist-blue/40 text-hist-ink'
                          }`}
                          onClick={() => setResponse(q.id, { choice: i })}
                        >
                          <span
                            className={`w-7 h-7 rounded-lg grid place-items-center font-display font-bold text-xs shrink-0 ${
                              selected ? 'bg-hist-blue text-white' : 'bg-hist-gold-soft text-hist-dark'
                            }`}
                          >
                            {String.fromCharCode(65 + i)}
                          </span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className="mt-3">
                    <textarea
                      className="w-full font-body text-sm text-hist-dark border-2 border-hist-line focus:border-hist-blue rounded-xl px-4 py-3 outline-none resize-y leading-relaxed"
                      style={{ minHeight: Math.min(60 + q.marks * 40, 240) }}
                      placeholder="Write your answer point-wise…"
                      value={response && 'text' in response ? response.text : ''}
                      onChange={(e) => setResponse(q.id, { text: e.target.value })}
                    />
                    <div className="text-right text-[11px] font-semibold text-hist-muted mt-1">
                      {response && 'text' in response && response.text.trim()
                        ? `${response.text.trim().split(/\s+/).filter(Boolean).length} words`
                        : `aim for ~${q.marks * 30} words`}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Page nav (launch-07: Previous · saved · Next) */}
        <div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-hist-line">
          <button
            className="font-display font-bold text-hist-dark bg-white border-[1.5px] border-hist-line rounded-[11px] px-4 py-2.5 text-[13px] btn-press disabled:opacity-40"
            disabled={pageIndex === 0}
            onClick={() => goTo(pageIndex - 1)}
          >
            ← Previous
          </button>
          <span className="text-[11.5px] font-bold text-hist-green">
            {hasDirty
              ? 'Saving…'
              : savedAgo === null
                ? 'Answers save automatically'
                : savedAgo < 3
                  ? '✓ Saved'
                  : `✓ Saved · ${savedAgo}s ago`}
          </span>
          {isLastPage ? (
            <button
              className="font-display font-bold text-white rounded-[11px] px-5 py-2.5 text-[13px] shadow-button btn-press"
              style={{ backgroundColor: '#7E72C2' }}
              onClick={() => setConfirmOpen(true)}
            >
              Review &amp; submit →
            </button>
          ) : (
            <button
              className="font-display font-bold text-white rounded-[11px] px-5 py-2.5 text-[13px] shadow-button btn-press"
              style={{ backgroundColor: '#DC835F' }}
              onClick={() => goTo(pageIndex + 1)}
            >
              Next →
            </button>
          )}
        </div>
      </motion.div>

      {!isLastPage && (
        <div className="text-center mt-4">
          <button
            className="text-[12.5px] font-bold text-hist-muted hover:text-hist-dark font-body"
            onClick={() => setConfirmOpen(true)}
          >
            Finish early &amp; submit
          </button>
        </div>
      )}

      {/* Submit confirmation (launch-07 submit card) */}
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
              className="bg-white rounded-3xl p-7 w-full max-w-md shadow-card text-center"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-display text-xl font-bold text-hist-dark mb-1.5">
                Submit paper?
              </h3>
              <p className="font-body text-[13.5px] text-hist-muted mb-4">
                Objective questions are marked instantly; written answers get the official CBSE
                marking scheme to check against.
              </p>
              <div className="flex flex-wrap gap-2 justify-center mb-5">
                <span className="flex items-center gap-1.5 bg-hist-gold-soft/60 border border-hist-line px-3 py-2 rounded-[11px] text-[12.5px] font-semibold text-hist-ink">
                  ✅ <b className="text-hist-dark">{answeredIds.size} of {questions.length} answered</b>
                </span>
                {blankQuestions.length > 0 && (
                  <span className="flex items-center gap-1.5 bg-hist-orange/10 border border-hist-orange/20 px-3 py-2 rounded-[11px] text-[12.5px] font-semibold text-hist-orange">
                    ⚠️ <b>Q{blankQuestions.map((q) => q.position).join(', Q')} blank</b>
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-hist-gold-soft/60 border border-hist-line px-3 py-2 rounded-[11px] text-[12.5px] font-semibold text-hist-ink">
                  ⏱ <b className="text-hist-dark">{mins}:{secs.toString().padStart(2, '0')} left</b>
                </span>
              </div>
              <div className="flex gap-2.5 justify-center">
                {blankQuestions.length > 0 && firstBlankPage >= 0 && (
                  <button
                    className="font-display font-bold text-hist-dark bg-white border-[1.5px] border-hist-line rounded-[11px] px-4 py-2.5 text-[13px] btn-press"
                    onClick={() => {
                      setConfirmOpen(false)
                      goTo(firstBlankPage)
                    }}
                  >
                    Go to Q{blankQuestions[0].position}
                  </button>
                )}
                <button
                  className="font-display font-bold text-white rounded-[11px] px-6 py-2.5 text-[13px] shadow-button btn-press disabled:opacity-60"
                  style={{ backgroundColor: '#DC835F' }}
                  disabled={phase === 'submitting'}
                  onClick={doSubmit}
                >
                  {phase === 'submitting' ? 'Submitting…' : 'Submit for marking'}
                </button>
              </div>
              <button
                className="mt-3 text-[12.5px] font-semibold text-gray-400 hover:text-gray-600 font-body"
                onClick={() => setConfirmOpen(false)}
              >
                Keep writing
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
