import { useNavigate, useParams } from 'react-router-dom'
import {
  getFlashcards,
  getKeyDates,
  getFigures,
  getMapDefinitions,
} from '../data/getChapter'
import { IconChevronRight } from '../components/shell/icons'

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

  // Illustrated tiles (Uday's infographics, 2026-07-28) — big visual left,
  // real counts right, tinted card, circular arrow. Reference: intern round 2.
  const tools = [
    {
      to: `${base}/flashcards`,
      img: '/images/revise-flashcards.png',
      tint: 'bg-v2-lav-soft/60',
      title: 'Flashcards',
      count: `${cards} smart cards`,
      bullet: 'spaced repetition',
    },
    {
      to: `${base}/timeline`,
      img: '/images/revise-timeline.png',
      tint: 'bg-v2-accent-soft/60',
      title: 'Timeline',
      count: dates.length ? `${dates.length} key events` : 'Every key date',
      bullet: years ? `${years} · tap any year` : 'in order',
    },
    {
      to: `${base}/maps`,
      img: '/images/revise-maps.png',
      tint: 'bg-v2-ok-bg/70',
      title: 'Maps',
      count: maps > 0 ? 'Board map work' : 'Map work',
      bullet: 'explore, identify & label',
    },
    {
      to: `${base}/figures`,
      img: '/images/revise-figures.png',
      tint: 'bg-v2-page2',
      title: 'Figures',
      count: `${figures} NCERT figures`,
      bullet: 'explore & remember',
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

      <div className="space-y-3">
        {tools.map(({ to, img, tint, title, count, bullet }) => (
          <button
            key={to}
            className={`w-full flex items-center gap-4 ${tint} border border-v2-line rounded-[20px] px-4 py-4 text-left btn-press`}
            onClick={() => navigate(to)}
          >
            <img src={img} alt="" className="w-[96px] h-[76px] object-contain shrink-0 drop-shadow-sm" />
            <span className="flex-1 min-w-0">
              <b className="block font-display text-[18px] font-semibold text-v2-ink">{title}</b>
              <span className="block text-[13px] font-bold text-v2-ink/85 mt-0.5">{count}</span>
              <span className="block text-[12px] font-semibold text-v2-muted">• {bullet}</span>
            </span>
            <span className="w-10 h-10 rounded-full bg-white shadow-v2-sm grid place-items-center shrink-0">
              <IconChevronRight className="w-4 h-4 text-v2-ink" />
            </span>
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
