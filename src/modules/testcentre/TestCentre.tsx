import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccess } from '../../components/auth/AccessProvider'
import { PurchaseSheet } from '../../components/purchase/PurchaseSheet'
import { getChapter as getBookChapter } from '../../data/books'
import { chapterKey } from '../../lib/contentIds'
import { testEngine, type ListResult, type PaperMeta, type AttemptMeta } from '../../lib/testEngine'

// Sprint 4: Test Centre — the chapter's CBSE-pattern papers + attempt history.
// The engine is paid-only (decision #14): preview users see the list as a
// teaser with a purchase CTA; the server enforces the same gate on start.
export function TestCentre() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const { canAccessChapter, products } = useAccess()
  const book = getBookChapter('history-10', cid)
  const product = products.find((p) => p.id === chapterKey(cid))
  const entitled = canAccessChapter(cid)

  const [data, setData] = useState<ListResult | null>(null)
  const [error, setError] = useState('')
  const [purchaseOpen, setPurchaseOpen] = useState(false)

  const load = useCallback(() => {
    testEngine
      .list(chapterKey(cid))
      .then(setData)
      .catch((e) => setError(e.message || 'Could not load papers'))
  }, [cid])

  useEffect(load, [load])

  const attemptsByPaper = useMemo(() => {
    const map = new Map<string, AttemptMeta[]>()
    for (const a of data?.attempts ?? []) {
      const list = map.get(a.paper_id) ?? []
      list.push(a)
      map.set(a.paper_id, list)
    }
    return map
  }, [data])

  return (
    <div className="max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-hist-dark">
            📝 Test Centre
          </h1>
          <p className="font-body text-sm text-gray-500 mt-1">
            Board-pattern practice papers for {book?.title ?? 'this chapter'} — timed, with the
            official CBSE marking scheme.
          </p>
        </div>

        {!entitled && (
          <div className="bg-hist-gold/10 border border-hist-gold/30 rounded-2xl p-5 mb-6">
            <div className="font-display font-bold text-hist-dark mb-1">
              🔒 Practice tests come with the chapter
            </div>
            <p className="font-body text-sm text-gray-600 mb-3">
              Unlock the chapter to attempt timed CBSE-pattern papers with instant objective
              marking and detailed marking schemes for every written answer.
            </p>
            {product && !product.is_free && (
              <button
                className="font-display font-bold text-white rounded-xl px-5 py-2.5 shadow-button btn-press"
                style={{ backgroundColor: '#C05F35' }}
                onClick={() => setPurchaseOpen(true)}
              >
                Unlock chapter · ₹{(product.price_paise / 100).toFixed(0)}
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-center text-sm font-body text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-4">
            {error}
          </p>
        )}

        {!data && !error && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3 animate-float">📝</div>
            <p className="text-gray-400 font-body text-sm">Loading papers…</p>
          </div>
        )}

        {data && data.papers.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🗓️</div>
            <p className="font-body text-sm text-gray-500">
              Papers for this chapter are being prepared by our Senior CBSE Examiner. Check back
              soon.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {data?.papers.map((paper) => (
            <PaperCard
              key={paper.id}
              paper={paper}
              attempts={attemptsByPaper.get(paper.id) ?? []}
              entitled={entitled}
              onStart={() => navigate(`/chapter/${cid}/tests/${paper.id}/play`)}
              onResult={(attemptId) => navigate(`/chapter/${cid}/tests/result/${attemptId}`)}
              onLocked={() => setPurchaseOpen(true)}
            />
          ))}
        </div>
      </motion.div>

      {product && book && (
        <PurchaseSheet
          product={product}
          chapterTitle={book.title}
          open={purchaseOpen}
          onClose={() => setPurchaseOpen(false)}
        />
      )}
    </div>
  )
}

function PaperCard({
  paper,
  attempts,
  entitled,
  onStart,
  onResult,
  onLocked,
}: {
  paper: PaperMeta
  attempts: AttemptMeta[]
  entitled: boolean
  onStart: () => void
  onResult: (attemptId: string) => void
  onLocked: () => void
}) {
  const live = attempts.find((a) => a.status === 'in_progress')
  const submitted = attempts.filter((a) => a.status === 'submitted')
  const best = submitted.reduce<AttemptMeta | null>(
    (acc, a) =>
      acc === null || (a.objective_awarded ?? 0) > (acc.objective_awarded ?? 0) ? a : acc,
    null,
  )

  return (
    <motion.div
      className="bg-white rounded-2xl border border-hist-line shadow-card p-5"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-hist-dark">{paper.title}</h3>
            {paper.status === 'draft' && (
              <span className="text-[10px] font-bold uppercase text-white bg-gray-400 rounded-full px-2 py-0.5">
                Draft
              </span>
            )}
          </div>
          {paper.description && (
            <p className="font-body text-sm text-gray-500 mt-0.5">{paper.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs font-body text-gray-500">
            <span>🕐 {paper.duration_minutes} min</span>
            <span>✍️ {paper.question_count} questions</span>
            <span>💯 {paper.total_marks} marks</span>
            <span>⚡ {paper.objective_marks} objective (instant marks)</span>
          </div>
        </div>
        <div className="shrink-0">
          {entitled ? (
            <button
              className="font-display font-bold text-white rounded-xl px-4 py-2.5 shadow-button btn-press text-sm"
              style={{ backgroundColor: live ? '#5571B5' : '#C05F35' }}
              onClick={onStart}
            >
              {live ? 'Resume →' : submitted.length ? 'Attempt again' : 'Start test'}
            </button>
          ) : (
            <button
              className="font-display font-bold text-hist-dark bg-hist-gold/15 border border-hist-gold/40 rounded-xl px-4 py-2.5 text-sm btn-press"
              onClick={onLocked}
            >
              🔒 Unlock
            </button>
          )}
        </div>
      </div>

      {live && (
        <p className="mt-3 text-xs font-body text-hist-blue bg-hist-blue/10 rounded-lg px-3 py-2">
          You have a test in progress — the clock is running until{' '}
          {new Date(live.deadline).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          .
        </p>
      )}

      {submitted.length > 0 && (
        <div className="mt-4 border-t border-hist-line pt-3">
          <div className="text-[11px] font-bold uppercase text-gray-400 mb-2">
            Your attempts {best && (
              <span className="normal-case font-body font-normal">
                · best objective score {Number(best.objective_awarded ?? 0)}/{Number(best.objective_max ?? 0)}
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {submitted.map((a) => (
              <button
                key={a.id}
                className="w-full flex items-center justify-between text-left text-sm font-body bg-hist-gold-soft/40 hover:bg-hist-gold-soft rounded-lg px-3 py-2 transition-colors"
                onClick={() => onResult(a.id)}
              >
                <span className="text-gray-600">
                  {new Date(a.submitted_at ?? a.started_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  ·{' '}
                  {new Date(a.submitted_at ?? a.started_at).toLocaleTimeString('en-IN', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {a.auto_submitted && (
                    <span className="text-orange-500 ml-1.5">⏱ time up</span>
                  )}
                </span>
                <span className="font-bold text-hist-dark">
                  {Number(a.objective_awarded ?? 0)}/{Number(a.objective_max ?? 0)} objective →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
