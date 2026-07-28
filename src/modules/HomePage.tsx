import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgressStore } from '../store/useProgressStore'
import { useAccess } from '../components/auth/AccessProvider'
import { PurchaseSheet } from '../components/purchase/PurchaseSheet'
import { WorkspaceShell } from '../components/shell/WorkspaceShell'
import {
  IconBook,
  IconCheck,
  IconChevronRight,
  IconArrowRight,
  IconClock,
  IconTarget,
  IconLayers,
  IconImage,
  IconStar,
  IconTrophy,
} from '../components/shell/icons'
import { chapterKey } from '../lib/contentIds'
import { testEngine, type PaperMeta, type AttemptMeta } from '../lib/testEngine'
import {
  getChapter,
  getChapterPreview,
  getFlashcards,
  getFigures,
} from '../data/getChapter'

// Chapter home ("Overview") — Design Language V2, LOCKED 2026-07-26
// (decision #38, mockups/finalmockup/nl-03-flow.html): light chip hero with
// the chapter's signature NCERT painting, Continue-learning resume band
// (deep-links into the topic reader), journey stepper (no sequential locks —
// "recommended next" is the highlighted step), quote band; rail = progress
// ring + Mock Test prime + quick practice + stats. Laws: one-fact-once,
// honest completion, Mock Tests never buried, no subscription wording.
const HERO_ART: Record<string, string> = {
  ch1: '/images/fig-11-german-empire-proclamation.png',
  ch2: '/images/ch2/fig-07-dandi-march.png',
}

const CHAPTER_QUOTES: Record<string, { q: string; by: string }> = {
  ch1: { q: 'When France sneezes, the rest of Europe catches a cold.', by: 'Metternich' },
}

const MIN_PER_CARD = 0.75 // reading-pace estimate: ~45s per story card
const MIN_PER_QUIZ = 5

export function HomePage() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
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
  const chapterNumber = parseInt(cid.replace(/\D/g, ''), 10) || 1

  // Papers + attempts drive the rail's Mock Test prime and the best-MCQ stat.
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
          <h2 className="font-display text-xl font-bold text-v2-ink mb-2">Chapter Not Found</h2>
          <button className="text-hist-blue underline font-body" onClick={() => navigate('/')}>
            All Chapters
          </button>
        </div>
      </div>
    )
  }

  // Progress: topics + section quiz as one unit each (decision #29); preview
  // trim keeps the whole-chapter denominator via topicCount. Quiz unit =
  // at least one completed round (A-fix #1).
  const sectionUnits = (section: (typeof chapter.sections)[number]) => {
    const topicsDone = section.subsections.filter((sub) => completedSubsections[sub.id]).length
    const quiz = progressSections[section.id]
    const quizDone = !!quiz && quiz.completed >= 1
    const topicTotal = section.subsections.length || section.topicCount || 0
    return { done: topicsDone + (quizDone ? 1 : 0), total: topicTotal + 1, quizDone }
  }
  const overall = chapter.sections.reduce(
    (acc, s) => {
      const u = sectionUnits(s)
      return { done: acc.done + u.done, total: acc.total + u.total }
    },
    { done: 0, total: 0 },
  )
  const overallProgress = overall.total > 0 ? Math.round((overall.done / overall.total) * 100) : 0
  const sectionsDone = chapter.sections.filter((s) => {
    const u = sectionUnits(s)
    return u.total > 0 && u.done >= u.total
  }).length

  const isLockedSection = (sectionId: string) =>
    !entitled && !!previewSection && sectionId !== previewSection

  // Resume target: first incomplete topic in the first unfinished (unlocked)
  // section — the daily one-click path straight into the reader (#37).
  let resume: { sectionId: string; sectionTitle: string; topicIndex: number; topicTitle: string; minutes: number } | null = null
  for (const section of chapter.sections) {
    if (isLockedSection(section.id) || section.subsections.length === 0) continue
    const idx = section.subsections.findIndex((sub) => !completedSubsections[sub.id])
    if (idx >= 0) {
      const sub = section.subsections[idx]
      resume = {
        sectionId: section.id,
        sectionTitle: section.title,
        topicIndex: idx,
        topicTitle: sub.title,
        minutes: Math.max(2, Math.round(sub.narrativeCards.length * MIN_PER_CARD)),
      }
      break
    }
  }

  // Honest time-left estimate — only counts content we actually have locally
  // (preview users' locked sections carry no cards, so no fake numbers).
  let minutesLeft = 0
  for (const section of chapter.sections) {
    if (isLockedSection(section.id)) continue
    const u = sectionUnits(section)
    for (const sub of section.subsections) {
      if (!completedSubsections[sub.id]) minutesLeft += sub.narrativeCards.length * MIN_PER_CARD
    }
    if (!u.quizDone && section.subsections.length > 0) minutesLeft += MIN_PER_QUIZ
  }
  const estLeft = formatMinutes(Math.round(minutesLeft))

  // Rail Mock Test prime — resume a live attempt, else least-attempted paper.
  const submitted = attempts.filter((a) => a.status === 'submitted')
  const live = attempts.find((a) => a.status === 'in_progress')
  const best = submitted.reduce<AttemptMeta | null>(
    (acc, a) =>
      acc === null || (a.objective_awarded ?? 0) > (acc.objective_awarded ?? 0) ? a : acc,
    null,
  )
  const recommended = live
    ? papers.find((p) => p.id === live.paper_id)
    : [...papers].sort((a, b) => {
        const at = submitted.filter((x) => x.paper_id === a.id).length
        const bt = submitted.filter((x) => x.paper_id === b.id).length
        return at - bt || a.position - b.position
      })[0]

  const resumeInfo = resume
  const flashcardCount = getFlashcards(cid).length
  const figureCount = getFigures(cid).length
  const topicsDoneTotal = chapter.sections.reduce(
    (n, s) => n + s.subsections.filter((sub) => completedSubsections[sub.id]).length,
    0,
  )
  const quote = CHAPTER_QUOTES[cid]
  const heroArt = HERO_ART[cid]

  // The "recommended next" step (no sequential locks — decision #38): the
  // first unlocked section that isn't complete.
  const nextSectionId = chapter.sections.find((s) => {
    if (isLockedSection(s.id)) return false
    const u = sectionUnits(s)
    return u.total === 0 || u.done < u.total
  })?.id

  const rail = (
    <div>
      {/* Chapter progress — THE progress fact (one-fact-once). Mobile hides
          this card (Uday 2026-07-28): the hero carries a compact ring there. */}
      <div className="hidden lg:block mb-7">
        <h3 className="font-display text-[15px] font-semibold text-v2-ink mb-3.5">
          Chapter Progress
        </h3>
        <div className="flex items-center gap-4">
          <div className="relative grid place-items-center shrink-0">
            <svg width="92" height="92" className="-rotate-90">
              <circle cx="46" cy="46" r="39" stroke="#F0E7EA" strokeWidth="9" fill="none" />
              <circle
                cx="46"
                cy="46"
                r="39"
                stroke="#E8551F"
                strokeWidth="9"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 39}
                strokeDashoffset={2 * Math.PI * 39 * (1 - overallProgress / 100)}
              />
            </svg>
            <b className="absolute font-display text-[17px] text-v2-ink">{overallProgress}%</b>
          </div>
          <div>
            <b className="block font-display text-[15px] text-v2-ink">
              {sectionsDone} of {chapter.sections.length} sections
            </b>
            <span className="block text-[11px] font-bold text-v2-muted mt-0.5">completed</span>
            {estLeft && (
              <span className="flex items-center gap-1.5 mt-2.5 text-[11.5px] font-bold text-v2-body">
                <IconClock className="w-3.5 h-3.5 text-v2-muted" />
                about {estLeft} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Prime CTA — Mock Tests never buried (law) / unlock for preview */}
      {entitled ? (
        /* Mobile: the Practice tab IS the always-visible mock-test entry, so
           this rail CTA is desktop-only (law satisfied structurally). The
           preview unlock band below stays on BOTH — it's the paywall CTA. */
        <button
          className="hidden lg:flex w-full items-center gap-3 rounded-2xl p-4 mb-7 text-left shadow-[0_10px_26px_rgba(69,58,94,.3)]"
          style={{ background: 'linear-gradient(140deg, #453A5E, #67589B)' }}
          onClick={() =>
            recommended
              ? navigate(`${basePath}/tests/${recommended.id}/play`)
              : navigate(`${basePath}/tests`)
          }
        >
          <span className="w-[38px] h-[38px] rounded-[11px] bg-white/15 grid place-items-center text-white shrink-0">
            <IconTarget />
          </span>
          <span className="min-w-0">
            <b className="block text-[13.5px] font-extrabold text-white">
              {live ? 'Resume your mock test' : best ? 'Take a mock test' : 'Start your first mock test'}
            </b>
            <span className="block text-[11px] font-semibold text-[#C9BEEC] truncate">
              {recommended
                ? `${recommended.title} · ${recommended.duration_minutes} min · ${recommended.total_marks} marks`
                : 'Board-pattern papers, timed'}
            </span>
          </span>
          <IconChevronRight className="w-[18px] h-[18px] ml-auto text-[#C9BEEC] shrink-0" />
        </button>
      ) : (
        product && (
          <button
            className="w-full flex items-center gap-3 rounded-2xl p-4 mb-7 text-left shadow-[0_10px_26px_rgba(192,95,53,.35)]"
            style={{ background: 'linear-gradient(140deg, #8A4B2F, #C05F35)' }}
            onClick={() => setSheetOpen(true)}
          >
            <span className="w-[38px] h-[38px] rounded-[11px] bg-white/15 grid place-items-center text-white shrink-0 text-base">
              🔓
            </span>
            <span className="min-w-0">
              <b className="block text-[13.5px] font-extrabold text-white">
                Unlock this chapter · ₹{(product.price_paise / 100).toFixed(0)}
              </b>
              <span className="block text-[11px] font-semibold text-[#F4DCCB]">
                One-time · all sections, tools &amp; mock tests
              </span>
            </span>
            <IconChevronRight className="w-[18px] h-[18px] ml-auto text-[#F4DCCB] shrink-0" />
          </button>
        )
      )}

      {/* Quick-practice block removed (Neha 2026-07-27): the rail's Flashcards
          card duplicated the sidebar item one inch to its left. Section pages
          keep their rail cards — those are section-scoped, the sidebar isn't. */}

      {/* Stats — 2×2, honest facts only (no streak until we track one).
          Desktop-only: mobile shows stars in the app bar, best MCQ lives in
          the Practice tab (Uday 2026-07-28). */}
      <div className="hidden lg:block">
        <h3 className="font-display text-[15px] font-semibold text-v2-ink mb-2">Your stats</h3>
        <div className="grid grid-cols-2">
          <StatCell icon={<IconStar className="w-[17px] h-[17px] text-v2-accent" />} value={`${totalStars}`} label="stars" divider="r" />
          <StatCell icon={<IconBook className="w-[17px] h-[17px] text-v2-accent" />} value={`${topicsDoneTotal}`} label="topics done" />
          <StatCell
            icon={<IconTrophy className="w-[17px] h-[17px] text-v2-accent" />}
            value={best ? `${Number(best.objective_awarded ?? 0)}/${Number(best.objective_max ?? 0)}` : '—'}
            label="best MCQ"
            divider="rt"
          />
          <StatCell icon={<IconCheck className="w-[17px] h-[17px] text-v2-accent" />} value={`${sectionsDone}`} label="sections done" divider="t" />
        </div>
      </div>
    </div>
  )

  return (
    <WorkspaceShell
      chapterId={cid}
      chapterNumber={chapterNumber}
      crumbs={[{ label: 'All Chapters', to: '/' }, { label: chapter.title }]}
      rail={rail}
    >
      {/* HERO — light, art fades in from the right, stat chips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[20px] overflow-hidden shadow-v2 mb-[18px] min-h-[224px] flex items-center"
        style={{ backgroundColor: '#F8EDDF' }}
      >
        {heroArt && (
          <div
            className="absolute inset-0 opacity-45 md:opacity-100"
            style={{
              background: `url(${heroArt}) right 30% / 62% auto no-repeat`,
              filter: 'sepia(.25) saturate(.85) brightness(1.03)',
            }}
          />
        )}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg,#F8EDDF 38%,rgba(248,237,223,.92) 52%,rgba(248,237,223,.4) 72%,rgba(248,237,223,.08))',
          }}
        />
        <div className="relative px-6 md:px-[34px] py-[30px] w-full">
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <span className="w-[42px] h-[42px] rounded-xl bg-v2-accent text-white grid place-items-center font-display font-bold text-lg shadow-[0_6px_16px_rgba(232,85,31,.35)]">
              {chapterNumber}
            </span>
            <span className="text-[12.5px] font-extrabold text-v2-accent-deep">
              CBSE Class 10 <em className="not-italic text-v2-muted font-bold mx-1">·</em> History
            </span>
            {!entitled && previewSection && (
              <span className="bg-v2-ok-bg text-v2-ok text-[10.5px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full">
                ✓ Section 1 free
              </span>
            )}
          </div>
          <h1 className="font-display text-[24px] md:text-[31px] font-semibold text-v2-ink leading-[1.12] mb-4 max-w-full md:max-w-[60%]">
            {chapter.title}
          </h1>
          {/* Mobile-only progress row — % stat · full-width bar · caption
              (intern round-3 steal, Uday 2026-07-28). */}
          <div className="lg:hidden flex items-center gap-3 mb-3.5">
            <b className="font-display text-[16px] text-v2-accent shrink-0">{overallProgress}%</b>
            <div className="h-[6px] flex-1 rounded-full overflow-hidden" style={{ backgroundColor: '#F0E7EA' }}>
              <div
                className="h-full rounded-full"
                style={{ width: `${Math.max(overallProgress, 2)}%`, backgroundColor: '#E8551F' }}
              />
            </div>
            <span className="text-[11.5px] font-bold text-v2-muted shrink-0">
              {sectionsDone} of {chapter.sections.length} sections
            </span>
          </div>
          <div className="flex gap-2.5 lg:gap-2.5 gap-x-4 gap-y-2 flex-wrap">
            <HeroChip icon={<IconBook className="w-[15px] h-[15px] text-v2-accent" />} label={`${chapter.sections.length} Sections`} />
            {entitled && papers.length > 0 && (
              <HeroChip
                icon={<IconTarget className="w-[15px] h-[15px] text-v2-accent" />}
                label={`${papers.length} Mock Test${papers.length === 1 ? '' : 's'}`}
                onClick={() => navigate(`${basePath}/tests`)}
              />
            )}
            {flashcardCount > 0 && (
              <HeroChip
                icon={<IconLayers className="w-[15px] h-[15px] text-v2-accent" />}
                label={`${flashcardCount} Flashcards`}
                onClick={() => navigate(`${basePath}/flashcards`)}
              />
            )}
            {figureCount > 0 && (
              <HeroChip
                icon={<IconImage className="w-[15px] h-[15px] text-v2-accent" />}
                label={`${figureCount} Figures`}
                onClick={() => navigate(`${basePath}/figures`)}
              />
            )}
          </div>
          {/* Mobile-only hero CTA — the ONE start/continue action (the resume
              band below is desktop-only; its context lives in the caption). */}
          {resumeInfo && (
            <div className="lg:hidden mt-4">
              <button
                className="flex items-center justify-center gap-2 w-full max-w-[340px] bg-v2-accent text-white font-extrabold text-[15px] py-3.5 rounded-2xl shadow-[0_6px_18px_rgba(232,85,31,.35)] btn-press"
                onClick={() =>
                  navigate(`${basePath}/section/${resumeInfo.sectionId}/topic/${resumeInfo.topicIndex + 1}`)
                }
              >
                {overall.done > 0 ? 'Continue Learning' : 'Start Learning'}
                <IconArrowRight className="w-[16px] h-[16px]" />
              </button>
              <span className="block text-[11.5px] font-semibold text-v2-body mt-2">
                Next: Topic {resumeInfo.topicIndex + 1} · {resumeInfo.topicTitle} · about{' '}
                {resumeInfo.minutes} min
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* RESUME BAND — one click into the reader. DESKTOP ONLY (Uday
          2026-07-28): the mobile hero carries the CTA + next-topic caption;
          band + hero CTA on one phone screen said the same thing twice. */}
      {resumeInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="hidden lg:flex items-center gap-4 rounded-2xl px-5 py-4 mb-6 border flex-wrap"
          style={{
            background: 'linear-gradient(140deg,#FFF3E9,#FDE7D7)',
            borderColor: '#F6D4C2',
          }}
        >
          <span className="w-[46px] h-[46px] rounded-[13px] bg-v2-accent text-white grid place-items-center shrink-0 shadow-[0_6px_16px_rgba(232,85,31,.3)]">
            <IconBook className="w-[22px] h-[22px]" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="font-display text-[13px] font-bold text-v2-accent mb-0.5">
              {overall.done > 0 ? 'Continue learning' : 'Start here'}
            </div>
            <b className="block text-[14.5px] font-extrabold text-v2-ink truncate">
              {resumeInfo.sectionTitle}
            </b>
            <span className="block text-xs font-semibold text-v2-body mt-0.5 truncate">
              {overall.done > 0 ? 'Resume from' : 'Begin with'} Topic {resumeInfo.topicIndex + 1}:{' '}
              {resumeInfo.topicTitle} · about {resumeInfo.minutes} min
            </span>
          </div>
          <button
            className="flex items-center gap-2 bg-v2-accent text-white font-extrabold text-[13.5px] px-[22px] py-3 rounded-xl shadow-[0_6px_18px_rgba(232,85,31,.35)] btn-press max-md:w-full max-md:justify-center"
            onClick={() =>
              navigate(`${basePath}/section/${resumeInfo.sectionId}/topic/${resumeInfo.topicIndex + 1}`)
            }
          >
            {overall.done > 0 ? 'Continue' : 'Start'}
            <IconArrowRight className="w-[15px] h-[15px]" />
          </button>
        </motion.div>
      )}

      {/* JOURNEY STEPPER — the one sheet */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[20px] shadow-v2 px-5 md:px-8 py-7"
      >
        <h2 className="font-display text-[19px] font-semibold text-v2-ink mb-5">
          Your chapter journey
        </h2>
        <div className="relative">
          <span className="absolute left-[21px] top-7 bottom-7 w-0.5 bg-v2-line" />
          {chapter.sections.map((section) => {
            const locked = isLockedSection(section.id)
            const units = sectionUnits(section)
            const done = !locked && units.total > 0 && units.done >= units.total
            const inProgress = !locked && !done && units.done > 0
            const isNext = section.id === nextSectionId
            const topicCount = section.subsections.length || section.topicCount || 0
            const pct = units.total > 0 ? Math.round((units.done / units.total) * 100) : 0
            const estMin =
              section.subsections.length > 0
                ? Math.round(
                    section.subsections.reduce((n, sub) => n + sub.narrativeCards.length, 0) *
                      MIN_PER_CARD +
                      MIN_PER_QUIZ,
                  )
                : null

            return (
              <button
                key={section.id}
                className="relative w-full flex items-center gap-4 py-3.5 text-left group"
                onClick={() =>
                  locked ? setSheetOpen(true) : navigate(`${basePath}/section/${section.id}`)
                }
              >
                <span
                  className={`relative z-[1] w-11 h-11 rounded-full grid place-items-center font-display font-bold text-base shrink-0 border-[3px] border-white ${
                    done
                      ? 'bg-v2-ok-bg text-v2-ok'
                      : inProgress || isNext
                        ? 'bg-v2-accent text-white shadow-[0_5px_14px_rgba(232,85,31,.35)]'
                        : 'bg-[#F5EEE7] text-v2-muted'
                  }`}
                >
                  {done ? <IconCheck className="w-[18px] h-[18px]" /> : section.number}
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className={`font-display text-[15.5px] font-semibold leading-tight ${locked ? 'text-[#8D8496]' : 'text-v2-ink'}`}>
                    {section.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11.5px] font-semibold text-v2-muted mt-0.5 flex-wrap">
                    <span>{topicCount} topics</span>
                    <span>·</span>
                    {locked ? (
                      <span>with the chapter</span>
                    ) : (
                      <>
                        <span>1 quiz</span>
                        {estMin !== null && (
                          <>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <IconClock className="w-[13px] h-[13px]" />
                              {estMin} min
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {/* Mobile: the status column below is hidden, but locked rows
                    still need their one signal — tapping opens the purchase
                    sheet, not the section. */}
                {locked && (
                  <span className="sm:hidden text-[13px] shrink-0" aria-label="Unlocks with the chapter">
                    🔒
                  </span>
                )}
                <div className="hidden sm:flex items-center gap-3.5 shrink-0">
                  {inProgress && (
                    <>
                      <span className="w-[90px] h-1.5 rounded-full bg-[#F0E7EA] overflow-hidden">
                        <span
                          className="block h-full rounded-full bg-v2-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </span>
                      <span className="text-[11.5px] font-extrabold text-v2-accent-deep min-w-[32px] text-right">
                        {pct}%
                      </span>
                    </>
                  )}
                  <span
                    className={`text-[10.5px] font-extrabold px-3 py-[5px] rounded-full ${
                      done
                        ? 'bg-v2-ok-bg text-v2-ok'
                        : inProgress
                          ? 'bg-v2-accent-soft text-v2-accent-deep'
                          : locked
                            ? 'bg-v2-accent-soft/60 text-[#B5652F]'
                            : 'bg-[#F3EEE8] text-v2-muted'
                    }`}
                  >
                    {done
                      ? '✓ Completed'
                      : inProgress
                        ? 'In progress'
                        : locked
                          ? '🔒 Unlock'
                          : 'Not started'}
                  </span>
                  <IconChevronRight className="w-[18px] h-[18px] text-v2-muted" />
                </div>
              </button>
            )
          })}
        </div>
      </motion.div>

      {/* UNLOCK BAND — preview users (paywall surface, decision #27/#28 copy) */}
      {!entitled && product && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative rounded-[22px] shadow-v2 px-7 py-6 mt-6 flex flex-col sm:flex-row items-center gap-6 overflow-hidden"
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
          <div className="bg-white rounded-2xl px-6 py-5 text-center shrink-0 shadow-card-hover min-w-[240px] relative">
            <div className="flex items-baseline justify-center gap-2 mb-1">
              {product.list_price_paise && (
                <span className="font-body text-sm text-gray-400 line-through font-semibold">
                  ₹{(product.list_price_paise / 100).toFixed(0)}
                </span>
              )}
              <span className="font-display text-[28px] font-bold text-v2-ink">
                ₹{(product.price_paise / 100).toFixed(0)}
              </span>
              {product.list_price_paise && (
                <span className="text-[10.5px] font-extrabold text-v2-ok">LAUNCH</span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-v2-muted mb-3">
              One-time · no subscription
            </div>
            <button
              className="w-full font-display font-extrabold text-white text-sm rounded-xl px-5 py-3 shadow-button btn-press bg-v2-cta"
              onClick={() => setSheetOpen(true)}
            >
              Unlock chapter →
            </button>
          </div>
        </motion.div>
      )}

      {/* QUOTE */}
      {quote && (
        <div className="flex items-center justify-center gap-3 bg-v2-lav-soft rounded-2xl px-6 py-[18px] mt-5 text-center">
          <span className="font-display text-[34px] leading-[0.6] text-v2-lav mt-2.5">“</span>
          <span className="font-display italic text-[15px] text-v2-ink">
            {quote.q} — {quote.by}
          </span>
          <span className="font-display text-[34px] leading-[0.6] text-v2-lav mt-2.5">”</span>
        </div>
      )}

      {product && (
        <PurchaseSheet
          product={product}
          chapterTitle={chapter.title}
          open={sheetOpen}
          onClose={() => setSheetOpen(false)}
        />
      )}
    </WorkspaceShell>
  )
}

// Mobile: borderless (icon + text, no pill) and tappable where a destination
// exists; desktop keeps the white pill look (intern round-3 steal, 2026-07-28).
function HeroChip({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick?: () => void
}) {
  const cls =
    'flex items-center gap-[7px] text-xs font-extrabold text-v2-ink ' +
    'lg:bg-white/85 lg:rounded-[11px] lg:px-[13px] lg:py-2 lg:shadow-[0_3px_10px_rgba(70,60,100,.06)]'
  if (onClick) {
    return (
      <button className={`${cls} btn-press`} onClick={onClick}>
        {icon}
        {label}
      </button>
    )
  }
  return (
    <span className={cls}>
      {icon}
      {label}
    </span>
  )
}

function StatCell({
  icon,
  value,
  label,
  divider,
}: {
  icon: React.ReactNode
  value: string
  label: string
  divider?: string
}) {
  const borders = [
    divider?.includes('r') ? 'border-r border-v2-line pr-3.5' : 'pl-3.5',
    divider?.includes('t') ? 'border-t border-v2-line' : '',
  ].join(' ')
  return (
    <div className={`flex items-center gap-2.5 py-2.5 px-1 ${borders}`}>
      {icon}
      <div>
        <b className="block font-display text-base text-v2-ink leading-[1.1]">{value}</b>
        <span className="text-[9.5px] font-extrabold uppercase tracking-[0.3px] text-v2-muted">
          {label}
        </span>
      </div>
    </div>
  )
}

function formatMinutes(min: number): string | null {
  if (min <= 0) return null
  if (min < 60) return `${min}m`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}
