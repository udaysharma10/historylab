import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthContext } from '../../components/auth'
import {
  testEngine,
  type AttemptResult as AttemptResultData,
  type ResultQuestion,
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

  const [data, setData] = useState<AttemptResultData | null>(null)
  const [error, setError] = useState('')
  const [prevBest, setPrevBest] = useState<number | null>(null)

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
          Back to Test Centre
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
  const objPct = objMax > 0 ? objAwarded / objMax : 0
  const mcqs = questions.filter((q) => q.qtype === 'mcq')
  const written = questions.filter((q) => q.qtype === 'text')
  const firstName = (profile?.name || 'there').split(' ')[0]
  const delta = prevBest !== null ? objAwarded - prevBest : null

  // Per-section objective bars (Sprint 5 adds written marks to these).
  const sections = [...new Set(questions.map((q) => q.section_label))].map((label) => {
    const qs = questions.filter((q) => q.section_label === label && q.qtype === 'mcq')
    const max = qs.reduce((s, q) => s + q.marks, 0)
    const got = qs.reduce((s, q) => s + Number(answerByQ.get(q.id)?.marks_awarded ?? 0), 0)
    return { label, got, max }
  }).filter((s) => s.max > 0)

  const RING_C = 2 * Math.PI * 47
  const headline =
    delta !== null && delta > 0
      ? `Your best yet, ${firstName} — ${objAwarded}/${objMax}`
      : `${firstName}, you scored ${objAwarded}/${objMax} on objective`

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Breadcrumb */}
      <div className="text-[12.5px] font-semibold text-hist-muted mb-3.5 px-0.5">
        <Link to={`/chapter/${cid}/tests`} className="hover:text-hist-dark">Test Centre</Link>
        <span className="mx-1.5">·</span>
        <b className="text-hist-dark">{paper.title}</b>
      </div>

      {/* Score hero (launch-08) */}
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
              strokeDashoffset={RING_C * (1 - objPct)}
            />
            <defs>
              <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DC835F" />
                <stop offset="1" stopColor="#7E72C2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <b className="block font-display text-[19px] font-bold text-hist-dark leading-none">
              {objAwarded}/{objMax}
            </b>
            <span className="text-[11px] font-extrabold text-hist-muted">
              {Math.round(objPct * 100)}%
            </span>
          </div>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="font-display text-[22px] font-semibold text-hist-dark leading-tight mb-1">
            {headline}
          </h1>
          <div className="text-[12.5px] font-semibold text-hist-muted mb-3">
            Submitted{' '}
            {new Date(attempt.submitted_at).toLocaleString('en-IN', {
              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
            })}
            {attempt.auto_submitted && ' · auto-submitted when time ran out'}
            {' '}· objective marked instantly
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {delta !== null && (
              <span className={`flex items-center gap-1.5 border px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold ${
                delta > 0
                  ? 'bg-hist-green/10 border-hist-green/20 text-hist-green'
                  : 'bg-hist-gold-soft/60 border-hist-line text-hist-ink'
              }`}>
                📈 <b>{delta > 0 ? `+${delta}` : delta === 0 ? 'level' : delta} vs previous best</b>
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-hist-gold-soft/60 border border-hist-line px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold text-hist-ink">
              🎯 <b className="text-hist-dark">MCQ: {objAwarded}/{objMax}</b>
            </span>
            {written.length > 0 && (
              <span className="flex items-center gap-1.5 bg-hist-indigo-soft border border-[#DED7F0] px-3 py-1.5 rounded-[11px] text-[12.5px] font-semibold text-hist-indigo">
                ✍️ <b>{written.length} written · check the scheme below</b>
              </span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Section bars */}
      {sections.length > 1 && (
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
                    style={{ width: `${s.max ? (s.got / s.max) * 100 : 0}%`, backgroundColor: color }}
                  />
                </div>
                <span className="text-[11px] font-bold text-hist-muted">
                  {s.got}/{s.max} objective
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
          Test Centre
        </button>
        <button
          className="font-display font-bold text-hist-dark bg-hist-gold-soft rounded-[11px] px-4 py-2.5 text-[13px] btn-press"
          onClick={() => navigate(`/chapter/${cid}/tests/${paper.id}/play`)}
        >
          Attempt again
        </button>
      </div>

      {/* Written answers — rich per-question cards */}
      {written.length > 0 && (
        <>
          <div className="text-[11px] font-extrabold uppercase tracking-[1.2px] text-hist-muted mb-2.5 px-0.5">
            Written answers · check yourself against the CBSE marking scheme
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
}: {
  q: ResultQuestion
  text: string
  sourceBody?: string
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
        <span className="text-[12px] font-extrabold text-hist-indigo bg-hist-indigo-soft rounded-full px-3 py-1">
          {q.marks} mark{q.marks > 1 ? 's' : ''}
        </span>
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
                <b className="text-[12px] font-extrabold text-hist-green shrink-0">+{p.marks}</b>
              </div>
            ))}
          </div>
        </div>
      )}

      {q.scheme?.model_answer && (
        <details>
          <summary className="text-[12.5px] font-bold text-hist-blue cursor-pointer">
            Show model answer (full {q.marks} mark{q.marks > 1 ? 's' : ''})
          </summary>
          <p className="font-body text-[13px] text-hist-ink whitespace-pre-line leading-relaxed bg-hist-blue/5 border border-hist-blue/15 rounded-xl px-4 py-3 mt-2">
            {q.scheme.model_answer}
          </p>
        </details>
      )}
    </motion.div>
  )
}
