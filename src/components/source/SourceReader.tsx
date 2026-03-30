import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SourceBox } from '../../types/chapter'

const SECTION_COLORS: Record<string, string> = {
  s1: '#C0392B', s2: '#2980B9', s3: '#E67E22',
  s4: '#27AE60', s5: '#7D3C98', s6: '#16A085',
}

interface SourceReaderProps {
  source: SourceBox
  onBack: () => void
}

export function SourceReader({ source, onBack }: SourceReaderProps) {
  const [showAnalysis, setShowAnalysis] = useState(true)
  const color = SECTION_COLORS[source.sectionId] || '#2980B9'

  return (
    <div className="max-w-lg mx-auto">
      <motion.button
        className="text-gray-400 font-body text-sm mb-3 flex items-center gap-1 hover:text-hist-dark"
        onClick={onBack}
        whileHover={{ x: -3 }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        Back
      </motion.button>

      <motion.div
        className="bg-white rounded-2xl shadow-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Top accent */}
        <div className="h-1.5" style={{ background: `linear-gradient(90deg, #D4A017, #E67E22)` }} />

        <div className="p-5 sm:p-7">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              Primary Source
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
              S{source.sectionId.replace('s', '')}
            </span>
          </div>

          <h2 className="font-display text-xl font-bold text-hist-dark mb-1">
            {source.label}: {source.title}
          </h2>
          <p className="font-body text-sm text-gray-500 mb-5">
            {source.author}{source.year ? `, ${source.year}` : ''}
          </p>

          {/* Source text — parchment style */}
          <div className="bg-amber-50/60 border border-amber-200/50 rounded-xl p-5 mb-5 relative">
            <span className="absolute top-2 left-3 text-5xl text-amber-300/40 font-display leading-none select-none">"</span>
            <p className="font-body text-sm sm:text-base text-hist-dark/90 leading-relaxed italic pl-6 whitespace-pre-line">
              {source.text}
            </p>
            <span className="absolute bottom-2 right-4 text-5xl text-amber-300/40 font-display leading-none select-none rotate-180">"</span>
          </div>

          {/* Analysis toggle */}
          <motion.button
            className="w-full flex items-center justify-between bg-green-50 border border-green-200/50 rounded-xl p-4 mb-3"
            onClick={() => setShowAnalysis(!showAnalysis)}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <span className="font-display font-bold text-sm text-green-700">
                What This Source Means
              </span>
            </div>
            <motion.span
              className="text-green-500 text-sm"
              animate={{ rotate: showAnalysis ? 180 : 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
            </motion.span>
          </motion.button>

          {showAnalysis && (
            <motion.div
              className="space-y-2.5 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              {source.analysis.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 pl-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-[10px] font-bold mt-0.5">
                    {i + 1}
                  </span>
                  <p className="font-body text-sm text-hist-dark/80 leading-snug">
                    {point}
                  </p>
                </div>
              ))}
            </motion.div>
          )}

          {/* Exam tip */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm">🎯</span>
              <span className="font-display font-bold text-xs text-amber-700">Exam Tip</span>
            </div>
            <p className="font-body text-xs text-amber-700 leading-relaxed">
              CBSE frequently asks source-based questions. Read the source carefully, identify the author's
              argument, and connect it to the broader themes of nationalism. Practice summarising the key
              idea in 2-3 sentences.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
