import { useEffect, useMemo, useState } from 'react'
import {
  testEngine,
  type QueueReview,
  type ReviewDetail,
  type ExaminerMark,
} from '../../lib/testEngine'

// Examiner queue (Milestone B, decision #39) — Neha marks paid attempts by
// hand: per written question, marks (half-mark steps up to the maximum) and an
// optional comment; one optional overall note. Save keeps a draft; Publish
// requires every written question marked and is re-runnable (silent edits).
// Oldest paid submissions first — the 72-hour promise starts at payment.

export function ExaminerQueue() {
  const [queue, setQueue] = useState<QueueReview[] | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)
  const [error, setError] = useState('')
  // Captured once — "waiting Nd" chips don't need to tick live.
  const [now] = useState(() => Date.now())

  const loadQueue = () => {
    testEngine
      .reviewQueue()
      .then((r) => setQueue(r.reviews))
      .catch((e) => setError(e.message || 'Could not load the queue'))
  }
  useEffect(loadQueue, [])

  if (error) return <p className="font-body text-sm text-red-500">{error}</p>
  if (!queue) return <p className="font-body text-sm text-gray-400">Loading queue…</p>

  if (openId) {
    return (
      <ReviewWorkbench
        reviewId={openId}
        onBack={() => {
          setOpenId(null)
          loadQueue()
        }}
      />
    )
  }

  const pending = queue.filter((r) => r.status === 'paid')
  const done = queue.filter((r) => r.status === 'marked')

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-display text-lg font-bold text-hist-dark">Examiner queue</h2>
        <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-hist-indigo-soft text-hist-indigo">
          {pending.length} waiting
        </span>
      </div>

      {pending.length === 0 && (
        <p className="font-body text-sm text-gray-400 mb-6">
          Nothing waiting — new paid submissions appear here, oldest first.
        </p>
      )}

      <div className="space-y-2.5 mb-8">
        {pending.map((r) => (
          <QueueRow key={r.id} r={r} now={now} onOpen={() => setOpenId(r.id)} cta="Mark this paper" />
        ))}
      </div>

      {done.length > 0 && (
        <>
          <h3 className="font-display font-bold text-sm text-gray-500 uppercase tracking-wide mb-3">
            Marked ({done.length})
          </h3>
          <div className="space-y-2.5">
            {done.map((r) => (
              <QueueRow key={r.id} r={r} now={now} onOpen={() => setOpenId(r.id)} cta="Edit marks" />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function QueueRow({
  r,
  now,
  onOpen,
  cta,
}: {
  r: QueueReview
  now: number
  onOpen: () => void
  cta: string
}) {
  const waitingDays = Math.floor((now - new Date(r.created_at).getTime()) / 86_400_000)
  return (
    <div className="bg-white rounded-2xl shadow-card px-5 py-4 flex items-center gap-4 flex-wrap">
      <div className="flex-1 min-w-[220px]">
        <b className="block font-display text-[14.5px] font-semibold text-hist-dark">
          {r.paper_title}
        </b>
        <span className="font-body text-[12px] font-semibold text-hist-muted">
          {r.student_name} · {r.student_email} · MCQ {Number(r.objective_awarded ?? 0)}/
          {Number(r.objective_max ?? 0)}
        </span>
      </div>
      {r.status === 'paid' && (
        <span
          className={`text-[10.5px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
            waitingDays >= 2 ? 'bg-red-50 text-red-500' : 'bg-hist-gold-soft text-hist-ink'
          }`}
        >
          waiting {waitingDays === 0 ? '< 1 day' : `${waitingDays}d`}
        </span>
      )}
      <button
        className="font-display font-bold text-[13px] text-white rounded-[11px] px-4 py-2.5 btn-press"
        style={{ backgroundColor: r.status === 'paid' ? '#7E72C2' : '#8A8296' }}
        onClick={onOpen}
      >
        {cta}
      </button>
    </div>
  )
}

// ── The marking workbench ────────────────────────────────────────────────
function ReviewWorkbench({ reviewId, onBack }: { reviewId: string; onBack: () => void }) {
  const [detail, setDetail] = useState<ReviewDetail | null>(null)
  const [marks, setMarks] = useState<Record<string, { marks: string; comment: string }>>({})
  const [overall, setOverall] = useState('')
  const [busy, setBusy] = useState<'save' | 'publish' | null>(null)
  const [note, setNote] = useState('')

  useEffect(() => {
    testEngine
      .reviewGet(reviewId)
      .then((d) => {
        setDetail(d)
        const initial: Record<string, { marks: string; comment: string }> = {}
        for (const q of d.questions) {
          if (q.qtype !== 'text') continue
          const existing = d.review.marks?.[q.id]
          initial[q.id] = {
            marks: existing ? String(existing.marks) : '',
            comment: existing?.comment ?? '',
          }
        }
        setMarks(initial)
        setOverall(d.review.overall_comment ?? '')
      })
      .catch((e) => setNote(e.message || 'Could not load the paper'))
  }, [reviewId])

  const written = useMemo(
    () => (detail?.questions ?? []).filter((q) => q.qtype === 'text'),
    [detail],
  )
  const answerByQ = useMemo(
    () => new Map((detail?.answers ?? []).map((a) => [a.question_id, a])),
    [detail],
  )
  const sourceById = useMemo(
    () => new Map((detail?.sources ?? []).map((s) => [s.source_id, s])),
    [detail],
  )

  if (!detail) return <p className="font-body text-sm text-gray-400">{note || 'Loading paper…'}</p>

  const payload = (): Record<string, ExaminerMark> | string => {
    const out: Record<string, ExaminerMark> = {}
    for (const q of written) {
      const entry = marks[q.id]
      if (!entry || entry.marks === '') continue
      const m = Number(entry.marks)
      if (!Number.isFinite(m) || m < 0 || m > q.marks || Math.round(m * 2) !== m * 2) {
        return `Q${q.position}: marks must be 0–${q.marks} in half-mark steps`
      }
      out[q.id] = entry.comment.trim()
        ? { marks: m, comment: entry.comment.trim() }
        : { marks: m }
    }
    return out
  }

  const submit = async (publish: boolean) => {
    const p = payload()
    if (typeof p === 'string') {
      setNote(p)
      return
    }
    if (publish && Object.keys(p).length < written.length) {
      setNote('Every written question needs marks before publishing.')
      return
    }
    setBusy(publish ? 'publish' : 'save')
    setNote('')
    try {
      const fn = publish ? testEngine.reviewPublish : testEngine.reviewSave
      await fn(reviewId, p, overall)
      setNote(publish ? 'Published — the student sees these marks now.' : 'Draft saved.')
      if (publish) setDetail({ ...detail, review: { ...detail.review, status: 'marked' } })
    } catch (e) {
      setNote((e as Error).message || 'Save failed')
    } finally {
      setBusy(null)
    }
  }

  const totalGiven = written.reduce((s, q) => {
    const m = Number(marks[q.id]?.marks)
    return s + (Number.isFinite(m) ? m : 0)
  }, 0)
  const writtenMax = written.reduce((s, q) => s + q.marks, 0)

  return (
    <div>
      <button
        className="text-gray-400 font-body text-sm mb-4 flex items-center gap-1 hover:text-hist-dark"
        onClick={onBack}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        Back to queue
      </button>

      <div className="bg-white rounded-2xl shadow-card px-5 py-4 mb-5">
        <b className="block font-display text-[16px] font-semibold text-hist-dark">
          {detail.paper.title}
        </b>
        <span className="font-body text-[12.5px] font-semibold text-hist-muted">
          {detail.student_name} · {detail.student_email} · MCQ auto-marked{' '}
          {Number(detail.attempt.objective_awarded)}/{Number(detail.attempt.objective_max)} · your
          written marks {totalGiven}/{writtenMax}
          {detail.review.status === 'marked' && ' · PUBLISHED (edits go live on re-publish)'}
        </span>
      </div>

      <div className="space-y-4 mb-6">
        {written.map((q) => {
          const a = answerByQ.get(q.id)
          const text = a && 'text' in a.response ? a.response.text : ''
          const src = q.source_id ? sourceById.get(q.source_id) : null
          return (
            <div key={q.id} className="bg-white rounded-2xl shadow-card p-5">
              <div className="flex items-center justify-between mb-2 gap-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-hist-gold">
                  Q{q.position} · Section {q.section_label}
                </span>
                <label className="flex items-center gap-2 text-[12px] font-bold text-hist-dark">
                  Marks
                  <input
                    type="number"
                    min={0}
                    max={q.marks}
                    step={0.5}
                    value={marks[q.id]?.marks ?? ''}
                    onChange={(e) =>
                      setMarks((m) => ({
                        ...m,
                        [q.id]: { ...(m[q.id] ?? { comment: '' }), marks: e.target.value },
                      }))
                    }
                    className="w-[72px] border-[1.5px] border-hist-line rounded-lg px-2.5 py-1.5 text-right font-display font-bold"
                  />
                  / {q.marks}
                </label>
              </div>

              <p className="font-display text-[15px] font-semibold text-hist-dark leading-snug whitespace-pre-line mb-3">
                {q.prompt}
              </p>

              {src && (
                <details className="mb-2">
                  <summary className="text-[12px] font-bold text-hist-muted cursor-pointer">
                    📜 Source passage
                  </summary>
                  <p className="font-body text-[13px] text-hist-ink whitespace-pre-line bg-hist-gold-soft/40 rounded-xl px-4 py-3 mt-2">
                    {src.body}
                  </p>
                </details>
              )}

              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div>
                  <span className="block text-[10.5px] font-extrabold uppercase tracking-wide text-hist-muted mb-1.5">
                    Student's answer
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
                <div>
                  <span className="block text-[10.5px] font-extrabold uppercase tracking-wide text-hist-green mb-1.5">
                    Marking scheme
                  </span>
                  <div className="bg-hist-green/5 border border-hist-green/15 rounded-xl px-4 py-3">
                    {q.scheme?.points?.length ? (
                      <ul className="space-y-1">
                        {q.scheme.points.map((p, i) => (
                          <li key={i} className="font-body text-[12.5px] text-hist-ink flex justify-between gap-2">
                            <span>• {p.point}</span>
                            <b className="text-hist-green shrink-0">+{p.marks}</b>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-[12.5px] text-hist-ink whitespace-pre-line">
                        {q.scheme?.model_answer || 'No scheme authored.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <textarea
                placeholder="Comment for the student (optional) — what earned marks, what was missing…"
                value={marks[q.id]?.comment ?? ''}
                onChange={(e) =>
                  setMarks((m) => ({
                    ...m,
                    [q.id]: { ...(m[q.id] ?? { marks: '' }), comment: e.target.value },
                  }))
                }
                rows={2}
                className="w-full border-[1.5px] border-hist-line rounded-xl px-3.5 py-2.5 font-body text-sm resize-y"
              />
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-card p-5 mb-5">
        <span className="block text-[10.5px] font-extrabold uppercase tracking-wide text-hist-indigo mb-1.5">
          Overall note to the student (optional)
        </span>
        <textarea
          value={overall}
          onChange={(e) => setOverall(e.target.value)}
          rows={3}
          placeholder="Overall impression, board technique advice, what to revise…"
          className="w-full border-[1.5px] border-hist-line rounded-xl px-3.5 py-2.5 font-body text-sm resize-y"
        />
      </div>

      {note && <p className="font-body text-sm font-semibold text-hist-indigo mb-3">{note}</p>}

      <div className="flex gap-3">
        <button
          className="font-display font-bold text-hist-dark bg-white border-[1.5px] border-hist-line rounded-xl px-5 py-2.5 btn-press disabled:opacity-50"
          disabled={busy !== null}
          onClick={() => submit(false)}
        >
          {busy === 'save' ? 'Saving…' : 'Save draft'}
        </button>
        <button
          className="font-display font-bold text-white rounded-xl px-6 py-2.5 shadow-button btn-press disabled:opacity-50"
          style={{ backgroundColor: '#7E72C2' }}
          disabled={busy !== null}
          onClick={() => submit(true)}
        >
          {busy === 'publish'
            ? 'Publishing…'
            : detail.review.status === 'marked'
              ? 'Re-publish edits'
              : 'Publish marks to student'}
        </button>
      </div>
    </div>
  )
}
