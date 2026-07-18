import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { testEngine, type AttemptResult as AttemptResultData } from '../../lib/testEngine'

// Sprint 4: results view for a submitted attempt. Objective questions show
// instant marks with the key revealed; written answers show the official
// marking scheme for self-check until AI marking lands in Sprint 5.
export function AttemptResult() {
  const navigate = useNavigate()
  const { chapterId, attemptId } = useParams<{ chapterId: string; attemptId: string }>()
  const cid = chapterId || 'ch1'

  const [data, setData] = useState<AttemptResultData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!attemptId) return
    testEngine
      .result(attemptId)
      .then(setData)
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
  const objPct = objMax > 0 ? Math.round((objAwarded / objMax) * 100) : 0
  const writtenCount = questions.filter((q) => q.qtype === 'text').length

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Score summary */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-hist-line rounded-2xl shadow-card p-6 mb-6 text-center"
      >
        <div className="text-4xl mb-2">{objPct >= 80 ? '🏆' : objPct >= 50 ? '💪' : '📚'}</div>
        <h1 className="font-display text-xl font-bold text-hist-dark">{paper.title}</h1>
        <p className="font-body text-xs text-gray-400 mt-0.5 mb-4">
          Submitted{' '}
          {new Date(attempt.submitted_at).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          })}
          {attempt.auto_submitted && ' · auto-submitted when time ran out'}
        </p>
        <div className="flex items-center justify-center gap-6">
          <div>
            <div className="font-display text-3xl font-bold text-hist-dark">
              {objAwarded}
              <span className="text-lg text-gray-400">/{objMax}</span>
            </div>
            <div className="text-[11px] font-bold uppercase text-gray-400 mt-1">
              Objective · instant
            </div>
          </div>
          {writtenCount > 0 && (
            <div>
              <div className="font-display text-3xl font-bold text-hist-muted">✍️</div>
              <div className="text-[11px] font-bold uppercase text-gray-400 mt-1">
                {writtenCount} written · self-check below
              </div>
            </div>
          )}
        </div>
        {writtenCount > 0 && (
          <p className="font-body text-xs text-gray-500 bg-hist-gold-soft/50 rounded-lg px-3 py-2 mt-4">
            Compare your written answers with the official marking scheme below — point by point,
            exactly how the board examiner awards marks.
          </p>
        )}
        <div className="flex justify-center gap-2 mt-5">
          <button
            className="font-display font-bold text-white rounded-xl px-4 py-2.5 text-sm shadow-button btn-press"
            style={{ backgroundColor: '#5571B5' }}
            onClick={() => navigate(`/chapter/${cid}/tests`)}
          >
            Test Centre
          </button>
          <button
            className="font-display font-bold text-hist-dark bg-hist-gold-soft rounded-xl px-4 py-2.5 text-sm btn-press"
            onClick={() => navigate(`/chapter/${cid}/tests/${paper.id}/play`)}
          >
            Attempt again
          </button>
        </div>
      </motion.div>

      {/* Per-question review */}
      <div className="space-y-4">
        {questions.map((q) => {
          const ans = answerByQ.get(q.id)
          const source = q.source_id ? sourceById.get(q.source_id) : undefined
          const isMcq = q.qtype === 'mcq'
          const chosen = ans && 'choice' in ans.response ? ans.response.choice : null
          const text = ans && 'text' in ans.response ? ans.response.text : ''

          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-hist-line rounded-2xl shadow-card p-5"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase text-hist-blue bg-hist-blue/10 rounded-full px-2.5 py-1">
                    Section {q.section_label}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">
                    Q{q.position} · {q.marks} mark{q.marks > 1 ? 's' : ''}
                  </span>
                </div>
                {isMcq && (
                  <span
                    className={`text-[11px] font-bold rounded-full px-2.5 py-1 ${
                      !ans
                        ? 'bg-gray-100 text-gray-400'
                        : ans.is_correct
                          ? 'bg-hist-green/15 text-hist-green'
                          : 'bg-red-50 text-red-500'
                    }`}
                  >
                    {!ans ? 'Not answered · 0' : ans.is_correct ? `✓ +${q.marks}` : '✗ 0'}
                  </span>
                )}
              </div>

              {source && (
                <div className="bg-hist-gold-soft/50 border-l-4 border-hist-gold rounded-r-xl px-4 py-3 mb-3">
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

              <p className="font-body text-[15px] text-hist-dark leading-relaxed whitespace-pre-line mb-3">
                {q.prompt}
              </p>

              {isMcq && q.options ? (
                <div className="space-y-2">
                  {q.options.map((opt, i) => {
                    const isKey = q.correct_index === i
                    const isChosen = chosen === i
                    return (
                      <div
                        key={i}
                        className={`font-body text-sm rounded-xl border-2 px-4 py-2.5 ${
                          isKey
                            ? 'border-hist-green bg-hist-green/10 text-hist-dark font-semibold'
                            : isChosen
                              ? 'border-red-300 bg-red-50 text-hist-dark'
                              : 'border-hist-line text-gray-500'
                        }`}
                      >
                        <span className="font-display font-bold mr-2">
                          {String.fromCharCode(97 + i)})
                        </span>
                        {opt}
                        {isKey && <span className="ml-2 text-hist-green text-xs">✓ correct</span>}
                        {isChosen && !isKey && (
                          <span className="ml-2 text-red-400 text-xs">your answer</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-gray-400 mb-1">
                      Your answer
                    </div>
                    {text ? (
                      <p className="font-body text-sm text-hist-ink whitespace-pre-line bg-hist-gold-soft/30 rounded-xl px-4 py-3 leading-relaxed">
                        {text}
                      </p>
                    ) : (
                      <p className="font-body text-sm text-gray-400 italic bg-gray-50 rounded-xl px-4 py-3">
                        Not answered
                      </p>
                    )}
                  </div>
                  {q.scheme?.model_answer && (
                    <div>
                      <div className="text-[11px] font-bold uppercase text-hist-green mb-1">
                        ✅ Marking scheme
                      </div>
                      <div className="bg-hist-green/5 border border-hist-green/20 rounded-xl px-4 py-3">
                        <p className="font-body text-sm text-hist-ink whitespace-pre-line leading-relaxed">
                          {q.scheme.model_answer}
                        </p>
                        {q.scheme.points && q.scheme.points.length > 0 && (
                          <ul className="mt-2 space-y-1">
                            {q.scheme.points.map((p, i) => (
                              <li
                                key={i}
                                className="font-body text-xs text-hist-ink flex justify-between gap-3"
                              >
                                <span>• {p.point}</span>
                                <span className="font-bold text-hist-green shrink-0">
                                  {p.marks} mk
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
