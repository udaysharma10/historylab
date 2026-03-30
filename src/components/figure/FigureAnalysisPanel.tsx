import { motion } from 'framer-motion'
import type { FigureAnalysis } from '../../types/figure'

interface FigureAnalysisPanelProps {
  analysis: FigureAnalysis
  sectionColor: string
}

export function FigureAnalysisPanel({ analysis, sectionColor }: FigureAnalysisPanelProps) {
  return (
    <div className="space-y-5">
      {/* What You See */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3" style={{ color: sectionColor }}>
          What You See
        </h4>
        <ul className="space-y-2">
          {analysis.whatYouSee.map((item, i) => (
            <motion.li
              key={i}
              className="flex gap-3 items-start"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.06 }}
            >
              <span
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
                style={{ backgroundColor: `${sectionColor}80` }}
              >
                {i + 1}
              </span>
              <p className="font-body text-[0.95rem] text-hist-dark/80 leading-relaxed">{item}</p>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* What It Means */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <h4 className="font-display font-bold text-sm uppercase tracking-wider mb-3" style={{ color: sectionColor }}>
          What It Means
        </h4>
        <ul className="space-y-2">
          {analysis.whatItMeans.map((item, i) => (
            <motion.li
              key={i}
              className="flex gap-3 items-start"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
            >
              <span className="shrink-0 mt-1.5" style={{ color: sectionColor }}>&#x2022;</span>
              <p className="font-body text-[0.95rem] text-hist-dark/80 leading-relaxed">
                <strong className="text-hist-dark">{item.split(' — ')[0]}</strong>
                {item.includes(' — ') ? ` — ${item.split(' — ').slice(1).join(' — ')}` : ''}
              </p>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Exam Tip */}
      <motion.div
        className="rounded-xl p-4 flex gap-3 items-start"
        style={{ backgroundColor: '#FEF3C7', border: '1px solid #FDE68A' }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <span className="text-lg shrink-0">💡</span>
        <div>
          <p className="font-display font-bold text-sm text-amber-800 mb-1">Exam Tip</p>
          <p className="font-body text-sm text-amber-800 leading-relaxed">{analysis.examTip}</p>
        </div>
      </motion.div>
    </div>
  )
}
