import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getChapter, getChapterPreview, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { useProgressStore } from '../store/useProgressStore'
import { WorkspaceShell } from '../components/shell/WorkspaceShell'
import {
  IconBook,
  IconCheck,
  IconChevronRight,
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

  const rail = (
    <div>
      <div className="mb-7">
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

      <button
        className="w-full flex items-center gap-3 rounded-2xl p-4 mb-7 text-left shadow-[0_10px_26px_rgba(69,58,94,.3)]"
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

      <div>
        <h3 className="font-display text-[15px] font-semibold text-v2-ink mb-2">
          Keep practising
        </h3>
        <button
          className="w-full flex items-center gap-3 py-3 text-left border-b border-v2-line"
          onClick={() => navigate(`${basePath}/exam`)}
        >
          <span className="w-9 h-9 rounded-[10px] bg-v2-accent-soft text-v2-accent grid place-items-center shrink-0">
            <IconPencil className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <b className="block text-[13px] font-extrabold text-v2-ink">Practice questions</b>
            <span className="block text-[11px] font-semibold text-v2-muted">
              board-style, exam technique
            </span>
          </span>
          <IconChevronRight className="w-4 h-4 ml-auto text-v2-muted shrink-0" />
        </button>
        <button
          className="w-full flex items-center gap-3 py-3 text-left"
          onClick={() => navigate(`${basePath}/flashcards`)}
        >
          <span className="w-9 h-9 rounded-[10px] bg-[#F3E9F3] text-hist-purple grid place-items-center shrink-0">
            <IconLayers className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <b className="block text-[13px] font-extrabold text-v2-ink">Flashcards</b>
            <span className="block text-[11px] font-semibold text-v2-muted">
              revise this chapter's cards
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
      crumbs={[{ label: 'Overview', to: basePath }, { label: `Section ${section.number}` }]}
      rail={rail}
    >
      {/* HERO — dark cinematic, the banner IS the surface */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[20px] overflow-hidden mb-7 min-h-[236px] flex items-center shadow-[0_18px_44px_rgba(42,34,51,.28)]"
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
          <div className="flex items-center gap-4 text-[12.5px] font-bold text-[#C9BFD4] flex-wrap mt-1">
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

      {/* THE SHEET — one continuous surface */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
        className="bg-white rounded-[20px] shadow-v2 px-5 md:px-9 py-8"
      >
        {section.keyPoints.length > 0 && (
          <>
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
          </>
        )}

        {/* Topics */}
        <h2 className="flex items-center gap-2.5 font-display text-[19px] font-semibold text-v2-ink mb-2">
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

        <hr className="border-0 h-px bg-v2-line my-7 -mx-2" />

        {/* Practice & Explore — Neha's kept elements, embedded in the sheet */}
        <h2 className="flex items-center gap-2.5 font-display text-[19px] font-semibold text-v2-ink mb-4">
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
            <h4 className="font-display text-[16.5px] font-semibold text-v2-ink">Practice Quiz</h4>
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
      </motion.div>
    </WorkspaceShell>
  )
}
