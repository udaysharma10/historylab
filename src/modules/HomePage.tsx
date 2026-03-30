import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../store/useProgressStore'
import { ProgressRing } from '../components/common/ProgressRing'
import { calculateMastery } from '../engine/scoringEngine'
import type { SectionId } from '../types/progress'

const SECTIONS = [
  { id: 's1' as SectionId, number: 1, title: 'The French Revolution & the Nation', color: '#C0392B', icon: '🇫🇷', route: '/section/s1' },
  { id: 's2' as SectionId, number: 2, title: 'Making of Nationalism in Europe', color: '#2980B9', icon: '🏛️', route: '/section/s2' },
  { id: 's3' as SectionId, number: 3, title: 'Age of Revolutions: 1830-1848', color: '#E67E22', icon: '🔥', route: '/section/s3' },
  { id: 's4' as SectionId, number: 4, title: 'Making of Germany & Italy', color: '#27AE60', icon: '🗺️', route: '/section/s4' },
  { id: 's5' as SectionId, number: 5, title: 'Visualising the Nation', color: '#7D3C98', icon: '🎨', route: '/section/s5' },
  { id: 's6' as SectionId, number: 6, title: 'Nationalism & Imperialism', color: '#16A085', icon: '🌍', route: '/section/s6' },
]

const MODES = [
  { id: 'timeline', label: 'Timeline', icon: '📅', route: '/timeline', color: '#2980B9' },
  { id: 'maps', label: 'Maps', icon: '🗺️', route: '/maps', color: '#16A085' },
  { id: 'flashcards', label: 'Flashcards', icon: '🃏', route: '/flashcards', color: '#7D3C98' },
  { id: 'figures', label: 'Figures', icon: '🖼️', route: '/figures', color: '#E67E22' },
  { id: 'exam', label: 'Exam Prep', icon: '📝', route: '/exam', color: '#C0392B' },
]

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function HomePage() {
  const navigate = useNavigate()
  const playerName = useProgressStore((s) => s.playerName)
  const totalStars = useProgressStore((s) => s.totalStars)
  const sections = useProgressStore((s) => s.sections)
  const setPlayerName = useProgressStore((s) => s.setPlayerName)
  const [showNameInput, setShowNameInput] = useState(!playerName)
  const [nameInput, setNameInput] = useState('')

  useEffect(() => {
    if (!playerName) setShowNameInput(true)
  }, [playerName])

  const handleSetName = () => {
    if (nameInput.trim()) {
      setPlayerName(nameInput.trim())
      setShowNameInput(false)
    }
  }

  const totalCompleted = Object.values(sections).reduce((sum, s) => sum + s.completed, 0)
  const totalProblems = Object.values(sections).reduce((sum, s) => sum + s.total, 0)
  const overallProgress = totalProblems > 0 ? Math.round((totalCompleted / totalProblems) * 100) : 0

  if (showNameInput) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="bg-white rounded-3xl p-8 shadow-card max-w-md w-full text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-5xl mb-4">📜</div>
          <h1 className="font-display text-3xl font-bold text-hist-dark mb-2">
            Welcome to HistoryLab
          </h1>
          <p className="text-gray-500 mb-6">The Rise of Nationalism in Europe</p>
          <input
            type="text"
            placeholder="Enter your name"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetName()}
            className="w-full px-4 py-3 rounded-xl border-2 border-hist-gold/30 focus:border-hist-gold focus:outline-none text-center font-body text-lg mb-4"
            autoFocus
          />
          <motion.button
            className="bg-hist-gold text-white font-display text-lg px-8 py-3 rounded-full shadow-button btn-press w-full"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSetName}
            disabled={!nameInput.trim()}
          >
            Start Learning
          </motion.button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Greeting + Stats */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-hist-dark">
              {getGreeting()}, {playerName}!
            </h1>
            <p className="text-gray-500 mt-1">Chapter 1: Rise of Nationalism in Europe</p>
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
          {SECTIONS.map((section, i) => {
            const progress = sections[section.id]
            const pct = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0
            const mastery = calculateMastery(progress)

            return (
              <motion.button
                key={section.id}
                className="bg-white rounded-2xl p-5 shadow-card text-left hover:shadow-card-hover transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(section.route)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: section.color + '15' }}
                  >
                    {section.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: section.color }}>
                        S{section.number}
                      </span>
                      {pct === 0 && progress.total > 0 && (
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
                    style={{ backgroundColor: section.color }}
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
