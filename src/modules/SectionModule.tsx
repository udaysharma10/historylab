import { useState } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getChapter, getChapterPreview, getTimelineActivities, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { useProgressStore } from '../store/useProgressStore'
import { WorkspaceShell } from '../components/shell/WorkspaceShell'
import {
  IconBook,
  IconCheck,
  IconChevronRight,
  IconCalendar,
  IconClock,
  IconTarget,
  IconQuiz,
  IconLayers,
  IconPencil,
} from '../components/shell/icons'
import { SectionTimeline } from '../components/section/SectionTimeline'
import { SectionMaps } from '../components/section/SectionMaps'

// Section page — Design Language V2, LOCKED 2026-07-26 (decision #38,
// mockups/finalmockup/nl-03-flow.html): dark cinematic hero (NCERT art +
// left fade), one sheet holding What You'll Learn → Topics → Practice &
// Explore (quiz row + inline timeline + inline map — Neha's kept elements);
// rail = section ring + Mock Test prime + flashcards (quiz lives in the
// sheet only — one-fact-once).
const SECTION_ART: Record<string, Record<string, string>> = {
  ch1: {
    s1: '/images/fig-01-sorrieu.png',
    s2: '/images/fig-06-club-of-thinkers.png',
    s3: '/images/fig-10-frankfurt-parliament.png',
    s4: '/images/fig-11-german-empire-proclamation.png',
    s5: '/images/fig-17-germania-veit.png',
    s6: '/images/fig-20-british-empire-map.png',
  },
  ch2: {
    s1: '/images/ch2/fig-04-boycott-cloth.png',
    s2: '/images/ch2/fig-01-mass-processions.png',
    s3: '/images/ch2/fig-07-dandi-march.png',
    s4: '/images/ch2/fig-12-bharat-mata-tagore.png',
  },
}

const MIN_PER_CARD = 0.75

export function SectionModule() {
  const { sectionId, chapterId } = useParams<{ sectionId: string; chapterId: string }>()
  const navigate = useNavigate()
  const cid = chapterId || 'ch1'
  const basePath = `/chapter/${cid}`
  const chapterNumber = parseInt(cid.replace(/\D/g, ''), 10) || 1
  const completedSubsections = useProgressStore((s) => s.completedSubsections)
  const sectionProgress = useProgressStore((s) => s.chapters[cid]?.[sectionId ?? ''])

  const chapter = getChapter(cid)
  const section = chapter?.sections.find((s) => s.id === sectionId)

  // Preview mode: deep links to locked sections bounce to the chapter home
  // (where the locked step opens the purchase sheet).
  const previewSection = getChapterPreview(cid)
  if (previewSection && sectionId !== previewSection) {
    return <Navigate to={basePath} replace />
  }

  if (!chapter || !section) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-xl font-bold text-v2-ink mb-2">Section Not Found</h2>
          <button className="text-hist-blue underline font-body" onClick={() => navigate('/')}>
            All Chapters
          </button>
        </div>
      </div>
    )
  }

  const sectionColors = CHAPTER_SECTION_COLORS[cid] || {}
  const color = sectionColors[section.id] || '#3E3548'
  // Rail card appears only for sections with authored ordering activities.
  const hasTimelinePractice = getTimelineActivities(cid).some(
    (a) => a.sectionId === section.id,
  )
  const art = SECTION_ART[cid]?.[section.id]

  const topicsDone = section.subsections.filter((sub) => completedSubsections[sub.id]).length
  const quizDone = !!sectionProgress && sectionProgress.completed >= 1
  const totalUnits = section.subsections.length + 1 // topics + quiz (decision #29)
  const doneUnits = topicsDone + (quizDone ? 1 : 0)
  const pct = totalUnits > 0 ? Math.round((doneUnits / totalUnits) * 100) : 0
  const complete = doneUnits >= totalUnits
  const firstIncomplete = section.subsections.findIndex((sub) => !completedSubsections[sub.id])

  const minutesLeft = Math.round(
    section.subsections.reduce(
      (n, sub) => n + (completedSubsections[sub.id] ? 0 : sub.narrativeCards.length * MIN_PER_CARD),
      0,
    ) + (quizDone ? 0 : 5),
  )

  const topicPath = (i: number) => `${basePath}/section/${sectionId}/topic/${i + 1}`

  // Mobile sheet tabs (Uday 2026-07-28): Topics | Quiz & Explore — section-
  // local content modes ("Practice" is reserved for the bottom bar's Mock
  // Tests). Opens on Quiz & Explore when only the quiz remains. Desktop shows
  // the whole sheet, tabs hidden.
  const [sheetTab, setSheetTab] = useState<'topics' | 'practice'>(
    firstIncomplete === -1 && !quizDone ? 'practice' : 'topics',
  )

  // Mobile hero CTA — the one next action (mobile track 2026-07-28): next
  // incomplete topic, else the quiz, else nothing (Completed chip suffices).
  const nextTopic = firstIncomplete >= 0 ? section.subsections[firstIncomplete] : null
  const heroCta = nextTopic
    ? {
        label: doneUnits > 0 ? 'Continue' : 'Start Learning',
        to: topicPath(firstIncomplete),
        caption: `Next: Topic ${firstIncomplete + 1} · ${nextTopic.title} · about ${Math.max(1, Math.round(nextTopic.narrativeCards.length * MIN_PER_CARD))} min`,
      }
    : !quizDone
      ? {
          label: 'Take the Section Quiz',
          to: `${basePath}/section/${section.id}/quiz`,
          caption: 'Last step — completes this section',
        }
      : null

  const rail = (
    <div>
      {/* Desktop-only: the mobile hero carries the progress fact (2026-07-28) */}
      <div className="hidden lg:block mb-7">
        <h3 className="font-display text-[15px] font-semibold text-v2-ink mb-3.5">
          Section Progress
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
                strokeDashoffset={2 * Math.PI * 39 * (1 - pct / 100)}
              />
            </svg>
            <b className="absolute font-display text-[17px] text-v2-ink">{pct}%</b>
          </div>
          <div>
            <b className="block font-display text-[15px] text-v2-ink">
              {topicsDone} of {section.subsections.length} topics
            </b>
            <span className="block text-[11px] font-bold text-v2-muted mt-0.5">
              {quizDone ? 'quiz done' : 'quiz not taken'}
            </span>
            {!complete && minutesLeft > 0 && (
              <span className="flex items-center gap-1.5 mt-2.5 text-[11.5px] font-bold text-v2-body">
                <IconClock className="w-3.5 h-3.5 text-v2-muted" />
                about {minutesLeft} min left
              </span>
            )}
          </div>
        </div>
        {complete && (
          <p className="text-xs font-semibold text-v2-body mt-3 leading-relaxed">
            Great job — you've completed this section, quiz and all. 🎉
          </p>
        )}
      </div>

      {/* Desktop-only: mobile's Practice tab is the mock-test entry */}
      <button
        className="hidden lg:flex w-full items-center gap-3 rounded-2xl p-4 mb-7 text-left shadow-[0_10px_26px_rgba(69,58,94,.3)]"
        style={{ background: 'linear-gradient(140deg, #453A5E, #67589B)' }}
        onClick={() => navigate(`${basePath}/tests`)}
      >
        <span className="w-[38px] h-[38px] rounded-[11px] bg-white/15 grid place-items-center text-white shrink-0">
          <IconTarget />
        </span>
        <span className="min-w-0">
          <b className="block text-[13.5px] font-extrabold text-white">Take a Mock Test</b>
          <span className="block text-[11px] font-semibold text-[#C9BEEC]">
            board-pattern papers, timed
          </span>
        </span>
        <IconChevronRight className="w-[18px] h-[18px] ml-auto text-[#C9BEEC] shrink-0" />
      </button>

      {/* Desktop-only: on mobile these shortcuts live in the sheet's
          Quiz & Explore tab (2026-07-28). */}
      <div className="hidden lg:block">
        <h3 className="font-display text-[15px] font-semibold text-v2-ink mb-2">
          Keep practising
        </h3>
        {/* Section-scoped shortcuts: rail = the altitude of the page you're
            on; the sidebar stays chapter-level (Uday 2026-07-27). */}
        {hasTimelinePractice && (
          <button
            className="w-full flex items-center gap-3 py-3 text-left border-b border-v2-line"
            onClick={() => navigate(`${basePath}/timeline?practice=${section.id}`)}
          >
            <span className="w-9 h-9 rounded-[10px] bg-v2-lav-soft text-hist-indigo grid place-items-center shrink-0">
              <IconCalendar className="w-4 h-4" />
            </span>
            <span className="min-w-0">
              <b className="block text-[13px] font-extrabold text-v2-ink">Order the events</b>
              <span className="block text-[11px] font-semibold text-v2-muted">
                timeline practice for this section
              </span>
            </span>
            <IconChevronRight className="w-4 h-4 ml-auto text-v2-muted shrink-0" />
          </button>
        )}
        {/* Desktop-only: on mobile this stacked right under the sheet's own
            Section Quiz card — the same door twice (2026-07-28). */}
        <button
          className="hidden lg:flex w-full items-center gap-3 py-3 text-left border-b border-v2-line"
          onClick={() => navigate(`${basePath}/section/${section.id}/quiz`)}
        >
          <span className="w-9 h-9 rounded-[10px] bg-v2-accent-soft text-v2-accent grid place-items-center shrink-0">
            <IconPencil className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <b className="block text-[13px] font-extrabold text-v2-ink">Section Quiz</b>
            <span className="block text-[11px] font-semibold text-v2-muted">
              completes this section
            </span>
          </span>
          <IconChevronRight className="w-4 h-4 ml-auto text-v2-muted shrink-0" />
        </button>
        <button
          className="w-full flex items-center gap-3 py-3 text-left"
          onClick={() => navigate(`${basePath}/flashcards?section=${section.id}`)}
        >
          <span className="w-9 h-9 rounded-[10px] bg-[#F3E9F3] text-hist-purple grid place-items-center shrink-0">
            <IconLayers className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <b className="block text-[13px] font-extrabold text-v2-ink">Flashcards</b>
            <span className="block text-[11px] font-semibold text-v2-muted">
              this section's cards
            </span>
          </span>
          <IconChevronRight className="w-4 h-4 ml-auto text-v2-muted shrink-0" />
        </button>
      </div>
    </div>
  )

  return (
    <WorkspaceShell
      chapterId={cid}
      chapterNumber={chapterNumber}
      crumbs={[
        { label: 'All Chapters', to: '/' },
        { label: chapter.title, to: basePath },
        { label: `Section ${section.number}` },
      ]}
      rail={rail}
    >
      {/* HERO — dark cinematic, the banner IS the surface */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[20px] overflow-hidden mb-7 min-h-[204px] md:min-h-[236px] flex items-center shadow-[0_18px_44px_rgba(42,34,51,.28)]"
        style={{ backgroundColor: '#2A2233' }}
      >
        {art && (
          <div
            className="absolute inset-0 opacity-50 md:opacity-100"
            style={{
              background: `url(${art}) right 30% / cover no-repeat`,
              filter: 'saturate(.92) brightness(.96)',
            }}
          />
        )}
        <div
          className="absolute inset-0 mix-blend-multiply"
          style={{ backgroundColor: 'rgba(58,38,28,.18)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg,rgba(30,23,40,.93) 8%,rgba(30,23,40,.8) 40%,rgba(30,23,40,.42) 66%,rgba(30,23,40,.18))',
          }}
        />
        <div className="relative px-6 md:px-[34px] py-[30px] max-w-full md:max-w-[63%]">
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-11 h-11 rounded-xl bg-v2-accent text-white grid place-items-center font-display font-bold text-[19px] shadow-[0_6px_16px_rgba(232,85,31,.35)]">
              S{section.number}
            </span>
            <span className="bg-white/[.18] text-[#FFD9C4] text-[10.5px] font-extrabold uppercase tracking-[0.6px] px-3 py-[5px] rounded-full">
              Section {section.number} of {chapter.sections.length}
            </span>
          </div>
          <h1 className="font-display text-[23px] md:text-[30px] font-semibold text-white leading-[1.12] mb-2">
            {section.title}
          </h1>
          {/* Mobile-only progress row + CTA (chapter-hero grammar, 2026-07-28) */}
          <div className="md:hidden mt-2.5">
            <div className="flex items-center gap-3 mb-3">
              <b className="font-display text-[15px] text-[#FFB68F] shrink-0">{pct}%</b>
              <div className="h-[5px] flex-1 rounded-full overflow-hidden bg-white/20">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: '#E8551F' }}
                />
              </div>
              <span className="text-[11px] font-bold text-[#C9BFD4] shrink-0">
                {topicsDone} of {section.subsections.length} topics
                {quizDone ? ' · quiz ✓' : ''}
              </span>
            </div>
            {heroCta ? (
              <>
                <button
                  className="flex items-center justify-center gap-2 w-full bg-v2-accent text-white font-extrabold text-[14.5px] py-3 rounded-2xl shadow-[0_6px_18px_rgba(232,85,31,.4)] btn-press"
                  onClick={() => navigate(heroCta.to)}
                >
                  {heroCta.label}
                  <IconChevronRight className="w-[15px] h-[15px]" />
                </button>
                <span className="block text-[11px] font-semibold text-[#C9BFD4] mt-2">
                  {heroCta.caption}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[#9FE0B4] bg-[rgba(62,142,90,.28)] rounded-full px-3 py-1 text-[12px] font-extrabold">
                <IconCheck className="w-3.5 h-3.5" />
                Section completed — quiz and all 🎉
              </span>
            )}
          </div>
          <div className="hidden md:flex items-center gap-4 text-[12.5px] font-bold text-[#C9BFD4] flex-wrap mt-1">
            <span className="flex items-center gap-1.5">
              <IconBook className="w-[15px] h-[15px] text-[#A99DB8]" />
              {section.subsections.length} topics
            </span>
            <span className="flex items-center gap-1.5">
              <IconQuiz className="w-[15px] h-[15px] text-[#A99DB8]" />1 quiz
            </span>
            {complete ? (
              <span className="flex items-center gap-1.5 text-[#9FE0B4] bg-[rgba(62,142,90,.28)] rounded-full px-3 py-1 font-extrabold">
                <IconCheck className="w-3.5 h-3.5" />
                Completed
              </span>
            ) : doneUnits > 0 ? (
              <span className="flex items-center gap-1.5 text-[#FFD9C4] bg-[rgba(232,85,31,.32)] rounded-full px-3 py-1 font-extrabold">
                <IconClock className="w-3.5 h-3.5" />
                In progress
              </span>
            ) : null}
          </div>
        </div>
      </motion.div>

      {/* Mobile-only: "What You'll Learn" as its own slim band between hero
          and sheet (Uday 2026-07-28, from his sample) — a page-level object,
          not a lodger inside the Topics tab. Desktop keeps it in the sheet. */}
      {section.keyPoints.length > 0 && (
        <details className="lg:hidden group bg-white rounded-2xl shadow-v2-sm px-4 py-3.5 mb-4">
          <summary className="flex items-center gap-3 cursor-pointer list-none">
            <span className="w-10 h-10 rounded-xl bg-v2-accent-soft grid place-items-center shrink-0">
              <IconTarget className="w-5 h-5 text-v2-accent" />
            </span>
            <span className="min-w-0 flex-1">
              <b className="block font-display text-[15.5px] font-semibold text-v2-ink">
                What You'll Learn
              </b>
              <span className="text-[11.5px] font-bold text-v2-muted">
                {section.keyPoints.length} takeaways · tap to see
              </span>
            </span>
            <IconChevronRight className="w-[18px] h-[18px] text-v2-muted shrink-0 group-open:rotate-90 transition-transform" />
          </summary>
          <div className="grid grid-cols-1 gap-y-3 mt-4 pt-3.5 border-t border-v2-line">
            {section.keyPoints.map((point, i) => (
              <div key={i} className="flex gap-2.5 text-[13.5px] font-medium text-v2-body leading-relaxed">
                <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-v2-accent grid place-items-center mt-[3px]">
                  <IconCheck className="w-2.5 h-2.5 text-white [stroke-width:3]" />
                </span>
                {point}
              </div>
            ))}
          </div>
        </details>
      )}

      {/* THE SHEET — one continuous surface */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white rounded-[20px] shadow-v2 px-5 md:px-9 py-8"
      >
        {/* Mobile sheet tabs — Topics | Quiz & Explore */}
        <div className="lg:hidden flex border-b border-v2-line mb-5 -mx-1">
          <button
            className={`flex-1 pb-2.5 font-display text-[15px] font-semibold border-b-2 -mb-px transition-colors ${
              sheetTab === 'topics'
                ? 'text-v2-accent border-v2-accent'
                : 'text-v2-muted border-transparent'
            }`}
            onClick={() => setSheetTab('topics')}
          >
            Topics
          </button>
          <button
            className={`flex-1 pb-2.5 font-display text-[15px] font-semibold border-b-2 -mb-px transition-colors ${
              sheetTab === 'practice'
                ? 'text-v2-accent border-v2-accent'
                : 'text-v2-muted border-transparent'
            }`}
            onClick={() => setSheetTab('practice')}
          >
            Quiz &amp; Explore
          </button>
        </div>

        <div className={`${sheetTab === 'topics' ? 'block' : 'hidden'} lg:block`}>
        {section.keyPoints.length > 0 && (
          <>
            <div className="hidden lg:block">
              <h2 className="flex items-center gap-2.5 font-display text-[19px] font-semibold text-v2-ink mb-[18px]">
                <IconTarget className="w-5 h-5 text-v2-accent" />
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-7 gap-y-3.5">
                {section.keyPoints.map((point, i) => (
                  <div key={i} className="flex gap-2.5 text-[13.5px] font-medium text-v2-body leading-relaxed">
                    <span className="shrink-0 w-[18px] h-[18px] rounded-full bg-v2-accent grid place-items-center mt-[3px]">
                      <IconCheck className="w-2.5 h-2.5 text-white [stroke-width:3]" />
                    </span>
                    {point}
                  </div>
                ))}
              </div>
              <hr className="border-0 h-px bg-v2-line my-7 -mx-2" />
            </div>
          </>
        )}

        {/* Topics — heading desktop-only: on mobile the "Topics" tab IS the
            heading (same treatment as Practice & Explore). */}
        <h2 className="hidden lg:flex items-center gap-2.5 font-display text-[19px] font-semibold text-v2-ink mb-2">
          <IconBook className="w-5 h-5 text-v2-accent" />
          Topics
        </h2>
        <div>
          {section.subsections.map((sub, i) => {
            const isCompleted = !!completedSubsections[sub.id]
            const isNext = i === firstIncomplete
            const cardCount = sub.narrativeCards.length
            const quizCount = sub.narrativeCards.filter((c) => c.inlineQuiz).length
            const est = Math.max(2, Math.round(cardCount * MIN_PER_CARD))

            return (
              <button
                key={sub.id}
                className={`w-full flex items-center gap-3.5 py-4 px-2.5 -mx-2.5 rounded-xl text-left hover:bg-[#FDF8F4] transition-colors ${
                  i < section.subsections.length - 1 ? 'border-b border-v2-line' : ''
                }`}
                onClick={() => navigate(topicPath(i))}
              >
                <span
                  className="w-[42px] h-[42px] rounded-full grid place-items-center shrink-0 font-display font-bold text-[15px]"
                  style={
                    isCompleted
                      ? { backgroundColor: '#E3F2E8', color: '#3E8E5A' }
                      : { backgroundColor: `${color}15`, color }
                  }
                >
                  {isCompleted ? <IconCheck className="w-[18px] h-[18px]" /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <h4 className="font-display text-[15.5px] font-semibold text-v2-ink leading-tight">
                    {sub.title}
                  </h4>
                  <span className="block text-[11.5px] font-semibold text-v2-muted mt-0.5">
                    {cardCount} cards
                    {quizCount > 0 && ` · ${quizCount} quiz${quizCount > 1 ? 'zes' : ''}`}
                    {!isCompleted && ` · ${est} min`}
                  </span>
                </span>
                <span className="flex items-center gap-3 shrink-0">
                  {isCompleted ? (
                    <span className="flex items-center gap-1.5 text-v2-ok text-[11.5px] font-extrabold">
                      <IconCheck className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  ) : isNext ? (
                    <span className="bg-v2-accent text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-full">
                      {topicsDone > 0 || quizDone ? 'Continue →' : 'Start →'}
                    </span>
                  ) : null}
                  {!isNext && <IconChevronRight className="w-[18px] h-[18px] text-v2-muted" />}
                </span>
              </button>
            )
          })}
        </div>
        </div>

        <div className={`${sheetTab === 'practice' ? 'block' : 'hidden'} lg:block`}>
        <hr className="hidden lg:block border-0 h-px bg-v2-line my-7 -mx-2" />

        {/* Practice & Explore — Neha's kept elements, embedded in the sheet.
            Heading is desktop-only: on mobile the "Quiz & Explore" tab IS the
            heading. */}
        <h2 className="hidden lg:flex items-center gap-2.5 font-display text-[19px] font-semibold text-v2-ink mb-4">
          <IconPencil className="w-5 h-5 text-v2-accent" />
          Practice &amp; Explore
        </h2>

        <button
          className="w-full flex items-center gap-3.5 border-[1.5px] border-v2-line bg-[#FDFAF7] hover:border-[#E3CFC2] rounded-2xl px-[18px] py-4 text-left transition-colors mb-6"
          onClick={() => navigate(`${basePath}/section/${sectionId}/quiz`)}
        >
          <span className="w-[46px] h-[46px] rounded-full bg-v2-accent-soft grid place-items-center text-[21px] shrink-0">
            🧠
          </span>
          <span className="min-w-0 flex-1">
            <h4 className="font-display text-[16.5px] font-semibold text-v2-ink">Section Quiz</h4>
            <span className="block text-[12.5px] font-semibold text-v2-body mt-0.5">
              MCQ, Fill in the Blank, True/False, Match the Following
            </span>
          </span>
          <IconChevronRight className="w-[18px] h-[18px] text-v2-accent shrink-0" />
        </button>

        <div className="mb-6">
          <SectionTimeline sectionId={section.id} sectionColor={color} chapterId={cid} />
        </div>
        <SectionMaps sectionId={section.id} sectionColor={color} chapterId={cid} />

        {/* Mobile-only: the rail's section-scoped shortcuts live in this tab
            (the rail is desktop-only on phones). */}
        <div className="lg:hidden mt-6 pt-1">
          {hasTimelinePractice && (
            <button
              className="w-full flex items-center gap-3 py-3 text-left border-b border-v2-line"
              onClick={() => navigate(`${basePath}/timeline?practice=${section.id}`)}
            >
              <span className="w-9 h-9 rounded-[10px] bg-v2-lav-soft text-hist-indigo grid place-items-center shrink-0">
                <IconCalendar className="w-4 h-4" />
              </span>
              <span className="min-w-0">
                <b className="block text-[13px] font-extrabold text-v2-ink">Order the events</b>
                <span className="block text-[11px] font-semibold text-v2-muted">
                  timeline practice for this section
                </span>
              </span>
              <IconChevronRight className="w-4 h-4 ml-auto text-v2-muted shrink-0" />
            </button>
          )}
          <button
            className="w-full flex items-center gap-3 py-3 text-left"
            onClick={() => navigate(`${basePath}/flashcards?section=${section.id}`)}
          >
            <span className="w-9 h-9 rounded-[10px] bg-[#F3E9F3] text-hist-purple grid place-items-center shrink-0">
              <IconLayers className="w-4 h-4" />
            </span>
            <span className="min-w-0">
              <b className="block text-[13px] font-extrabold text-v2-ink">Flashcards</b>
              <span className="block text-[11px] font-semibold text-v2-muted">
                this section's cards
              </span>
            </span>
            <IconChevronRight className="w-4 h-4 ml-auto text-v2-muted shrink-0" />
          </button>
        </div>
        </div>
      </motion.div>
    </WorkspaceShell>
  )
}
