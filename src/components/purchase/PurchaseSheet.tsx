import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../auth'
import { useAccess } from '../auth/AccessProvider'
import { useProgressStore } from '../../store/useProgressStore'
import { startCheckout } from '../../lib/razorpay'
import type { Product } from '../auth/AccessProvider'

// Purchase sheet (plan §5): Razorpay checkout (Sprint 3) + the student→parent
// handoff as the alternate conversion path.
interface PurchaseSheetProps {
  product: Product
  chapterTitle: string
  open: boolean
  onClose: () => void
}

type PayState = 'idle' | 'starting' | 'success' | 'error'

export function PurchaseSheet({ product, chapterTitle, open, onClose }: PurchaseSheetProps) {
  const { profile } = useAuthContext()
  const { refresh, entitledChapters } = useAccess()
  const totalStars = useProgressStore((s) => s.totalStars)
  const completedTopics = useProgressStore((s) => Object.keys(s.completedSubsections).length)
  const [payState, setPayState] = useState<PayState>('idle')
  const [payError, setPayError] = useState('')

  // Redirect-style payment methods can kill the checkout's JS callbacks; the
  // webhook still grants server-side. Re-checking entitlements on dismiss (and
  // rendering owned products as unlocked) makes the sheet self-heal.
  const alreadyOwned = entitledChapters.has(product.id)

  const pay = () => {
    setPayState('starting')
    setPayError('')
    startCheckout(product.id, {
      onSuccess: () => {
        setPayState('success')
        refresh()
      },
      onFailure: (message) => {
        setPayState('error')
        setPayError(message)
        refresh()
      },
      onDismiss: () => {
        setPayState('idle')
        refresh()
      },
    })
  }

  const price = `₹${(product.price_paise / 100).toFixed(0)}`
  const listPrice = product.list_price_paise
    ? `₹${(product.list_price_paise / 100).toFixed(0)}`
    : null

  const firstName = profile.name.split(' ')[0]
  const message =
    `Hi! I've been studying History on HistoryLab — I've finished ${completedTopics} topics ` +
    `and earned ${totalStars} stars. Can you unlock "${chapterTitle}" for me? ` +
    `It's a one-time ${price}. Link: ${window.location.origin} — ${firstName}`

  const waHref = `https://wa.me/?text=${encodeURIComponent(message)}`
  const mailHref =
    `mailto:${profile.guardian_email ?? ''}` +
    `?subject=${encodeURIComponent('Please unlock my HistoryLab chapter')}` +
    `&body=${encodeURIComponent(message)}`

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-md shadow-card"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🔓</div>
              <h3 className="font-display text-xl font-bold text-hist-dark">{chapterTitle}</h3>
              <p className="font-body text-sm text-gray-500 mt-1">
                One-time purchase · yours for life · includes all study tools
              </p>
              <div className="mt-3 flex items-baseline justify-center gap-2">
                {listPrice && (
                  <span className="font-body text-gray-400 line-through">{listPrice}</span>
                )}
                <span className="font-display text-3xl font-bold text-hist-dark">{price}</span>
                {listPrice && (
                  <span className="text-xs font-bold text-hist-green bg-hist-green/10 px-2 py-0.5 rounded-full">
                    Launch price
                  </span>
                )}
              </div>
            </div>

            {payState === 'success' || alreadyOwned ? (
              <div className="text-center space-y-3">
                <div className="text-5xl">🎉</div>
                <p className="font-display font-bold text-hist-dark text-lg">
                  Chapter unlocked — it's yours for life!
                </p>
                <p className="font-body text-xs text-gray-400">
                  A receipt has been emailed{profile.guardian_email ? ' to your parent' : ''}.
                </p>
                <button
                  className="w-full font-display font-bold text-white bg-hist-gold rounded-xl px-6 py-3.5 shadow-button btn-press"
                  onClick={() => window.location.reload()}
                >
                  Start reading →
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <button
                  className="w-full font-display font-bold text-white rounded-xl px-6 py-3.5 shadow-button btn-press disabled:opacity-60"
                  style={{ backgroundColor: '#C05F35' }}
                  disabled={payState === 'starting'}
                  onClick={pay}
                >
                  {payState === 'starting' ? 'Opening secure checkout…' : `Pay ${price} now`}
                </button>
                {payState === 'error' && (
                  <p className="text-center text-xs font-body text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                    {payError}
                  </p>
                )}
                <div className="flex items-center gap-3 py-1">
                  <span className="flex-1 border-t border-hist-line" />
                  <span className="text-[11px] font-bold text-gray-400 uppercase">or</span>
                  <span className="flex-1 border-t border-hist-line" />
                </div>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center font-display font-bold text-white bg-[#25D366] rounded-xl px-6 py-3 shadow-button btn-press"
                >
                  Ask your parent on WhatsApp
                </a>
                <a
                  href={mailHref}
                  className="block w-full text-center font-display font-bold text-hist-dark bg-hist-gold/10 border-2 border-hist-gold/30 rounded-xl px-6 py-3 btn-press"
                >
                  Email {profile.guardian_email ? 'your parent' : 'instead'}
                </a>
                <p className="text-center text-xs text-gray-400 font-body pt-1">
                  Secure payment via Razorpay · 7-day full refund · GST invoice by email
                </p>
              </div>
            )}

            {payState !== 'success' && !alreadyOwned && (
              <button
                className="w-full text-center text-sm text-gray-400 hover:text-gray-600 font-body mt-4"
                onClick={onClose}
              >
                Maybe later
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
