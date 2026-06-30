import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getChapter, CHAPTER_SECTION_COLORS } from '../data/getChapter'
import { SectionHeader } from '../components/layout/SectionHeader'
import { NarrativeMode } from './NarrativeMode'
import { useProgressStore } from '../store/useProgressStore'
import { SectionTimeline } from '../components/section/SectionTimeline'
import { SectionMaps } from '../components/section/SectionMaps'
import type { SectionId } from '../types/progress'

export function SectionModule() {
  const { sectionId, chapterId } = useParams<{ sectionId: string; chapterId: string }>()
  const navigate = useNavigate()
  const basePath = `/chapter/${chapterId || 'ch1'}`
  const [activeSubsection, setActiveSubsection] = useState<number | null>(null)
  const completedSubsections = useProgressStore((s) => s.completedSubsections)
  const sectionProgress = useProgressStore((s) => s.sections[sectionId as SectionId])

  const cid = chapterId || 'ch1'
  const chapter = getChapter(cid)
  const section = chapter?.sections.find((s) => s.id === sectionId)

  if (!section) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h2 className="font-display text-xl font-bold text-hist-dark mb-2">Section Not Found</h2>
          <motion.button
            className="bg-hist-gold text-white font-display px-6 py-2.5 rounded-full shadow-button btn-press mt-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
          >
            Back to Home
          </motion.button>
        </div>
      </div>
    )
  }

  const sectionColors = CHAPTER_SECTION_COLORS[cid] || {}
  const color = sectionColors[section.id] || '#3E3548'
  const completedCount = section.subsections.filter((sub) => completedSubsections[sub.id]).length
  const progress = section.subsections.length > 0
    ? Math.round((completedCount / section.subsections.length) * 100)
    : 0

  // If in narrative mode, render it
  if (activeSubsection !== null) {
    const subsection = section.subsections[activeSubsection]
    return (
      <NarrativeMode
        key={subsection.id}
        subsection={subsection}
        sectionColor={color}
        subsectionIndex={activeSubsection}
        totalSubsections={section.subsections.length}
        onComplete={() => {
          // Subsection marked complete inside NarrativeMode
        }}
        onNextSubsection={() => {
          if (activeSubsection < section.subsections.length - 1) {
            setActiveSubsection(activeSubsection + 1)
          } else {
            setActiveSubsection(null)
          }
        }}
        onBackToSection={() => setActiveSubsection(null)}
      />
    )
  }

  // Section overview with subsection list
  const chapterNumber = cid === 'ch2' ? 2 : 1
  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumb — always offers a direct path back to the chapter menu,
          independent of browser history (the header back arrow uses history). */}
      <nav className="flex items-center flex-wrap gap-x-1.5 gap-y-1 text-[12.5px] font-semibold text-hist-muted mb-4 px-0.5">
        <button className="hover:text-hist-navy transition-colors" onClick={() => navigate('/')}>All Chapters</button>
        <span aria-hidden>·</span>
        <button className="hover:text-hist-navy transition-colors" onClick={() => navigate(basePath)}>Chapter {chapterNumber}</button>
        <span aria-hidden>·</span>
        <span className="text-hist-navy truncate max-w-[55%]">{section.title}</span>
      </nav>

      <SectionHeader
        title={section.title}
        sectionNumber={section.number}
        color={color}
        progress={progress}
        totalStars={sectionProgress?.stars || 0}
        maxStars={sectionProgress?.maxStars || 0}
      />

      {/* Key Points */}
      {section.keyPoints.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-5 shadow-card mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">🎯</span>
            <h3 className="font-display font-bold text-hist-dark">What You'll Learn</h3>
          </div>
          <ul className="space-y-2">
            {section.keyPoints.map((point, i) => (
              <li key={i} className="flex gap-2 text-sm font-body text-hist-dark/80">
                <span className="shrink-0 mt-0.5" style={{ color }}>•</span>
                {point}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Primary CTA — Start Reading (the main action sits up top, before the topic list and review tools) */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <motion.button
          className="w-full text-white font-display text-lg px-8 py-4 rounded-2xl shadow-button btn-press flex items-center justify-center gap-2"
          style={{ backgroundColor: color }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            const firstIncomplete = section.subsections.findIndex((sub) => !completedSubsections[sub.id])
            setActiveSubsection(firstIncomplete >= 0 ? firstIncomplete : 0)
          }}
        >
          <span className="text-xl">📖</span>
          {completedCount === 0
            ? 'Start Reading'
            : completedCount < section.subsections.length
              ? 'Continue Reading'
              : 'Read Again'}
        </motion.button>
        <p className="text-center text-xs text-gray-400 font-body mt-2">
          Or jump to a specific topic below · timeline &amp; maps for revision are further down
        </p>
      </motion.div>

      {/* Subsection Cards */}
      <div className="space-y-3">
        <h3 className="font-display font-bold text-hist-dark flex items-center gap-2">
          <span className="text-lg">📖</span>
          Topics
        </h3>
        {section.subsections.map((sub, i) => {
          const isCompleted = completedSubsections[sub.id]
          const cardCount = sub.narrativeCards.length
          const quizCount = sub.narrativeCards.filter((c) => c.inlineQuiz).length

          return (
            <motion.button
              key={sub.id}
              className={`w-full text-left bg-white rounded-2xl p-4 sm:p-5 shadow-card transition-shadow ${
                isCompleted ? 'ring-2 ring-green-200' : 'hover:shadow-card-hover'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setActiveSubsection(i)}
            >
              <div className="flex items-center gap-3">
                {/* Number/check */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-display font-bold text-sm"
                  style={
                    isCompleted
                      ? { backgroundColor: '#5C936820', color: '#5C9368' }
                      : { backgroundColor: `${color}15`, color }
                  }
                >
                  {isCompleted ? '✓' : i + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-display font-bold text-hist-dark text-sm sm:text-base leading-tight">
                    {sub.title}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                    <span>{cardCount} cards</span>
                    {quizCount > 0 && <span>{quizCount} quiz{quizCount > 1 ? 'zes' : ''}</span>}
                    {isCompleted && (
                      <span className="text-green-500 font-bold">Completed</span>
                    )}
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={isCompleted ? '#5C9368' : color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="shrink-0"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Practice Quiz Card */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button
          className="w-full bg-white rounded-2xl p-4 sm:p-5 shadow-card hover:shadow-card-hover text-left"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate(`${basePath}/section/${sectionId}/quiz`)}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${color}15` }}
            >
              <span className="text-lg">🧠</span>
            </div>
            <div className="flex-1">
              <h4 className="font-display font-bold text-hist-dark text-sm sm:text-base">
                Practice Quiz
              </h4>
              <p className="text-xs text-gray-400 font-body mt-0.5">
                MCQ, Fill in the Blank, True/False, Match the Following
              </p>
            </div>
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              className="shrink-0"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </motion.button>
      </motion.div>

      {/* Explore Timeline for this section */}
      <motion.div
        className="mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <SectionTimeline sectionId={section.id} sectionColor={color} chapterId={cid} />
      </motion.div>

      {/* Explore Maps for this section */}
      <motion.div
        className="mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <SectionMaps sectionId={section.id} sectionColor={color} chapterId={cid} />
      </motion.div>
    </div>
  )
}
