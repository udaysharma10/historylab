import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgressStore } from '../store/useProgressStore'
import { ProgressRing } from '../components/common/ProgressRing'
import { calculateMastery } from '../engine/scoringEngine'
import { useAuthContext } from '../components/auth'
import { getChapter, CHAPTER_SECTION_COLORS, CHAPTER_SECTION_ICONS } from '../data/getChapter'
import type { SectionId } from '../types/progress'

export function HomePage() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const { profile } = useAuthContext()
  const totalStars = useProgressStore((s) => s.totalStars)
  const progressSections = useProgressStore((s) => s.sections)

  const cid = chapterId || 'ch1'
  const chapter = getChapter(cid)
  const basePath = `/chapter/${cid}`
  const sectionColors = CHAPTER_SECTION_COLORS[cid] || {}
  const sectionIcons = CHAPTER_SECTION_ICONS[cid] || {}

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

  const totalCompleted = Object.values(progressSections).reduce((sum, s) => sum + s.completed, 0)
  const totalProblems = Object.values(progressSections).reduce((sum, s) => sum + s.total, 0)
  const overallProgress = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0

  const firstName = profile.name.split(' ')[0]

  // Chapter-specific learning modes — only show modes that have data
  const allModes = [
    { id: 'timeline', label: 'Timeline Review', icon: '📅', route: `${basePath}/timeline`, color: '#2980B9', chapters: ['ch1'] },
    { id: 'maps', label: 'Map Review', icon: '🗺️', route: `${basePath}/maps`, color: '#16A085', chapters: ['ch1'] },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', route: `${basePath}/flashcards`, color: '#7D3C98', chapters: ['ch1', 'ch2'] },
    { id: 'figures', label: 'Figure Review', icon: '🖼️', route: `${basePath}/figures`, color: '#E67E22', chapters: ['ch1'] },
    { id: 'exam', label: 'Exam Prep', icon: '📝', route: `${basePath}/exam`, color: '#C0392B', chapters: ['ch1'] },
  ]
  const MODES = allModes.filter(m => m.chapters.includes(cid))

  return (
    <div className="space-y-8 pb-8">
      {/* Chapter Header + Stats */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-body mb-1">
              <button className="hover:text-hist-dark" onClick={() => navigate('/')}>All Chapters</button>
              {' → '}
              Chapter {chapter.sections[0]?.number ? Math.ceil(chapter.sections[0].number / 6) : 1}
            </p>
            <h1 className="font-display text-xl font-bold text-hist-dark">
              {chapter.title}
            </h1>
          </div>
          <ProgressRing
            progress={overallProgress}
            mastery={totalCompleted > 0 ? 'learning' : 'beginner'}
            size={64}
          >
            <span className="text-xs font-bold text-hist-dark">{overallProgress}%</span>
          </ProgressRing>
        </div>
        <div className="flex gap-6 mt-4 text-sm">
          <div className="flex items-center gap-1.5">
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="#F1C40F" stroke="#E6A900" strokeWidth="0.5" />
            </svg>
            <span className="font-bold text-hist-dark">{totalStars} Stars</span>
          </div>
          <div className="text-gray-500">{totalCompleted} activities done</div>
        </div>
      </motion.div>

      {/* Section Cards */}
      <div>
        <h2 className="font-display text-lg font-bold text-hist-dark mb-4">Sections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapter.sections.map((section, i) => {
            const color = sectionColors[section.id] || '#2C3E50'
            const icon = sectionIcons[section.id] || section.icon || '📖'
            const progress = progressSections[section.id as SectionId]
            const pct = progress?.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0
            const mastery = progress ? calculateMastery(progress) : 'beginner'

            return (
              <motion.button
                key={section.id}
                className="bg-white rounded-2xl p-5 shadow-card text-left hover:shadow-card-hover transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`${basePath}/section/${section.id}`)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: color + '15' }}
                  >
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: color }}>
                        S{section.number}
                      </span>
                      {pct === 0 && progress?.total > 0 && (
                        <span className="text-xs font-bold text-hist-green bg-hist-green/10 px-2 py-0.5 rounded-full">NEW</span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-hist-dark text-sm leading-tight truncate">{section.title}</h3>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08 + 0.3 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                  <span>{pct}% complete</span>
                  <span className="capitalize">{mastery}</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Learning Modes */}
      <div>
        <h2 className="font-display text-lg font-bold text-hist-dark mb-4">Learning Modes</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              className="bg-white rounded-2xl p-4 shadow-card text-center hover:shadow-card-hover transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(mode.route)}
            >
              <div className="text-3xl mb-2">{mode.icon}</div>
              <div className="font-display font-bold text-sm text-hist-dark">{mode.label}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
