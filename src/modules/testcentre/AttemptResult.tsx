import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from '../../components/auth'
import { useAccess } from '../../components/auth/AccessProvider'
import { startCheckout } from '../../lib/razorpay'
import {
  testEngine,
  type AttemptResult as AttemptResultData,
  type ResultQuestion,
  type ExaminerMark,
} from '../../lib/testEngine'

// Results — aligned to mockups/launch-08-results-feedback.html (2026-07-19
// mockup-alignment pass): breadcrumb, score hero with gradient ring + chips,
// per-section bars, rich cards for written answers (your answer → scheme →
// collapsible model answer), compact ✓/✗ rows for MCQs. Percentile, AI
// per-point marks, marker's notes and the examiner upsell arrive in Sprint 5 —
// until then written answers are framed as scheme self-check.
export function AttemptResult() {
  const navigate = useNavigate()
  const { profile } = useAuthContext()
  const { chapterId, attemptId } = useParams<{ chapterId: string; attemptId: string }>()
  const cid = chapterId || 'ch1'

  const { products } = useAccess()
  const [data, setData] = useState<AttemptResultData | null>(null)
  const [error, setError] = useState('')
  const [prevBest, setPrevBest] = useState<number | null>(null)
  const [payBusy, setPayBusy] = useState(false)
  const [payNote, setPayNote] = useState<string | null>(null)

  const reviewProduct = products.find((p) => p.id === 'examiner-review')
  const reviewPrice = Math.round((reviewProduct?.price_paise ?? 14900) / 100)

  const buyReview = () => {
    if (!attemptId || payBusy) return
    setPayBusy(true)
    setPayNote(null)
    startCheckout(
      'examiner-review',
      {
        onSuccess: () => window.location.reload(),
        onPending: () => {
          setPayBusy(false)
          setPayNote('Payment received — confirming with the bank. This page will show "With the examiner" in a minute; reload to check.')
        },
        onFailure: (msg) => {
          setPayBusy(false)
          setPayNote(msg)
        },
        onDismiss: () => setPayBusy(false),
      },
      { attemptId },
    )
  }

  useEffect(() => {
    if (!attemptId) return
    testEngine
      .result(attemptId)
      .then((res) => {
        setData(res)
        // Delta chip: best objective score among EARLIER submitted attempts.
        testEngine
          .list(res.paper.chapter_id)
          .then((l) => {
            const earlier = l.attempts.filter(
              (a) =>
                a.paper_id === res.paper.id &&
                a.status === 'submitted' &&
                a.id !== res.attempt.id &&
                (a.submitted_at ?? '') < (res.attempt.submitted_at ?? ''),
            )
            if (earlier.length) {
              setPrevBest(Math.max(...earlier.map((a) => Number(a.objective_awarded ?? 0))))
            }
          })
          .catch(() => {})
      })
      .catch((e) => setError(e.message || 'Could not load your result'))
  }, [attemptId])

  const answerByQ = useMemo(
    () => new Map((data?.answers ?? []).map((a) => [a.question_id, a])),
    [data],
  )
  const sourceById = useMemo(
    () => new Map((data?.sources ?? []).map((s) => [s.source_id, s])),
    [data],
  )

  if (error) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-4xl mb-3">🙈</div>
        <p className="font-body text-sm text-gray-600 mb-4">{error}</p>
        <button
          className="font-display font-bold text-white rounded-xl px-5 py-2.5 shadow-button btn-press"
          style={{ backgroundColor: '#C05F35' }}
          onClick={() => navigate(`/chapter/${cid}/tests`)}
        >
          Back to Mock Tests
        </button>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-float">📊</div>
          <p className="text-gray-400 font-body text-sm">Marking your paper…</p>
        </div>
      </div>
    )
  }

  const { attempt, paper, questions } = data
  const objAwarded = Number(attempt.objective_awarded ?? 0)
  const objMax = Number(attempt.objective_max ?? 0)
  const mcqs = questions.filter((q) => q.qtype === 'mcq')
  const written = questions.filter((q) => q.qtype === 'text')
  const firstName = (profile?.name || 'there').split(' ')[0]
  const delta = prevBest !== null ? objAwarded - prevBest : null

  // Examiner review state (Milestone B): marks live on the review record.
  const examinerMarks = data.review?.status === 'marked' ? data.review.marks : null
  const examinerMarked = !!examinerMarks
  const writtenMax = written.reduce((s, q) => s + q.marks, 0)
  const writtenAwarded = examinerMarks
    ? written.reduce((s, q) => s + (examinerMarks[q.id]?.marks ?? 0), 0)
    : 0
  const examinerTotal = objAwarded + writtenAwarded

  // Per-section summary — shown ONLY once the examiner has marked (Uday: the
  // self-check-era cards were noise; post-marking they finally carry real
  // marks). Each section totals MCQ auto-marks + the examiner's written marks.
  const sections = [...new Set(questions.map((q) => q.section_label))].map((label) => {
    const qs = questions.filter((q) => q.section_label === label)
    const max = qs.reduce((s, q) => s + q.marks, 0)
    const got = qs.reduce((s, q) => {
      if (q.qtype === 'mcq') return s + Number(answerByQ.get(q.id)?.marks_awarded ?? 0)
      return s + (examinerMarks?.[q.id]?.marks ?? 0)
    }, 0)
    return { label, got, max }
  })

  const RING_C = 2 * Math.PI * 47
  // Marked attempts headline the examiner total — the number a student quotes.
  // The MCQ-only score is the headline only until then.
  const ringGot = examinerMarked ? examinerTotal : objAwarded
  const ringMax = examinerMarked ? Number(paper.total_marks) : objMax
  const ringPct = ringMax > 0 ? ringGot / ringMax : 0
  const headline = examinerMarked
    ? `Examiner-marked, ${firstName} — ${examinerTotal}/${paper.total_marks}`
    : delta !== null && delta > 0
      ? `Your best yet, ${firstName} — ${objAwarded}/${objMax}`
      : `${firstName}, you scored ${objAwarded}/${objMax} on MCQs`

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Score hero (launch-08) — the shell's crumb (Mock Tests > Result) is
          the only wayfinding row; the paper is named in the hero meta. */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-hist-line rounded-[22px] shadow-card p-6 sm:p-7 mb-4 flex flex-col sm:flex-row items-center gap-6"
      >
        <div className="relative grid place-items-center shrink-0" style={{ width: 112, height: 112 }}>
          <svg width="112" height="112" className="-rotate-90">
            <circle cx="56" cy="56" r="47" stroke="#EEE9F2" strokeWidth="10" fill="none" />
            <circle
              cx="56" cy="56" r="47" stroke="url(#scoreGrad)" strokeWidth="10" fill="none"
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - ringPct)}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DC835F" />
                <stop offset="1" stopColor="#7E72C2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <b className={`block font-display ${examinerMarked ? 'text-[16px]' : 'text-[19px]'} font-bold text-hist-dark leading-none`}>
              {ringGot}/{ringMax}
            </b>
            <span className="text-[11px] font-extrabold text-hist-muted">
              {Math.round(ringPct * 100)}%
            </span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-[22px] font-semibold text-hist-dark leading-tight mb-1">
            {headline}
          </h1>
          <div className="text-[12.5px] font-semibold text-hist-muted mb-3">
            <b className="text-hist-dark">{paper.title}</b> · Submitted{' '}
            {new Date(attempt.submitted_at).toLocaleString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
            {attempt.auto_submitted && ' · auto-submitted when time ran out'}
            {!examinerMarked && ' · MCQs marked instantly'}
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {examinerMarked ? (
              <>
                <span className="flex items-center gap-1.5 bg-hist-gold-soft/60 border border-hist-line px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold text-hist-ink">
                  🎯 <b className="text-hist-dark">MCQ {objAwarded}/{objMax}</b>
                </span>
                <span className="flex items-center gap-1.5 bg-hist-indigo-soft border border-[#DED7F0] px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold text-hist-indigo">
                  🖋️ <b>Written {writtenAwarded}/{writtenMax} · marked by the examiner</b>
                </span>
              </>
            ) : (
              <>
                {delta !== null && (
                  <span className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold ${
                    delta > 0
                      ? 'bg-hist-green/10 border-hist-green/20 text-hist-green'
                      : 'bg-hist-gold-soft/60 border-hist-line text-hist-ink'
                  }`}>
                    📈 <b>{delta > 0 ? `+${delta}` : delta === 0 ? 'level' : delta} vs previous best</b>
                  </span>
                )}
                {written.length > 0 && (
                  <span className="flex items-center gap-1.5 bg-hist-indigo-soft border border-[#DED7F0] px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold text-hist-indigo">
                    ✍️ <b>{written.length} written · check the scheme below</b>
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Section bars — examiner-marked attempts only: every section now has a
          real total (MCQ auto-marks + examiner's written marks). */}
      {examinerMarked && sections.length > 1 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {sections.map((s, i) => {
            const colors = ['#C36B53', '#5571B5', '#C2893E', '#5C9368', '#9B5C9A']
            const color = colors[i % colors.length]
            return (
              <div key={s.label} className="bg-white border border-hist-line rounded-[14px] px-4 py-3">
                <b className="block text-[12.5px] font-bold text-hist-dark mb-2">
                  Section {s.label}
                </b>
                <div className="h-[7px] rounded-full overflow-hidden mb-1.5" style={{ backgroundColor: '#F1EADD' }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${s.max > 0 ? (s.got / s.max) * 100 : 0}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-[11px] font-bold text-hist-muted">
                  {s.got}/{s.max}
                </span>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex justify-center gap-2 mb-7">
        <button
          className="font-display font-bold text-white rounded-[11px] px-4 py-2.5 text-[13px] shadow-button btn-press"
          style={{ backgroundColor: '#5571B5' }}
          onClick={() => navigate(`/chapter/${cid}/tests`)}
        >
          Mock Tests
        </button>
        <button
          className="font-display font-bold text-hist-dark bg-hist-gold-soft rounded-[11px] px-4 py-2.5 text-[13px] btn-press"
          onClick={() => navigate(`/chapter/${cid}/tests/${paper.id}/play`)}
        >
          Attempt again
        </button>
      </div>

      {/* ── Examiner review (Milestone B, decision #39) ─────────────────── */}
      {written.length > 0 && !data.review && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 sm:p-6 mb-7 text-white"
          style={{ background: 'linear-gradient(135deg, #7E72C2, #5E53A0)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-[18px] font-semibold leading-snug mb-1">
                Get this attempt marked by a Senior CBSE Examiner
              </h2>
              <p className="font-body text-[13px] font-medium opacity-90">
                Real marks and comments on every written answer, the way the board marks —
                returned within 72 hours.
              </p>
              <p className="font-body text-[11px] font-semibold opacity-75 mt-1.5">
                Covers this attempt only · No refunds on examiner reviews
              </p>
            </div>
            <button
              className="shrink-0 font-display font-bold text-[15px] text-hist-indigo bg-white rounded-xl px-6 py-3 shadow-button btn-press disabled:opacity-60"
              onClick={buyReview}
              disabled={payBusy}
            >
              {payBusy ? 'Opening payment…' : `Submit for review · ₹${reviewPrice}`}
            </button>
          </div>
          {payNote && (
            <p className="font-body text-[12px] font-semibold bg-white/15 rounded-xl px-4 py-2.5 mt-3.5">
              {payNote}
            </p>
          )}
        </motion.div>
      )}

      {data.review?.status === 'paid' && (
        <div className="flex items-center gap-3 bg-hist-indigo-soft border border-[#DED7F0] rounded-2xl px-5 py-4 mb-7">
          <span className="text-[22px]">🖋️</span>
          <div>
            <b className="block font-display text-[14.5px] font-semibold text-hist-indigo">
              With the examiner
            </b>
            <span className="font-body text-[12.5px] font-semibold text-hist-muted">
              Your written answers are being marked — check back here, marks arrive within 72 hours.
            </span>
          </div>
        </div>
      )}

      {examinerMarked && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-[1.5px] border-[#DED7F0] rounded-2xl shadow-card p-5 sm:p-6 mb-7"
        >
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1.5">
            <span className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-hist-indigo">
              🖋️ Marked by the Senior CBSE Examiner
            </span>
            {data.review?.marked_at && (
              <span className="text-[11.5px] font-semibold text-hist-muted">
                {new Date(data.review.marked_at).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short',
                })}
              </span>
            )}
          </div>
          <div className="font-display text-[24px] font-bold text-hist-dark mb-2">
            {examinerTotal}/{data.paper.total_marks}
            <span className="font-body text-[13px] font-semibold text-hist-muted ml-2">
              MCQ {objAwarded}/{objMax} + written {writtenAwarded}/{writtenMax}
            </span>
          </div>
          {data.review?.overall_comment && (
            <p className="font-body text-sm text-hist-ink bg-hist-indigo-soft/50 border-l-[3px] border-hist-indigo rounded-r-xl px-4 py-3 leading-relaxed whitespace-pre-line">
              {data.review.overall_comment}
            </p>
          )}
        </motion.div>
      )}

      {/* Written answers — rich per-question cards */}
      {written.length > 0 && (
        <>
          <div className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-hist-muted mb-2.5 px-0.5">
            {examinerMarked
              ? 'Written answers · marked by the examiner'
              : data.review
                ? 'Written answers · with the examiner — marks arrive within 72 hours'
                : 'Written answers · as you submitted them'}
          </div>
          <div className="space-y-4 mb-8">
            {written.map((q) => (
              <WrittenCard
                key={q.id}
                q={q}
                text={(() => {
                  const a = answerByQ.get(q.id)
                  return a && 'text' in a.response ? a.response.text : ''
                })()}
                sourceBody={q.source_id ? sourceById.get(q.source_id)?.body : undefined}
                examinerMark={examinerMarks?.[q.id]}
              />
            ))}
          </div>
        </>
      )}

      {/* Objective — compact review rows */}
      {mcqs.length > 0 && (
        <>
          <div className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-hist-muted mb-2.5 px-0.5">
            Objective section · compact review
          </div>
          <div className="bg-white border border-hist-line rounded-2xl shadow-card px-5 py-2">
            {mcqs.map((q, i) => {
              const a = answerByQ.get(q.id)
              const chosen = a && 'choice' in a.response ? a.response.choice : null
              const correct = a?.is_correct === true
              const keyLetter =
                q.correct_index != null ? String.fromCharCode(65 + q.correct_index) : '?'
              return (
                <div
                  key={q.id}
                  className={`flex items-start gap-3 py-3 ${i < mcqs.length - 1 ? 'border-b border-hist-line' : ''}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-extrabold shrink-0 mt-0.5 ${
                      !a
                        ? 'bg-gray-100 text-gray-400'
                        : correct
                          ? 'bg-hist-green/15 text-hist-green'
                          : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {!a ? '–' : correct ? '✓' : '✗'}
                  </span>
                  <div className="min-w-0">
                    <span className="font-body text-[13.5px] text-hist-dark font-medium">
                      Q{q.position} · {q.prompt.split('\n')[0]}
                    </span>
                    <span className="block text-[11.5px] font-semibold text-hist-muted mt-0.5">
                      {!a
                        ? `not answered · correct: ${keyLetter}) ${q.options?.[q.correct_index ?? 0] ?? ''}`
                        : correct
                          ? `${keyLetter} · correct · +${q.marks}`
                          : `you said ${chosen != null ? String.fromCharCode(65 + chosen) : '—'} · correct: ${keyLetter}) ${q.options?.[q.correct_index ?? 0] ?? ''}`}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function WrittenCard({
  q,
  text,
  sourceBody,
  examinerMark,
}: {
  q: ResultQuestion
  text: string
  sourceBody?: string
  examinerMark?: ExaminerMark
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-hist-line rounded-2xl shadow-card p-5 sm:p-6"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-extrabold uppercase tracking-wide text-hist-gold">
          Q{q.position} · Section {q.section_label}
        </span>
        {examinerMark ? (
          <span
            className={`text-[12px] font-extrabold rounded-full px-3 py-1 ${
              examinerMark.marks >= q.marks
                ? 'text-hist-green bg-hist-green/10'
                : examinerMark.marks > 0
                  ? 'text-hist-indigo bg-hist-indigo-soft'
                  : 'text-red-500 bg-red-50'
            }`}
          >
            🖋️ {examinerMark.marks}/{q.marks}
          </span>
        ) : (
          <span className="text-[12px] font-extrabold text-hist-indigo bg-hist-indigo-soft rounded-full px-3 py-1">
            {q.marks} mark{q.marks > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {sourceBody && (
        <details className="mb-2">
          <summary className="text-[12px] font-bold text-hist-muted cursor-pointer">
            📜 Show source passage
          </summary>
          <p className="font-body text-[13px] text-hist-ink whitespace-pre-line leading-relaxed bg-hist-gold-soft/40 rounded-xl px-4 py-3 mt-2">
            {sourceBody}
          </p>
        </details>
      )}

      <h2 className="font-display text-[16.5px] font-semibold text-hist-dark leading-snug whitespace-pre-line mb-3.5">
        {q.prompt}
      </h2>

      <div className="mb-3">
        <span className="block text-[10.5px] font-extrabold uppercase tracking-wide text-hist-muted mb-1.5">
          Your answer
        </span>
        {text ? (
          <p className="font-body text-sm text-hist-ink whitespace-pre-line bg-hist-gold-soft/30 border border-hist-line rounded-xl px-4 py-3 leading-relaxed">
            {text}
          </p>
        ) : (
          <p className="font-body text-sm text-gray-400 italic bg-gray-50 rounded-xl px-4 py-3">
            Not answered
          </p>
        )}
      </div>

      {examinerMark?.comment && (
        <div className="mb-3">
          <span className="block text-[10.5px] font-extrabold uppercase tracking-wide text-hist-indigo mb-1.5">
            🖋️ Examiner's comment
          </span>
          <p className="font-body text-sm text-hist-ink bg-hist-indigo-soft/50 border-l-[3px] border-hist-indigo rounded-r-xl px-4 py-3 leading-relaxed whitespace-pre-line">
            {examinerMark.comment}
          </p>
        </div>
      )}

      {/* Neha (2026-07-27): scheme OR model answer, never both — two versions
          of "the right answer" under her comment confuse students. The
          point-by-point scheme wins; the model answer is the fallback. */}
      {q.scheme?.points && q.scheme.points.length > 0 && (
        <div className="mb-3">
          <span className="block text-[10.5px] font-extrabold uppercase tracking-wide text-hist-green mb-1.5">
            CBSE marking scheme — point by point
          </span>
          <div className="bg-hist-green/5 border border-hist-green/20 rounded-xl px-4 py-3 space-y-2">
            {q.scheme.points.map((p, i) => (
              <div key={i} className="flex items-start justify-between gap-3">
                <span className="font-body text-[13px] text-hist-ink leading-relaxed">
                  • {p.point}
                </span>
                {/* Neutral weight chip — the scheme states weights; only the
                    examiner awards marks (the green "+1" read as awarded). */}
                <b className="text-[11px] font-bold text-hist-muted bg-black/5 rounded-md px-2 py-0.5 shrink-0 whitespace-nowrap">
                  {p.marks} mark{p.marks > 1 ? 's' : ''}
                </b>
              </div>
            ))}
          </div>
        </div>
      )}

      {q.scheme?.model_answer && !(q.scheme?.points && q.scheme.points.length > 0) && (
        <details className="group">
          <summary className="text-[12.5px] font-bold text-hist-blue cursor-pointer">
            <span className="group-open:hidden">Show</span>
            <span className="hidden group-open:inline">Hide</span>
            {' '}model answer (full {q.marks} mark{q.marks > 1 ? 's' : ''})
          </summary>
          <p className="font-body text-[13px] text-hist-ink whitespace-pre-line leading-relaxed bg-hist-blue/5 border border-hist-blue/15 rounded-xl px-4 py-3 mt-2">
            {q.scheme.model_answer}
          </p>
        </details>
      )}
    </motion.div>
  )
}
