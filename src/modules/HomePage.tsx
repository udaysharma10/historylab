import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useProgressStore } from '../store/useProgressStore'
import { useAuthContext } from '../components/auth'
import { getChapter, CHAPTER_SECTION_COLORS, CHAPTER_SECTION_ICONS } from '../data/getChapter'

export function HomePage() {
  const navigate = useNavigate()
  const { chapterId } = useParams<{ chapterId: string }>()
  const { profile } = useAuthContext()
  const cid = chapterId || 'ch1'
  const totalStars = useProgressStore((s) => s.totalStars)
  const progressSections = useProgressStore((s) => s.chapters[cid]) ?? {}

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

  // Chapter-level study tools — whole-chapter revision modalities (the in-section
  // timeline/maps cover one topic; these span all sections). Only show what has data.
  const allModes = [
    { id: 'timeline', label: 'Timeline', icon: '📅', route: `${basePath}/timeline`, color: '#5571B5', chapters: ['ch1', 'ch2'] },
    { id: 'maps', label: 'Maps', icon: '🗺️', route: `${basePath}/maps`, color: '#3F8E84', chapters: ['ch1', 'ch2'] },
    { id: 'flashcards', label: 'Flashcards', icon: '🃏', route: `${basePath}/flashcards`, color: '#9B5C9A', chapters: ['ch1', 'ch2'] },
    { id: 'figures', label: 'Figures', icon: '🖼️', route: `${basePath}/figures`, color: '#C2893E', chapters: ['ch1', 'ch2'] },
    { id: 'exam', label: 'Exam Prep', icon: '📝', route: `${basePath}/exam`, color: '#C36B53', chapters: ['ch1', 'ch2'] },
  ]
  const MODES = allModes.filter(m => m.chapters.includes(cid))

  const chapterNumber = cid === 'ch2' ? 2 : 1
  const firstName = (profile?.name || 'there').split(' ')[0]
  const ringCirc = 283
  const ringOffset = ringCirc - (overallProgress / 100) * ringCirc

  return (
    <div className="space-y-7 pb-10">
      {/* Breadcrumb */}
      <p className="text-[12.5px] font-semibold text-hist-muted px-0.5">
        <button className="hover:text-hist-navy transition-colors" onClick={() => navigate('/')}>All Chapters</button>
        {'  ·  '}
        <span className="text-hist-navy">Chapter {chapterNumber}</span>
      </p>

      {/* Hero */}
      <motion.div
        className="relative bg-white rounded-[20px] shadow-card-hover border border-hist-line overflow-hidden flex items-center gap-6 p-6 sm:p-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute left-0 top-0 bottom-0 w-[5px]" style={{ background: 'linear-gradient(var(--color-hist-gold), var(--color-hist-indigo))' }} />
        <div className="flex-1 min-w-0">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[1.4px] text-hist-gold mb-2.5">
            India &amp; the Contemporary World · Chapter {chapterNumber}
          </span>
          <h1 className="font-display text-2xl sm:text-[31px] font-bold leading-[1.1] text-hist-navy mb-2">
            {chapter.title}
          </h1>
          <p className="text-hist-muted font-medium text-sm sm:text-[14.5px] mb-4">
            Welcome back, {firstName}. Continue where you left off, or revise with the study tools below.
          </p>
          <div className="flex gap-2.5 flex-wrap">
            <div className="flex items-center gap-1.5 bg-hist-gold-soft border border-hist-line px-3.5 py-2 rounded-[11px] font-bold text-[13.5px] text-hist-ink">
              ⭐ {totalStars} stars
            </div>
            <div className="flex items-center gap-1.5 bg-hist-indigo-soft px-3.5 py-2 rounded-[11px] font-bold text-[13.5px] text-hist-indigo" style={{ border: '1px solid #E0D9F2' }}>
              ✅ {totalCompleted} activities done
            </div>
          </div>
        </div>
        <div className="relative shrink-0 hidden sm:grid place-items-center" style={{ width: 104, height: 104 }}>
          <svg width="104" height="104" className="-rotate-90">
            <circle cx="52" cy="52" r="45" stroke="#EDE6F0" strokeWidth="10" fill="none" />
            <motion.circle
              cx="52" cy="52" r="45" stroke="url(#ringGrad)" strokeWidth="10" fill="none"
              strokeLinecap="round" strokeDasharray={ringCirc}
              initial={{ strokeDashoffset: ringCirc }}
              animate={{ strokeDashoffset: ringOffset }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#DC835F" />
                <stop offset="1" stopColor="#7E72C2" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute text-center">
            <b className="font-display text-2xl font-bold leading-none text-hist-navy block">{overallProgress}%</b>
            <span className="text-[10px] font-bold text-hist-muted uppercase tracking-wide">complete</span>
          </div>
        </div>
      </motion.div>

      {/* Section Cards */}
      <div>
        <div className="flex items-baseline justify-between mb-3.5 px-0.5">
          <h2 className="font-display text-xl font-bold text-hist-navy">Sections</h2>
          <span className="text-[12.5px] font-semibold text-hist-muted">{chapter.sections.length} topics · tap to learn</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chapter.sections.map((section, i) => {
            const color = sectionColors[section.id] || '#3E3548'
            const icon = sectionIcons[section.id] || section.icon || '📖'
            const progress = progressSections[section.id]
            const pct = progress?.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0
            const started = pct > 0
            const topicCount = section.subsections.length

            return (
              <motion.button
                key={section.id}
                className="relative bg-white rounded-2xl p-[18px] shadow-card text-left border border-hist-line hover:shadow-card-hover transition-all overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => navigate(`${basePath}/section/${section.id}`)}
              >
                <span
                  className="absolute right-3.5 top-3.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide"
                  style={{ backgroundColor: color + '1A', color }}
                >
                  {started ? 'Continue' : 'Start'}
                </span>
                <div className="flex items-center gap-3 mt-1">
                  <div
                    className="w-[46px] h-[46px] rounded-[13px] grid place-items-center text-xl shrink-0"
                    style={{ backgroundColor: color + '1A' }}
                  >
                    {icon}
                  </div>
                  <div className="min-w-0 pr-12">
                    <h3 className="font-display text-base font-semibold leading-[1.18] text-hist-navy mb-0.5">{section.title}</h3>
                    <div className="text-xs font-semibold text-hist-muted">{topicCount} topics · 1 quiz</div>
                  </div>
                </div>
                <div className="h-1.5 rounded-full mt-3.5 overflow-hidden" style={{ backgroundColor: '#EDE7F0' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.07 + 0.3 }}
                  />
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Study Tools — whole-chapter revision modalities */}
      <div>
        <div className="flex items-baseline justify-between mb-3.5 px-0.5">
          <h2 className="font-display text-xl font-bold text-hist-navy">Study Tools</h2>
          <span className="text-[12.5px] font-semibold text-hist-muted">Revise across the whole chapter</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {MODES.map((mode, i) => (
            <motion.button
              key={mode.id}
              className="bg-white rounded-[14px] p-4 shadow-card text-center border border-hist-line hover:shadow-card-hover transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.07 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(mode.route)}
            >
              <div className="w-11 h-11 rounded-xl grid place-items-center mx-auto mb-2.5 text-xl border border-hist-line" style={{ backgroundColor: '#FAE4D8' }}>
                {mode.icon}
              </div>
              <span className="text-[12.5px] font-bold text-hist-navy">{mode.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}
