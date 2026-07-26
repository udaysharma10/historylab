import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useProgressStore } from '../store/useProgressStore'
import { useAuthContext } from '../components/auth'
import { useAccess } from '../components/auth/AccessProvider'
import { PurchaseSheet } from '../components/purchase/PurchaseSheet'
import { chapterKey } from '../lib/contentIds'
import { testEngine, type PaperMeta, type AttemptMeta } from '../lib/testEngine'
import {
  getChapter,
  getChapterPreview,
  getKeyDates,
  getFlashcards,
  getFigures,
  getMapIdentifyActivities,
  getMapLabelActivities,
  CHAPTER_SECTION_COLORS,
  CHAPTER_SECTION_ICONS,
} from '../data/getChapter'

// Chapter home — decision #34 (locked 2026-07-20, mockups revamp-01 v4 +
// revamp-01b): breadcrumb → slim hero (ring says "% chapter done") → numbered
// loop bands: 1 Learn (bar only on in-progress sections) · 2 Test yourself
// (paid: dark band, one giant CTA / preview: warm unlock band) · 3 Revise
// tools (paid: payload mini-cards / preview: greyed 🔒). Rules: each fact
// once; test facts live only in the Test band; "MCQ marks" never "objective".
export function HomePage() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const { profile } = useAuthContext()
  const { products, canAccessChapter } = useAccess()
  const [sheetOpen, setSheetOpen] = useState(false)
  const cid = chapterId || 'ch1'
  const totalStars = useProgressStore((s) => s.totalStars)
  const progressSections = useProgressStore((s) => s.chapters[cid]) ?? {}
  const completedSubsections = useProgressStore((s) => s.completedSubsections)

  const chapter = getChapter(cid)
  const previewSection = getChapterPreview(cid)
  const entitled = canAccessChapter(cid)
  const product = products.find((p) => p.id === chapterKey(cid))
  const basePath = `/chapter/${cid}`
  const sectionColors = CHAPTER_SECTION_COLORS[cid] || {}
  const sectionIcons = CHAPTER_SECTION_ICONS[cid] || {}

  // Test band data (entitled users only) — papers + attempts drive the stat
  // line and the recommended-paper CTA.
  const [papers, setPapers] = useState<PaperMeta[]>([])
  const [attempts, setAttempts] = useState<AttemptMeta[]>([])
  useEffect(() => {
    if (!entitled) return
    let cancelled = false
    testEngine
      .list(chapterKey(cid))
      .then((res) => {
        if (cancelled) return
        setPapers(res.papers.filter((p) => p.status === 'published'))
        setAttempts(res.attempts)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [cid, entitled])

  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-xl font-bold text-hist-dark mb-2">Chapter Not Found</h2>
          <button className="text-hist-blue underline font-body" onClick={() => navigate('/')}>Back to Home</button>
        </div>
      </div>
    )
  }

  // Progress: topics + section quiz as one unit each (decision #29); preview
  // trim keeps the whole-chapter denominator via topicCount.
  const sectionUnits = (section: (typeof chapter.sections)[number]) => {
    const topicsDone = section.subsections.filter((sub) => completedSubsections[sub.id]).length
    const quiz = progressSections[section.id]
    // Quiz unit = at least one completed quiz round in this section. (NOT
    // completed>=total: setSectionTotal has no callers so total is always 0 —
    // that check made 5/5 unreachable. Found in the 2026-07-26 code review;
    // A-fix #1, approved by Uday.)
    const quizDone = !!quiz && quiz.completed >= 1
    const topicTotal = section.subsections.length || section.topicCount || 0
    return { done: topicsDone + (quizDone ? 1 : 0), total: topicTotal + 1 }
  }
  const overall = chapter.sections.reduce(
    (acc, s) => {
      const u = sectionUnits(s)
      return { done: acc.done + u.done, total: acc.total + u.total }
    },
    { done: 0, total: 0 },
  )
  const overallProgress = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0

  const firstName = (profile?.name || 'there').split(' ')[0]

  // Test-band derived state
  const submitted = attempts.filter((a) => a.status === 'submitted')
  const live = attempts.find((a) => a.status === 'in_progress')
  const best = submitted.reduce<AttemptMeta | null>(
    (acc, a) =>
      acc === null || (a.objective_awarded ?? 0) > (acc.objective_awarded ?? 0) ? a : acc,
    null,
  )
  // Recommendation: resume a live attempt; otherwise the least-attempted
  // published paper (ties → lowest position).
  const recommended = live
    ? papers.find((p) => p.id === live.paper_id)
    : [...papers].sort((a, b) => {
        const at = submitted.filter((x) => x.paper_id === a.id).length
        const bt = submitted.filter((x) => x.paper_id === b.id).length
        return at - bt || a.position - b.position
      })[0]

  // Tool payloads (real counts; trimmed bundles make these preview-safe
  // because preview users see the locked variant anyway).
  const tools = [
    { id: 'timeline', label: 'Timeline', icon: '📅', bg: '#E9ECF8', route: `${basePath}/timeline`, payload: `${getKeyDates(cid).length} key dates` },
    { id: 'maps', label: 'Maps', icon: '🗺️', bg: '#E4F1EF', route: `${basePath}/maps`, payload: `${getMapIdentifyActivities(cid).length + getMapLabelActivities(cid).length} board-map exercises` },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', bg: '#F3E9F3', route: `${basePath}/flashcards`, payload: `${getFlashcards(cid).length} smart cards · spaced repetition` },
    { id: 'figures', label: 'Figures', icon: '🖼️', bg: '#F7EFDD', route: `${basePath}/figures`, payload: `${getFigures(cid).length} NCERT figures, explorable` },
  ]

  const ringCirc = 2 * Math.PI * 34

  return (
    <div className="max-w-5xl mx-auto pb-10">
      {/* Breadcrumb */}
      <div className="text-[12.5px] font-semibold text-hist-muted mb-3.5 px-0.5">
        <Link to="/" className="hover:text-hist-dark">All Chapters</Link>
        <span className="mx-1.5">·</span>
        <b className="text-hist-dark">Chapter {cid.replace(/\D/g, '')} · {chapter.title}</b>
      </div>

      {/* Slim hero — orientation, not action */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[22px] shadow-card border border-hist-line px-6 py-4 mb-5 flex items-center gap-5"
      >
        <div className="flex-1 min-w-0">
          {!entitled && previewSection && (
            <span className="inline-flex items-center gap-1.5 bg-hist-green/10 text-hist-green text-[10.5px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full mb-1.5">
              ✓ Section 1 free
            </span>
          )}
          <h1 className="font-display text-[21px] font-semibold text-hist-dark leading-tight mb-0.5">
            {chapter.title}
          </h1>
          <p className="font-body text-[12.5px] font-medium text-hist-muted">
            {entitled
              ? `Welcome back, ${firstName}. Pick up the story where you left off — or test what you've learnt.`
              : `Welcome, ${firstName}. Section 1 is yours to read free — the full chapter unlocks everything below it.`}
          </p>
          <div className="inline-flex items-center gap-1.5 bg-hist-gold-soft/50 border border-hist-line px-2.5 py-1 rounded-lg font-bold text-xs text-hist-ink mt-2">
            ⭐ <b className="text-hist-dark">{totalStars} stars</b>
          </div>
        </div>
        <div className="relative shrink-0 grid place-items-center" style={{ width: 84, height: 84 }}>
          <svg width="84" height="84" className="-rotate-90">
            <circle cx="42" cy="42" r="34" stroke="#EDE6F0" strokeWidth="8" fill="none" />
            <circle
              cx="42" cy="42" r="34" stroke="url(#homeRingGrad)" strokeWidth="8" fill="none"
              strokeLinecap="round" strokeDasharray={ringCirc}
              strokeDashoffset={ringCirc * (1 - overallProgress / 100)}
            />
            <defs>
              <linearGradient id="homeRingGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DC835F" />
                <stop offset="1" stopColor="#7E72C2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center leading-tight">
            <b className="block font-display text-[15.5px] text-hist-dark">{overallProgress}%</b>
            <span className="block text-[8px] font-extrabold uppercase text-hist-muted">chapter</span>
            <span className="block text-[8px] font-extrabold uppercase text-hist-muted">done</span>
          </div>
        </div>
      </motion.div>

      {/* BAND 1 · LEARN */}
      <BandLabel num={1} title="Learn the story"
        sub={entitled
          ? `${chapter.sections.length} sections · continue where you left off`
          : 'Section 1 free · the rest with the chapter'} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-7">
        {chapter.sections.map((section, i) => {
          const locked = !entitled && !!previewSection && section.id !== previewSection
          const units = sectionUnits(section)
          const state = locked
            ? 'locked'
            : units.done >= units.total && units.total > 0
              ? 'done'
              : units.done > 0
                ? 'progress'
                : 'idle'
          const color = sectionColors[section.id] || '#3E3548'
          const icon = sectionIcons[section.id] || section.icon || '📖'
          const topicCount = section.subsections.length || section.topicCount || 0
          const pct = units.total > 0 ? Math.round((units.done / units.total) * 100) : 0

          return (
            <motion.button
              key={section.id}
              className={`relative rounded-2xl p-4 text-left border transition-all ${
                state === 'progress'
                  ? 'border-2 border-hist-gold shadow-card bg-gradient-to-br from-white to-hist-gold-soft/60'
                  : locked
                    ? 'bg-[#FBF7F4] border-hist-line shadow-card'
                    : 'bg-white border-hist-line shadow-card hover:shadow-card-hover'
              }`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => (locked ? setSheetOpen(true) : navigate(`${basePath}/section/${section.id}`))}
            >
              <span
                className={`absolute right-3 top-3 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                  state === 'done'
                    ? 'bg-hist-green/10 text-hist-green'
                    : state === 'progress'
                      ? 'bg-hist-gold text-white'
                      : locked
                        ? 'bg-hist-gold-soft text-[#B5652F]'
                        : 'bg-gray-100 text-gray-400'
                }`}
              >
                {state === 'done' ? '✓ Done' : state === 'progress' ? 'Continue →' : locked ? '🔒 Unlock' : 'Not started'}
              </span>
              <div className="flex items-center gap-3 pr-[86px]">
                <div
                  className={`w-10 h-10 rounded-xl grid place-items-center text-lg shrink-0 ${locked ? 'grayscale opacity-60' : ''}`}
                  style={{ backgroundColor: color + '1A' }}
                >
                  {icon}
                </div>
                <div className="min-w-0">
                  <h3 className={`font-display text-[14.5px] font-semibold leading-tight ${locked ? 'text-[#8D8496]' : 'text-hist-dark'}`}>
                    {section.title}
                  </h3>
                  <div className="text-[11px] font-semibold text-hist-muted mt-0.5">
                    {locked
                      ? `${topicCount} topics · with the chapter`
                      : state === 'done'
                        ? `${topicCount} topics · quiz done`
                        : state === 'progress'
                          ? `${units.done} of ${units.total} done`
                          : `${topicCount} topics · 1 quiz`}
                  </div>
                </div>
              </div>
              {state === 'progress' && (
                <div className="h-[5px] rounded-full mt-3 overflow-hidden" style={{ backgroundColor: '#EDE7F0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  />
                </div>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* BAND 2 · TEST (paid) or UNLOCK (preview) */}
      {entitled ? (
        <>
          <BandLabel num={2} title="Test yourself" sub="board-pattern papers, marked like CBSE marks" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[22px] shadow-card px-7 py-6 mb-7 flex flex-col sm:flex-row items-center gap-6 overflow-hidden"
            style={{ background: 'linear-gradient(140deg, #453A5E, #67589B)' }}
          >
            <span className="absolute text-[110px] opacity-5 pointer-events-none" style={{ right: '34%', bottom: -40 }}>🎯</span>
            <div className="flex-1 min-w-0 relative">
              <span className="block text-[10.5px] font-extrabold uppercase tracking-[1.6px] text-[#C9BEEC] mb-1.5">
                The real exam rehearsal
              </span>
              <h2 className="font-display text-[22px] font-semibold text-white mb-1.5">Mock Test Centre</h2>
              <p className="font-body text-[13px] font-medium text-[#CFC7E8] max-w-[46ch]">
                Timed papers set by a Senior CBSE Examiner — with the official marking scheme on
                every written answer.
              </p>
              <div className="text-[12.5px] font-bold text-[#C9BEEC] mt-3">
                {best ? (
                  <>Best <b className="text-white font-display text-[14.5px]">{Number(best.objective_awarded ?? 0)}/{Number(best.objective_max ?? 0)}</b> MCQ</>
                ) : (
                  'No attempts yet'
                )}
                {' '}· {submitted.length} attempt{submitted.length === 1 ? '' : 's'} · {papers.length} paper{papers.length === 1 ? '' : 's'}
              </div>
            </div>
            <div className="text-center shrink-0 relative">
              {recommended ? (
                <button
                  className="flex flex-col items-center gap-0.5 rounded-2xl px-8 py-4 shadow-button btn-press"
                  style={{ backgroundColor: '#C05F35' }}
                  onClick={() => navigate(`${basePath}/tests/${recommended.id}/play`)}
                >
                  <b className="font-display text-white text-base font-extrabold">
                    {live ? 'Resume mock test →' : 'Start mock test →'}
                  </b>
                  <span className="text-[11.5px] font-bold text-[#FFF3EC]">
                    {recommended.title.length > 34 ? `${recommended.title.slice(0, 32)}…` : recommended.title} · {recommended.duration_minutes} min · {recommended.total_marks} marks
                  </span>
                </button>
              ) : (
                <button
                  className="font-display font-bold text-white rounded-2xl px-8 py-4 shadow-button btn-press"
                  style={{ backgroundColor: '#C05F35' }}
                  onClick={() => navigate(`${basePath}/tests`)}
                >
                  Open Test Centre →
                </button>
              )}
              <button
                className="block mx-auto mt-2.5 text-xs font-bold text-[#C9BEEC] hover:text-white"
                onClick={() => navigate(`${basePath}/tests`)}
              >
                All papers &amp; past attempts →
              </button>
            </div>
          </motion.div>
        </>
      ) : (
        <>
          <BandLabel num={2} title="Unlock the full chapter" sub="everything below is included" />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative rounded-[22px] shadow-card px-7 py-6 mb-7 flex flex-col sm:flex-row items-center gap-6 overflow-hidden"
            style={{ background: 'linear-gradient(140deg, #8A4B2F, #C05F35)' }}
          >
            <span className="absolute text-[110px] opacity-[0.09] pointer-events-none -right-2 -bottom-6">🔒</span>
            <div className="flex-1 min-w-0 relative">
              <span className="block text-[10.5px] font-extrabold uppercase tracking-[1.6px] text-[#F3C9B2] mb-1.5">
                One payment · yours for life
              </span>
              <h2 className="font-display text-[21px] font-semibold text-white mb-1.5">
                The rest of the story — and the exam rehearsal
              </h2>
              <p className="font-body text-[13px] font-medium text-[#F4DCCB] max-w-[46ch] mb-3">
                All sections, every revision tool, and timed board-pattern mock tests set by a
                Senior CBSE Examiner.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[12.5px] font-semibold text-[#FBEADF]">
                <span>✓ <b className="text-white">All {chapter.sections.length} story sections</b></span>
                <span>✓ <b className="text-white">Mock tests</b> — timed, board pattern</span>
                <span>✓ Flashcards · timeline · maps · figures</span>
                <span>✓ Marking scheme on every answer</span>
              </div>
            </div>
            {product && (
              <div className="bg-white rounded-2xl px-6 py-5 text-center shrink-0 shadow-card-hover min-w-[240px] relative">
                <div className="flex items-baseline justify-center gap-2 mb-1">
                  {product.list_price_paise && (
                    <span className="font-body text-sm text-gray-400 line-through font-semibold">
                      ₹{(product.list_price_paise / 100).toFixed(0)}
                    </span>
                  )}
                  <span className="font-display text-[28px] font-bold text-hist-dark">
                    ₹{(product.price_paise / 100).toFixed(0)}
                  </span>
                  {product.list_price_paise && (
                    <span className="text-[10.5px] font-extrabold text-hist-green">LAUNCH</span>
                  )}
                </div>
                <div className="text-[11px] font-semibold text-hist-muted mb-3">
                  One-time · no subscription
                </div>
                <button
                  className="w-full font-display font-extrabold text-white text-sm rounded-xl px-5 py-3 shadow-button btn-press"
                  style={{ backgroundColor: '#DC835F' }}
                  onClick={() => setSheetOpen(true)}
                >
                  Unlock chapter →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}

      {/* BAND 3 · REVISE */}
      <BandLabel
        num={3}
        title="Revise with tools"
        sub={entitled ? 'quick whole-chapter revision' : '🔒 included with the full chapter'}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {tools.map((tool) =>
          entitled ? (
            <motion.button
              key={tool.id}
              className="bg-white rounded-[14px] border border-hist-line shadow-card px-4 py-3 flex items-center gap-3 text-left hover:shadow-card transition-all"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(tool.route)}
            >
              <div className="w-[42px] h-[42px] rounded-xl grid place-items-center text-lg shrink-0" style={{ backgroundColor: tool.bg }}>
                {tool.icon}
              </div>
              <div className="min-w-0">
                <b className="block text-[13px] font-extrabold text-hist-dark">{tool.label}</b>
                <span className="block text-[11.5px] font-semibold text-hist-muted truncate">{tool.payload}</span>
              </div>
              <span className="ml-auto text-hist-muted font-extrabold">→</span>
            </motion.button>
          ) : (
            <button
              key={tool.id}
              className="bg-[#F7F2F0] rounded-[14px] border border-hist-line px-4 py-3 flex items-center gap-3 text-left relative"
              onClick={() => setSheetOpen(true)}
            >
              <span className="absolute right-2.5 top-2.5 text-[11px]">🔒</span>
              <div className="w-[42px] h-[42px] rounded-xl grid place-items-center text-lg shrink-0 grayscale opacity-55 bg-[#EFE7E2]">
                {tool.icon}
              </div>
              <b className="text-[13px] font-extrabold text-[#A79DA9]">{tool.label}</b>
            </button>
          ),
        )}
      </div>

      {product && (
        <PurchaseSheet
          product={product}
          chapterTitle={chapter.title}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </div>
  )
}

function BandLabel({ num, title, sub }: { num: number; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5 mb-3 px-0.5">
      <span className="w-6 h-6 rounded-full bg-hist-dark text-white grid place-items-center text-xs font-extrabold font-display">
        {num}
      </span>
      <h2 className="font-display text-[19px] font-semibold text-hist-dark">{title}</h2>
      <span className="ml-auto text-xs font-semibold text-hist-muted hidden sm:block">{sub}</span>
    </div>
  )
}
