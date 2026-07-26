import { useEffect, useMemo, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAccess } from '../../components/auth/AccessProvider'
import { PurchaseSheet } from '../../components/purchase/PurchaseSheet'
import { getChapter as getBookChapter } from '../../data/books'
import { chapterKey } from '../../lib/contentIds'
import { testEngine, type ListResult, type PaperMeta, type AttemptMeta } from '../../lib/testEngine'

// Test Centre — aligned to mockups/launch-06-test-centre.html (2026-07-19
// mockup-alignment pass): breadcrumb, hero with stat pills, featured
// board-pattern paper card (position 1) + sectional grid, attempts table.
// Paid-only (decision #14): unentitled users see the teaser + purchase CTA;
// the server enforces the same gate on start. Mastery grid + percentile
// arrive with Sprint 5 marking data.
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

  const paperById = useMemo(
    () => new Map((data?.papers ?? []).map((p) => [p.id, p])),
    [data],
  )

  const submitted = useMemo(
    () =>
      (data?.attempts ?? [])
        .filter((a) => a.status === 'submitted')
        .sort((a, b) => (b.submitted_at ?? '').localeCompare(a.submitted_at ?? '')),
    [data],
  )

  // Examiner review chips per attempt (Milestone B).
  const reviewByAttempt = useMemo(
    () => new Map((data?.reviews ?? []).map((r) => [r.attempt_id, r.status])),
    [data],
  )
  const best = submitted.reduce<AttemptMeta | null>(
    (acc, a) =>
      acc === null || (a.objective_awarded ?? 0) > (acc.objective_awarded ?? 0) ? a : acc,
    null,
  )

  const [featured, ...rest] = data?.papers ?? []

  return (
    <div className="max-w-4xl mx-auto pb-10">
      {/* Breadcrumb lives in the workspace shell (Overview › Mock Tests) */}

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-[22px] shadow-card border border-hist-line px-7 py-6 mb-5 flex flex-col sm:flex-row sm:items-center gap-5 overflow-hidden"
      >
        <span
          className="absolute left-0 top-5 bottom-5 w-1 rounded-r"
          style={{ background: 'linear-gradient(#DC835F, #7E72C2)' }}
        />
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[1.5px] text-hist-gold mb-1.5">
            {book?.title ?? 'Chapter'}
          </span>
          <h1 className="font-display text-[26px] font-semibold text-hist-dark leading-tight mb-1">
            Mock Tests
          </h1>
          <p className="font-body text-[13.5px] font-medium text-hist-muted max-w-[48ch]">
            Real board-pattern papers, marked the way CBSE marks — with the official marking
            scheme on every answer you write.
          </p>
        </div>
        <div className="flex gap-3 shrink-0">
          <div className="bg-hist-gold-soft/50 border border-hist-line rounded-[14px] px-4 py-3 text-center min-w-[88px]">
            <b className="block font-display text-[22px] font-bold text-hist-dark leading-tight">
              {submitted.length}
            </b>
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-hist-muted">
              {submitted.length === 1 ? 'Attempt' : 'Attempts'}
            </span>
          </div>
          <div className="bg-hist-gold-soft/50 border border-hist-line rounded-[14px] px-4 py-3 text-center min-w-[88px]">
            <b className="block font-display text-[22px] font-bold text-hist-dark leading-tight">
              {best ? `${Number(best.objective_awarded ?? 0)}/${Number(best.objective_max ?? 0)}` : '—'}
            </b>
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-hist-muted">
              Best MCQ
            </span>
          </div>
        </div>
      </motion.div>

      {!entitled && (
        <div className="bg-hist-gold/10 border border-hist-gold/30 rounded-2xl p-5 mb-5">
          <div className="font-display font-bold text-hist-dark mb-1">
            🔒 Practice tests come with the chapter
          </div>
          <p className="font-body text-sm text-gray-600 mb-3">
            Unlock the chapter to attempt timed CBSE-pattern papers with instant MCQ
            marking and the marking scheme on every written answer.
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

      {data && data.papers.length > 0 && (
        <>
          <div className="flex items-baseline justify-between mb-3.5 px-0.5">
            <h2 className="font-display text-xl font-semibold text-hist-dark">Papers</h2>
            <span className="text-[12.5px] font-semibold text-hist-muted">
              Authored &amp; marking-schemed by a Senior CBSE Examiner
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {featured && (
              <PaperCard
                paper={featured}
                attempts={attemptsByPaper.get(featured.id) ?? []}
                entitled={entitled}
                featured
                onStart={() => navigate(`/chapter/${cid}/tests/${featured.id}/play`)}
                onLocked={() => setPurchaseOpen(true)}
              />
            )}
            {rest.map((paper) => (
              <PaperCard
                key={paper.id}
                paper={paper}
                attempts={attemptsByPaper.get(paper.id) ?? []}
                entitled={entitled}
                onStart={() => navigate(`/chapter/${cid}/tests/${paper.id}/play`)}
                onLocked={() => setPurchaseOpen(true)}
              />
            ))}
          </div>

          {/* Attempts table */}
          {submitted.length > 0 && (
            <div className="bg-white rounded-[20px] shadow-card border border-hist-line px-6 py-5">
              <h2 className="font-display text-xl font-semibold text-hist-dark mb-3">
                My attempts
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      {['Paper', 'When', 'Score', 'Status', ''].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10.5px] font-extrabold uppercase tracking-wider text-hist-muted px-2.5 py-2 border-b-2 border-hist-line"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {submitted.map((a, i) => {
                      const paper = paperById.get(a.paper_id)
                      const attemptNo =
                        submitted.filter((x) => x.paper_id === a.paper_id).length -
                        submitted.filter(
                          (x) =>
                            x.paper_id === a.paper_id &&
                            (x.submitted_at ?? '') > (a.submitted_at ?? ''),
                        ).length
                      return (
                        <tr key={a.id}>
                          <td className={`px-2.5 py-3 text-[13px] ${i < submitted.length - 1 ? 'border-b border-hist-line' : ''}`}>
                            <b className="text-hist-dark font-bold">{paper?.title ?? a.paper_id}</b>
                            <span className="block text-[11.5px] text-hist-muted font-semibold">
                              attempt {attemptNo}
                            </span>
                          </td>
                          <td className={`px-2.5 py-3 text-[13px] font-medium text-hist-ink ${i < submitted.length - 1 ? 'border-b border-hist-line' : ''}`}>
                            {new Date(a.submitted_at ?? a.started_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                            })}
                          </td>
                          <td className={`px-2.5 py-3 text-[13px] ${i < submitted.length - 1 ? 'border-b border-hist-line' : ''}`}>
                            <b className="text-hist-dark">
                              {Number(a.objective_awarded ?? 0)}/{Number(a.objective_max ?? 0)}
                            </b>{' '}
                            <span className="text-hist-muted font-semibold text-[11.5px]">objective</span>
                          </td>
                          <td className={`px-2.5 py-3 ${i < submitted.length - 1 ? 'border-b border-hist-line' : ''}`}>
                            {(() => {
                              // Honest status: only an examiner-marked attempt is
                              // "marked"; auto-marking covers MCQs alone.
                              const review = reviewByAttempt.get(a.id)
                              const chip = review === 'marked'
                                ? { label: '🖋️ Examiner-marked ✓', cls: 'bg-hist-green/10 text-hist-green' }
                                : review === 'paid'
                                  ? { label: 'With examiner', cls: 'bg-hist-indigo-soft text-hist-indigo' }
                                  : a.auto_submitted
                                    ? { label: '⏱ Time up', cls: 'bg-hist-orange/10 text-hist-orange' }
                                    : { label: 'MCQs marked', cls: 'bg-hist-green/10 text-hist-green' }
                              return (
                                <span
                                  className={`inline-flex items-center gap-1 text-[10.5px] font-extrabold uppercase px-2.5 py-1 rounded-full ${chip.cls}`}
                                >
                                  {chip.label}
                                </span>
                              )
                            })()}
                          </td>
                          <td className={`px-2.5 py-3 text-right ${i < submitted.length - 1 ? 'border-b border-hist-line' : ''}`}>
                            <button
                              className="font-display font-bold text-[13px] text-hist-dark bg-white border-[1.5px] border-hist-line rounded-[11px] px-4 py-2 btn-press hover:border-hist-blue/40"
                              onClick={() => navigate(`/chapter/${cid}/tests/result/${a.id}`)}
                            >
                              View feedback
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

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
  featured,
  onStart,
  onLocked,
}: {
  paper: PaperMeta
  attempts: AttemptMeta[]
  entitled: boolean
  featured?: boolean
  onStart: () => void
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
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-[18px] shadow-card p-5 ${
        featured
          ? 'sm:col-span-2 border-[1.5px] border-[#DED7F0]'
          : 'bg-white border border-hist-line'
      }`}
      style={featured ? { background: 'linear-gradient(150deg, #FFFDFB, #ECE8F8)' } : undefined}
    >
      <span
        className={`absolute right-4 top-4 text-[10.5px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full ${
          featured ? 'bg-hist-indigo text-white' : 'bg-hist-red/10 text-hist-red'
        }`}
      >
        {featured ? 'Board pattern' : 'Practice'}
      </span>
      <div className="flex items-center gap-2 pr-24">
        <h3 className="font-display text-[17px] font-semibold text-hist-dark">{paper.title}</h3>
        {paper.status === 'draft' && (
          <span className="text-[10px] font-bold uppercase text-white bg-gray-400 rounded-full px-2 py-0.5">
            Draft
          </span>
        )}
      </div>
      {paper.description && (
        <p className="font-body text-[12.5px] text-hist-muted font-medium mt-0.5">{paper.description}</p>
      )}
      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 mb-3.5 text-xs font-semibold text-hist-muted">
        <span>📝 {paper.question_count} questions</span>
        <span>🎯 {paper.total_marks} marks</span>
        <span>⏱ {paper.duration_minutes} min</span>
        <span>⚡ {paper.objective_marks} marks auto-marked instantly</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="font-body text-[12.5px] font-semibold text-hist-ink">
          {best ? (
            <>
              Best:{' '}
              <b className="font-display text-base text-hist-dark">
                {Number(best.objective_awarded ?? 0)}/{Number(best.objective_max ?? 0)}
              </b>{' '}
              objective · {submitted.length} attempt{submitted.length > 1 ? 's' : ''}
            </>
          ) : (
            'Not attempted'
          )}
        </div>
        {entitled ? (
          <button
            className="font-display font-bold text-white text-[13px] rounded-[11px] px-4 py-2.5 shadow-button btn-press shrink-0"
            style={{ backgroundColor: live ? '#5571B5' : featured ? '#7E72C2' : '#DC835F' }}
            onClick={onStart}
          >
            {live
              ? 'Resume →'
              : submitted.length
                ? `Start attempt ${submitted.length + 1} →`
                : 'Start →'}
          </button>
        ) : (
          <button
            className="font-display font-bold text-hist-dark text-[13px] bg-hist-gold/15 border border-hist-gold/40 rounded-[11px] px-4 py-2.5 btn-press shrink-0"
            onClick={onLocked}
          >
            🔒 Included with chapter
          </button>
        )}
      </div>
      {live && (
        <p className="mt-3 text-xs font-body text-hist-blue bg-hist-blue/10 rounded-lg px-3 py-2">
          Test in progress — the clock runs until{' '}
          {new Date(live.deadline).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
          .
        </p>
      )}
    </motion.div>
  )
}
