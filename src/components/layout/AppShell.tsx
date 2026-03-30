import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useProgressStore } from '../../store/useProgressStore'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const totalStars = useProgressStore((s) => s.totalStars)
  const playerName = useProgressStore((s) => s.playerName)
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-hist-dark/10 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <motion.button
                className="text-hist-dark/60 hover:text-hist-dark p-1"
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate(-1)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
            <h1
              className="font-display text-xl font-bold text-hist-dark cursor-pointer"
              onClick={() => navigate('/')}
            >
              History<span className="text-hist-gold">Lab</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Star counter */}
            <div className="flex items-center gap-1.5 bg-hist-gold/10 px-3 py-1.5 rounded-full">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill="#F1C40F"
                  stroke="#E6A900"
                  strokeWidth="0.5"
                />
              </svg>
              <span className="font-display font-bold text-hist-dark text-sm">{totalStars}</span>
            </div>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-hist-blue flex items-center justify-center text-white font-display font-bold text-sm">
              {playerName ? playerName[0].toUpperCase() : '?'}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="max-w-6xl mx-auto px-4 py-6"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
