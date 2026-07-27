import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore } from '../../store/useProgressStore'
import { useAuthContext } from '../auth'
import { useAccess } from '../auth/AccessProvider'

export function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const totalStars = useProgressStore((s) => s.totalStars)
  const { profile, signOut } = useAuthContext()
  const { isAdmin } = useAccess()
  const isHome = location.pathname === '/'
  const [menuOpen, setMenuOpen] = useState(false)
  // Google avatar URLs fail in some contexts (incognito, referrer policy) —
  // fall back to the initial rather than a broken-image glyph.
  const [avatarBroken, setAvatarBroken] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

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
                  fill="#C99A3A"
                  stroke="#B5841F"
                  strokeWidth="0.5"
                />
              </svg>
              <span className="font-display font-bold text-hist-dark text-sm">{totalStars}</span>
            </div>

            {/* Admin buttons — server-driven admin identity (Sprint 1) */}
            {isAdmin && (
              <>
                <motion.button
                  className="flex items-center gap-1.5 bg-hist-blue/10 hover:bg-hist-blue/20 px-3 py-1.5 rounded-full transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/dashboard')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5571B5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                  </svg>
                  <span className="font-display font-bold text-hist-blue text-xs hidden sm:inline">Dashboard</span>
                </motion.button>
                <motion.button
                  className="flex items-center gap-1.5 bg-hist-gold/10 hover:bg-hist-gold/20 px-3 py-1.5 rounded-full transition-colors"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/admin')}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C99A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l7 4v6c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-4z" />
                  </svg>
                  <span className="font-display font-bold text-hist-gold text-xs hidden sm:inline">Admin</span>
                </motion.button>
              </>
            )}

            {/* Avatar with dropdown */}
            <div className="relative" ref={menuRef}>
              <motion.button
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-hist-blue/30 transition-colors"
                whileTap={{ scale: 0.9 }}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {profile.avatar_url && !avatarBroken ? (
                  <img
                    src={profile.avatar_url}
                    alt=""
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setAvatarBroken(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-hist-blue flex items-center justify-center text-white font-display font-bold text-sm">
                    {profile.name ? profile.name[0].toUpperCase() : '?'}
                  </div>
                )}
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    className="absolute right-0 top-12 bg-white rounded-xl shadow-card-hover border border-gray-100 py-2 min-w-[200px] z-50"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="font-display font-bold text-sm text-hist-dark">{profile.name}</div>
                      <div className="text-xs text-gray-400 capitalize">{profile.role}{profile.school ? ` · ${profile.school}` : ''}</div>
                    </div>
                    <button
                      className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
                      onClick={async () => {
                        setMenuOpen(false)
                        await signOut()
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                      </svg>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
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
