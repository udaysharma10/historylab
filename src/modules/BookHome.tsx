import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../components/auth'
import { useAccess } from '../components/auth/AccessProvider'
import { historyBook } from '../data/books'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export function BookHome() {
  const navigate = useNavigate()
  const { profile } = useAuthContext()
  const { canAccessChapter } = useAccess()
  const firstName = profile.name.split(' ')[0]
  // Note (Sprint 1): the old auto-redirect of admin emails to /dashboard is
  // removed — admins (incl. Neha) use the app itself; Dashboard/Admin are
  // header buttons now.

  return (
    <div className="space-y-8 pb-8">
      {/* Greeting + Book Title */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-2xl font-bold text-hist-dark">
          {getGreeting()}, {firstName}!
        </h1>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-3xl">{historyBook.icon}</span>
          <div>
            <h2 className="font-display font-bold text-hist-dark text-lg leading-tight">
              {historyBook.title}
            </h2>
            <p className="text-sm text-gray-500 font-body mt-0.5">{historyBook.subtitle}</p>
          </div>
        </div>
      </motion.div>

      {/* Chapter Cards */}
      <div>
        <h2 className="font-display text-lg font-bold text-hist-dark mb-4">Chapters</h2>
        <div className="space-y-3">
          {historyBook.chapters.map((chapter, i) => {
            // A chapter is open only if it's built AND this user is allowed in.
            // Gated chapters the user can't open are shown exactly like the
            // not-yet-built ones ("Coming Soon") so a trial student just sees Ch1.
            const isLive = canAccessChapter(chapter.id)
            return (
              <motion.button
                key={chapter.id}
                className={`w-full text-left bg-white rounded-2xl p-5 shadow-card transition-shadow ${
                  isLive ? 'hover:shadow-card-hover' : 'opacity-70 cursor-default'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={isLive ? { scale: 1.01 } : {}}
                whileTap={isLive ? { scale: 0.99 } : {}}
                onClick={() => isLive && navigate(`/chapter/${chapter.id}`)}
              >
                <div className="flex items-start gap-4">
                  {/* Chapter number badge */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: isLive ? `${historyBook.color}15` : '#F3F4F6' }}
                  >
                    {chapter.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: isLive ? historyBook.color : '#9CA3AF' }}
                      >
                        Chapter {chapter.number}
                      </span>
                      {chapter.isFree && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Free
                        </span>
                      )}
                      {!isLive && (
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-hist-dark text-base leading-tight">
                      {chapter.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-body mt-1">{chapter.subtitle}</p>
                  </div>

                  {/* Arrow for live chapters */}
                  {isLive && (
                    <svg
                      width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke={historyBook.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 mt-4"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Book info */}
      <motion.div
        className="text-center text-xs text-gray-400 font-body"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p>Based on NCERT textbook — Class {historyBook.classNumber} {historyBook.subject}</p>
      </motion.div>
    </div>
  )
}
