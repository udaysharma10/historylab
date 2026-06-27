import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { NarrativeCard as NarrativeCardType } from '../../types/chapter'
import { figures } from '../../data/figures'
import { FigureHotspotOverlay } from '../figure/FigureHotspotOverlay'

interface NarrativeCardProps {
  card: NarrativeCardType
  sectionColor: string
}

// Parse **bold** markers in text and return React elements
function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <span className={className}>
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? (
          <strong key={i} className="font-bold text-hist-dark">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  )
}

// Visual icons for figure types
const FIGURE_TYPE_ICONS: Record<string, string> = {
  painting: '🎨',
  caricature: '✏️',
  map: '🗺️',
  photograph: '📷',
  stamp: '📮',
  banner: '🏴',
  almanac: '📰',
  illustration: '🖌️',
}

function FigurePanel({ figureId, sectionColor }: { figureId: string; sectionColor: string }) {
  const figure = figures.find((f) => f.id === figureId)
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null)
  if (!figure) return null

  const typeIcon = FIGURE_TYPE_ICONS[figure.type] || '🖼️'
  const hasHotspots = figure.hotspots.length > 0

  return (
    <div className="mb-5 rounded-2xl overflow-hidden" style={{ border: `2px solid ${sectionColor}30` }}>
      {/* Figure header with gradient */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: `linear-gradient(135deg, ${sectionColor}15, ${sectionColor}08)` }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">{typeIcon}</span>
          <div>
            <span className="font-display font-bold text-base" style={{ color: sectionColor }}>
              Figure {figure.number}
            </span>
            {figure.year && (
              <span className="text-sm text-gray-400 ml-2">({figure.year})</span>
            )}
          </div>
        </div>
        {figure.examRelevance === 'high' && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-200">
            Exam Important
          </span>
        )}
      </div>

      {/* Actual figure image — interactive when hotspots exist */}
      {hasHotspots ? (
        <div className="p-3 bg-white">
          <FigureHotspotOverlay
            figure={figure}
            sectionColor={sectionColor}
            activeHotspotId={activeHotspot}
            onHotspotClick={setActiveHotspot}
          />
          <p className="mt-2 text-xs font-body italic text-center text-gray-400">
            👆 Tap the <span style={{ color: sectionColor }} className="font-bold">+</span> dots on the picture to explore each feature
          </p>
        </div>
      ) : (
        <div className="relative">
          <img
            src={figure.imagePath}
            alt={figure.title}
            className="w-full object-contain"
            loading="lazy"
          />
        </div>
      )}

      {/* Caption + title */}
      <div
        className="px-4 py-3"
        style={{ background: `linear-gradient(180deg, ${sectionColor}06, ${sectionColor}02)` }}
      >
        <h4 className="font-display font-bold text-hist-dark text-base leading-snug mb-1">
          "{figure.title}"
        </h4>
        {figure.artist && (
          <p className="text-sm text-gray-400 italic">
            — {figure.artist}{figure.year ? `, ${figure.year}` : ''}
          </p>
        )}

        {/* Hotspot tags — click to highlight the feature on the picture */}
        {hasHotspots && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {figure.hotspots.map((spot) => {
              const isActive = activeHotspot === spot.id
              return (
                <motion.button
                  key={spot.id}
                  type="button"
                  onClick={() => setActiveHotspot(isActive ? null : spot.id)}
                  className="text-xs px-2.5 py-1 rounded-full font-body font-semibold cursor-pointer"
                  style={{
                    backgroundColor: isActive ? sectionColor : `${sectionColor}12`,
                    color: isActive ? 'white' : sectionColor,
                    border: `1px solid ${isActive ? sectionColor : `${sectionColor}25`}`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={spot.description}
                >
                  {spot.label}
                </motion.button>
              )
            })}
          </div>
        )}
      </div>

      {/* Analysis — always expanded */}
      <div className="border-t px-5 py-4 space-y-3" style={{ borderColor: `${sectionColor}15` }}>
        <p className="font-display font-bold text-sm" style={{ color: sectionColor }}>
          Analysis
        </p>
        <div>
          <p className="font-display font-bold text-xs text-gray-400 uppercase tracking-wider mb-1.5">What It Means</p>
          <ul className="space-y-1.5">
            {figure.analysis.whatItMeans.map((item, i) => (
              <li key={i} className="flex gap-2 text-[0.95rem] font-body text-hist-dark/80">
                <span className="shrink-0 mt-0.5" style={{ color: sectionColor }}>&#x2022;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div
          className="rounded-lg p-3 flex gap-2 items-start"
          style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}
        >
          <span className="text-sm shrink-0">💡</span>
          <p className="font-body text-sm text-amber-800 leading-relaxed">
            <strong>Exam Tip:</strong> {figure.analysis.examTip}
          </p>
        </div>
      </div>
    </div>
  )
}

export function NarrativeCard({ card, sectionColor }: NarrativeCardProps) {
  const type = card.type || 'text'

  // ── Vocabulary Card ──
  if (type === 'vocabulary') {
    // Extract the term from text (format: "Term — definition")
    const dashIndex = card.text.indexOf('—')
    const term = dashIndex > 0 ? card.text.slice(0, dashIndex).trim() : ''
    const definition = dashIndex > 0 ? card.text.slice(dashIndex + 1).trim() : card.text

    return (
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '2px solid #DDD6FE' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-purple-500 flex items-center justify-center">
              <span className="text-white text-base font-bold">Aa</span>
            </div>
            <span className="font-display font-bold text-purple-700 text-base">Vocabulary</span>
          </div>

          {term && (
            <motion.h3
              className="font-display text-3xl font-bold text-purple-900 mb-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {term}
            </motion.h3>
          )}

          <motion.p
            className="font-body text-lg leading-relaxed text-purple-900/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <RichText text={definition} />
          </motion.p>

          <div className="mt-4 flex items-center gap-2 text-sm text-purple-400">
            <span>📝</span>
            <span className="font-body italic">Remember this term for exams</span>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Source Card ──
  if (type === 'source') {
    return (
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '2px solid #FDE68A' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
              <span className="text-white text-lg">📜</span>
            </div>
            <span className="font-display font-bold text-amber-700 text-base">Primary Source</span>
          </div>

          {card.title && (
            <h3 className="font-display text-xl font-bold text-amber-900 mb-3">{card.title}</h3>
          )}

          {/* Large quotation mark */}
          <div className="relative">
            <span className="absolute -top-2 -left-1 font-display text-6xl text-amber-200 leading-none select-none">"</span>
            <motion.p
              className="font-body text-lg leading-relaxed text-amber-900/85 pl-8 italic"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <RichText text={card.text} />
            </motion.p>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-200 flex items-center gap-2 text-sm text-amber-500">
            <span>🏛️</span>
            <span className="font-body">Historical document — exam-relevant source material</span>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── Figure Card ──
  if (type === 'figure') {
    return (
      <motion.div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ border: '2px solid #E5E7EB' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-5 sm:p-7">
          {card.title && (
            <h3 className="font-display text-xl font-bold mb-4" style={{ color: sectionColor }}>
              {card.title}
            </h3>
          )}

          {/* Figure panel */}
          {card.imageId && (
            <FigurePanel figureId={card.imageId} sectionColor={sectionColor} />
          )}

          {/* Narrative text */}
          <p className="font-body text-lg leading-relaxed text-hist-dark/90">
            <RichText text={card.text} />
          </p>

          {card.highlight && (
            <HighlightBox text={card.highlight} color={sectionColor} />
          )}
        </div>
      </motion.div>
    )
  }

  // ── Exam Prep Card ──
  if (type === 'exam-prep') {
    const lines = card.text.split('\n').filter((l) => l.trim())
    const questionLine = lines.find((l) => l.trim().startsWith('Q:'))
    const marksLine = lines.find((l) => l.trim().startsWith('Marks:'))
    const answerLines = lines.filter((l) => l.trim().startsWith('A:'))
    const tipLines = lines.filter((l) => l.trim().startsWith('Tip:'))

    const question = questionLine ? questionLine.replace(/^Q:\s*/, '') : ''
    const marks = marksLine ? marksLine.replace(/^Marks:\s*/, '') : ''
    const answers = answerLines.map((l) => l.replace(/^A:\s*/, ''))
    const tips = tipLines.map((l) => l.replace(/^Tip:\s*/, ''))

    return (
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '2px solid #A7F3D0' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <span className="text-white text-base font-bold">A+</span>
            </div>
            <span className="font-display font-bold text-emerald-800 text-base">CBSE Exam Prep</span>
          </div>
          {marks && (
            <span className="text-sm font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
              {marks}
            </span>
          )}
        </div>

        <div className="px-6 pb-6">
          {/* Question */}
          {question && (
            <motion.div
              className="mb-5 p-4 rounded-xl bg-white/60 border border-emerald-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <p className="font-display font-bold text-xs text-emerald-600 uppercase tracking-wider mb-1.5">
                Likely Exam Question
              </p>
              <p className="font-body text-lg font-semibold text-emerald-900 leading-snug">
                "{question}"
              </p>
            </motion.div>
          )}

          {/* Answer points */}
          {answers.length > 0 && (
            <div className="space-y-3 mb-5">
              <p className="font-display font-bold text-xs text-emerald-600 uppercase tracking-wider">
                Key Points to Include
              </p>
              {answers.map((ans, i) => (
                <motion.div
                  key={i}
                  className="flex gap-3 items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                >
                  <span
                    className="shrink-0 w-6 h-6 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center mt-0.5"
                  >
                    {i + 1}
                  </span>
                  <p className="font-body text-[0.95rem] text-emerald-900/85 leading-snug">
                    <RichText text={ans} />
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Exam tips */}
          {tips.map((tip, i) => (
            <motion.div
              key={i}
              className="rounded-lg p-3.5 flex gap-2 items-start bg-amber-50 border border-amber-200 mt-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-base shrink-0">💡</span>
              <p className="font-body text-sm text-amber-800 leading-relaxed">
                <strong>Exam Tip:</strong> {tip}
              </p>
            </motion.div>
          ))}

          {card.highlight && (
            <HighlightBox text={card.highlight} color="#059669" />
          )}
        </div>
      </motion.div>
    )
  }

  // ── Timeline Reference Card ──
  if (type === 'timeline-ref') {
    // Parse timeline events from text: "YEAR — Event" per line
    const events = card.text.split('\n').filter((l) => l.trim()).map((line) => {
      const match = line.match(/^(\d{4}(?:\s*[-–]\s*\d{2,4})?)\s*[-–—]\s*(.+)$/)
      return match ? { year: match[1], event: match[2] } : null
    }).filter(Boolean) as { year: string; event: string }[]

    return (
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)', border: '2px solid #BFDBFE' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionColor }}>
              <span className="text-white text-base">📅</span>
            </div>
            <span className="font-display font-bold text-base" style={{ color: sectionColor }}>
              {card.title || 'Section Timeline'}
            </span>
          </div>

          {/* Timeline visual */}
          <div className="relative pl-6 space-y-0">
            {/* Vertical line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5" style={{ backgroundColor: `${sectionColor}30` }} />

            {events.map((evt, i) => (
              <motion.div
                key={i}
                className="relative flex gap-4 items-start pb-4"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                {/* Dot on timeline */}
                <div
                  className="absolute left-[-17px] top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white shrink-0 z-10"
                  style={{ borderColor: sectionColor }}
                />
                {/* Year badge */}
                <span
                  className="shrink-0 text-sm font-display font-bold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}
                >
                  {evt.year}
                </span>
                {/* Event text */}
                <p className="font-body text-[0.95rem] text-hist-dark/85 leading-snug pt-0.5">
                  <RichText text={evt.event} />
                </p>
              </motion.div>
            ))}
          </div>

          {card.highlight && (
            <HighlightBox text={card.highlight} color={sectionColor} />
          )}
        </div>
      </motion.div>
    )
  }

  // ── Map Reference Card ──
  if (type === 'map-ref') {
    return (
      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)', border: '2px solid #A7F3D0' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="p-6 sm:p-7">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: sectionColor }}>
              <span className="text-white text-base">🗺️</span>
            </div>
            <span className="font-display font-bold text-base" style={{ color: sectionColor }}>
              {card.title || 'Map Reference'}
            </span>
          </div>

          {/* Map image if provided */}
          {card.imageId && (
            <FigurePanel figureId={card.imageId} sectionColor={sectionColor} />
          )}

          {/* Description text */}
          <p className="font-body text-lg leading-relaxed text-hist-dark/90">
            <RichText text={card.text} />
          </p>

          {card.highlight && (
            <HighlightBox text={card.highlight} color={sectionColor} />
          )}
        </div>
      </motion.div>
    )
  }

  // ── Flowchart Card (clickable steps with pop-up explanations) ──
  if (type === 'flowchart') {
    return (
      <motion.div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ border: '2px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />
        <div className="p-6 sm:p-8">
          {card.title && (
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color: sectionColor }}>
              {card.title}
            </h3>
          )}
          {card.text && card.text.trim() && (
            <p className="font-body text-base text-hist-dark/70 mb-5 leading-relaxed">
              <RichText text={card.text} />
            </p>
          )}
          <FlowchartSteps steps={card.steps || []} color={sectionColor} />
          {card.highlight && <HighlightBox text={card.highlight} color={sectionColor} />}
        </div>
      </motion.div>
    )
  }

  // ── Table Card ──
  if (type === 'table') {
    const table = card.table
    return (
      <motion.div
        className="rounded-2xl overflow-hidden bg-white"
        style={{ border: '2px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.3 }}
      >
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />
        <div className="p-5 sm:p-7">
          {card.title && (
            <h3 className="font-display text-xl sm:text-2xl font-bold mb-2" style={{ color: sectionColor }}>
              {card.title}
            </h3>
          )}
          {card.text && card.text.trim() && (
            <p className="font-body text-base text-hist-dark/70 mb-4 leading-relaxed">
              <RichText text={card.text} />
            </p>
          )}
          {table && (
            <div className="overflow-x-auto rounded-xl" style={{ border: `1px solid ${sectionColor}25` }}>
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr style={{ backgroundColor: `${sectionColor}12` }}>
                    {table.headers.map((h, i) => (
                      <th
                        key={i}
                        className="font-display font-bold text-sm sm:text-base px-3.5 py-2.5 align-top"
                        style={{ color: sectionColor, borderBottom: `2px solid ${sectionColor}30` }}
                      >
                        <RichText text={h} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row, ri) => (
                    <tr key={ri} style={{ backgroundColor: ri % 2 === 1 ? `${sectionColor}06` : 'transparent' }}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="font-body text-[0.95rem] text-hist-dark/85 px-3.5 py-2.5 align-top leading-snug"
                          style={{ borderBottom: `1px solid ${sectionColor}12` }}
                        >
                          <RichText text={cell} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {card.highlight && <HighlightBox text={card.highlight} color={sectionColor} />}
        </div>
      </motion.div>
    )
  }

  // ── Default Text Card ──
  return (
    <motion.div
      className="rounded-2xl overflow-hidden bg-white"
      style={{ border: '2px solid #F3F4F6', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.3 }}
    >
      {/* Decorative top accent */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${sectionColor}, ${sectionColor}60)` }} />

      <div className="p-6 sm:p-8">
        {/* Card title */}
        {card.title && (
          <motion.h3
            className="font-display text-xl sm:text-2xl font-bold mb-4"
            style={{ color: sectionColor }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {card.title}
          </motion.h3>
        )}

        {/* Body text — larger, with bold support */}
        <p className="font-body text-lg sm:text-xl leading-[1.8] text-hist-dark/85">
          <RichText text={card.text} />
        </p>

        {card.highlight && (
          <HighlightBox text={card.highlight} color={sectionColor} />
        )}
      </div>
    </motion.div>
  )
}

function FlowchartSteps({ steps, color }: { steps: { label: string; detail: string }[]; color: string }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i}>
            <motion.button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full text-left rounded-xl px-4 py-3 flex items-center gap-3 btn-press"
              style={{
                background: isOpen
                  ? `linear-gradient(135deg, ${color}18, ${color}28)`
                  : `linear-gradient(135deg, ${color}0C, ${color}14)`,
                border: `2px solid ${isOpen ? color : `${color}30`}`,
              }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <span
                className="shrink-0 w-8 h-8 rounded-full text-white text-sm font-bold flex items-center justify-center"
                style={{ backgroundColor: color }}
              >
                {i + 1}
              </span>
              <span className="font-display font-bold text-base flex-1 leading-snug" style={{ color: 'var(--color-hist-dark, #2C3E50)' }}>
                <RichText text={step.label} />
              </span>
              <motion.span
                className="shrink-0 text-lg"
                style={{ color }}
                animate={{ rotate: isOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                ›
              </motion.span>
            </motion.button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="mx-3 my-2 rounded-lg px-4 py-3 font-body text-[0.95rem] text-hist-dark/85 leading-relaxed"
                    style={{ backgroundColor: `${color}08`, borderLeft: `4px solid ${color}` }}
                  >
                    <RichText text={step.detail} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Connector arrow between steps */}
            {i < steps.length - 1 && (
              <div className="flex justify-center py-1">
                <span className="text-lg leading-none" style={{ color: `${color}80` }}>↓</span>
              </div>
            )}
          </div>
        )
      })}
      <p className="mt-3 text-xs font-body italic text-center" style={{ color: `${color}AA` }}>
        Tap each step to see the explanation
      </p>
    </div>
  )
}

function HighlightBox({ text, color }: { text: string; color: string }) {
  return (
    <motion.div
      className="mt-5 rounded-xl p-4 sm:p-5 flex gap-3 items-start"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}20)`,
        borderLeft: `5px solid ${color}`,
      }}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <span className="text-xl shrink-0 mt-0.5">📌</span>
      <div>
        <p className="font-display font-bold text-sm uppercase tracking-wider mb-1.5" style={{ color }}>
          Remember This
        </p>
        <p className="font-body text-base font-semibold leading-snug text-hist-dark/85">
          <RichText text={text} />
        </p>
      </div>
    </motion.div>
  )
}
