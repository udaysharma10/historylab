import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../components/auth'
import { useAccess } from '../components/auth/AccessProvider'
import { PurchaseSheet } from '../components/purchase/PurchaseSheet'
import { chapterKey } from '../lib/contentIds'
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
  const { canAccessChapter, products } = useAccess()
  const [sheetChapter, setSheetChapter] = useState<string | null>(null)
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
            // Three states: open (free or entitled), locked (built + purchasable
            // — shown warm and desirable, not greyed), coming soon (not built).
            const isOpen = canAccessChapter(chapter.id)
            const product = products.find((p) => p.id === chapterKey(chapter.id))
            const isLocked =
              !isOpen && chapter.status === 'live' && !!product && !product.is_free
            const clickable = isOpen || isLocked
            const price = product ? `₹${(product.price_paise / 100).toFixed(0)}` : ''
            const listPrice = product?.list_price_paise
              ? `₹${(product.list_price_paise / 100).toFixed(0)}`
              : null
            return (
              <motion.button
                key={chapter.id}
                className={`w-full text-left bg-white rounded-2xl p-5 shadow-card transition-shadow ${
                  clickable ? 'hover:shadow-card-hover' : 'opacity-70 cursor-default'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={clickable ? { scale: 1.01 } : {}}
                whileTap={clickable ? { scale: 0.99 } : {}}
                onClick={() => {
                  if (isOpen) navigate(`/chapter/${chapter.id}`)
                  else if (isLocked) setSheetChapter(chapter.id)
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Chapter number badge */}
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: clickable ? `${historyBook.color}15` : '#F3F4F6' }}
                  >
                    {chapter.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className="text-xs font-bold px-2.5 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: clickable ? historyBook.color : '#9CA3AF' }}
                      >
                        Chapter {chapter.number}
                      </span>
                      {isOpen && chapter.isFree && (
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                          Free
                        </span>
                      )}
                      {isLocked && (
                        <span className="text-xs font-bold text-hist-gold bg-hist-gold/10 px-2 py-0.5 rounded-full border border-hist-gold/30">
                          {listPrice && <s className="mr-1 opacity-60">{listPrice}</s>}
                          {price} · Unlock
                        </span>
                      )}
                      {!isOpen && !isLocked && (
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

                  {/* Arrow (open) or lock (purchasable) */}
                  {isOpen && (
                    <svg
                      width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke={historyBook.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 mt-4"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                  {isLocked && (
                    <svg
                      width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="#C99A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      className="shrink-0 mt-4"
                    >
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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

      {/* Purchase sheet for the tapped locked chapter */}
      {(() => {
        const ch = historyBook.chapters.find((c) => c.id === sheetChapter)
        const product = ch ? products.find((p) => p.id === chapterKey(ch.id)) : undefined
        if (!ch || !product) return null
        return (
          <PurchaseSheet
            product={product}
            chapterTitle={`Chapter ${ch.number} — ${ch.title}`}
            open={!!sheetChapter}
            onClose={() => setSheetChapter(null)}
          />
        )
      })()}
    </div>
  )
}
