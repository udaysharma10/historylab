import { useNavigate, useParams } from 'react-router-dom'
import {
  getFlashcards,
  getKeyDates,
  getFigures,
  getMapDefinitions,
} from '../data/getChapter'
import { IconLayers, IconCalendar, IconMap, IconImage, IconChevronRight } from '../components/shell/icons'

// Mobile Revise hub (2026-07-28 mobile track) — the landing for the Revise
// bottom tab. Desktop never links here (the sidebar lists the four tools
// directly); the page still renders fine if visited on a wide screen.
export function RevisionHub() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const cid = chapterId || 'ch1'
  const base = `/chapter/${cid}`

  const cards = getFlashcards(cid).length
  const dates = getKeyDates(cid)
  const figures = getFigures(cid).length
  const maps = getMapDefinitions(cid).length
  const yearOf = (d: { year: string | number }) => parseInt(String(d.year), 10)
  const years = dates.length
    ? `${Math.min(...dates.map(yearOf))} – ${Math.max(...dates.map(yearOf))}`
    : ''

  const tools = [
    {
      to: `${base}/flashcards`,
      Icon: IconLayers,
      tint: 'bg-v2-lav-soft text-v2-lav',
      title: 'Flashcards',
      sub: `${cards} smart cards · spaced repetition`,
    },
    {
      to: `${base}/timeline`,
      Icon: IconCalendar,
      tint: 'bg-v2-accent-soft text-v2-accent-deep',
      title: 'Timeline',
      sub: dates.length ? `${dates.length} key events, ${years}` : 'Every key date, in order',
    },
    {
      to: `${base}/maps`,
      Icon: IconMap,
      tint: 'bg-v2-ok-bg text-v2-ok',
      title: 'Maps',
      sub: maps > 0 ? 'Explore & label — the way boards ask' : 'Board map work',
    },
    {
      to: `${base}/figures`,
      Icon: IconImage,
      tint: 'bg-v2-page2 text-v2-accent-deep',
      title: 'Figures',
      sub: `${figures} NCERT figures, explorable`,
    },
  ]

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-[22px] font-semibold text-v2-ink leading-tight">
        Revise &amp; strengthen
      </h1>
      <p className="text-[12.5px] font-semibold text-v2-muted mb-4">
        Quick ways to revise everything in this chapter
      </p>

      <div className="space-y-2.5">
        {tools.map(({ to, Icon, tint, title, sub }) => (
          <button
            key={to}
            className="w-full flex items-center gap-3.5 bg-white border border-v2-line rounded-2xl px-4 py-3.5 text-left shadow-v2 btn-press"
            onClick={() => navigate(to)}
          >
            <span className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${tint}`}>
              <Icon className="w-[22px] h-[22px]" />
            </span>
            <span className="flex-1 min-w-0">
              <b className="block font-display text-[16px] font-semibold text-v2-ink">{title}</b>
              <span className="text-[12px] font-semibold text-v2-muted">{sub}</span>
            </span>
            <IconChevronRight className="w-4 h-4 text-v2-muted shrink-0" />
          </button>
        ))}
      </div>

      <div className="flex gap-3 bg-v2-accent-soft/50 border border-v2-line rounded-2xl px-4 py-3.5 mt-4">
        <span className="text-[19px]">💡</span>
        <div>
          <b className="block text-[12.5px] font-bold text-v2-ink">How to revise effectively?</b>
          <p className="text-[12px] font-medium text-v2-ink/80 leading-relaxed mt-0.5">
            Do your due flashcards daily, then test yourself with a section quiz. Reading feels
            like revision — recall is revision.
          </p>
        </div>
      </div>
    </div>
  )
}
