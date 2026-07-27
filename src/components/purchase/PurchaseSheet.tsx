import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthContext } from '../auth'
import { useAccess } from '../auth/AccessProvider'
import { startCheckout } from '../../lib/razorpay'
import type { Product } from '../auth/AccessProvider'

// Purchase sheet (plan §5): Razorpay checkout, kept deliberately simple —
// Neha's Sprint-4 review dropped the WhatsApp/email parent handoff and the
// refund/GST fine print (refund policy lives on /refunds).
interface PurchaseSheetProps {
  product: Product
  chapterTitle: string
  open: boolean
  onClose: () => void
}

type PayState = 'idle' | 'starting' | 'pending' | 'success' | 'error'

export function PurchaseSheet({ product, chapterTitle, open, onClose }: PurchaseSheetProps) {
  const { profile } = useAuthContext()
  const { refresh, entitledChapters } = useAccess()
  const [payState, setPayState] = useState<PayState>('idle')
  const [payError, setPayError] = useState('')

  // Redirect-style payment methods can kill the checkout's JS callbacks; the
  // webhook still grants server-side. Re-checking entitlements on dismiss (and
  // rendering owned products as unlocked) makes the sheet self-heal.
  const alreadyOwned = entitledChapters.has(product.id)

  // Pending = payment made, webhook grant lagging (launch-03 screen D).
  // Poll entitlements briefly — never unlock on a client-side signal alone;
  // alreadyOwned flips this sheet to success the moment the grant lands.
  useEffect(() => {
    if (payState !== 'pending' || alreadyOwned) return
    let polls = 0
    const id = setInterval(() => {
      polls += 1
      if (polls > 45) {
        clearInterval(id) // ~3 min — the panel's 15-min copy takes over
        return
      }
      refresh()
    }, 4000)
    return () => clearInterval(id)
  }, [payState, alreadyOwned, refresh])

  const pay = () => {
    setPayState('starting')
    setPayError('')
    startCheckout(product.id, {
      onSuccess: () => {
        setPayState('success')
        refresh()
      },
      onPending: () => {
        setPayState('pending')
        refresh()
      },
      onFailure: (message) => {
        setPayState('error')
        setPayError(message)
        refresh()
      },
      onDismiss: () => {
        setPayState((s) => (s === 'pending' ? s : 'idle'))
        refresh()
      },
    })
  }

  const price = `₹${(product.price_paise / 100).toFixed(0)}`
  const listPrice = product.list_price_paise
    ? `₹${(product.list_price_paise / 100).toFixed(0)}`
    : null

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
            {/* launch-03 screen B structure; decisions #27/#28 applied on top
                (no parent handoff, no refund/GST line, no payer checkbox). */}
            <div className="mb-4">
              <span className="block text-[11px] font-bold uppercase tracking-[1.5px] text-hist-gold mb-1">
                {payState === 'success' || alreadyOwned
                  ? 'Chapter unlocked'
                  : payState === 'pending'
                    ? 'Almost there'
                    : 'Unlock chapter'}
              </span>
              <h3 className="font-display text-[22px] font-bold text-hist-dark leading-tight">
                {chapterTitle}
              </h3>
            </div>

            {payState !== 'success' && payState !== 'pending' && !alreadyOwned && (
              <div className="bg-hist-gold-soft/40 border border-hist-line rounded-[14px] px-4 py-3.5 mb-4">
                <b className="block text-[12px] font-extrabold uppercase tracking-wide text-hist-dark mb-2">
                  Everything included — forever
                </b>
                <ul className="grid grid-cols-2 gap-x-3 gap-y-1.5 font-body text-[12.5px] text-hist-ink">
                  <li>✓ Every section in story mode</li>
                  <li>✓ NCERT figures, explorable</li>
                  <li>✓ Smart flashcards + timeline</li>
                  <li>✓ Board map work</li>
                  <li className="font-bold">✓ Board-pattern test papers</li>
                  <li className="font-bold">✓ Marking scheme on every answer</li>
                </ul>
              </div>
            )}

            {payState !== 'success' && payState !== 'pending' && !alreadyOwned && (
              <div className="flex items-center justify-between mb-5">
                <span className="text-[12px] font-bold text-hist-muted">
                  One-time payment · no subscription
                </span>
                <span className="flex items-baseline gap-2">
                  {listPrice && (
                    <span className="font-body text-[15px] text-gray-400 line-through font-semibold">
                      {listPrice}
                    </span>
                  )}
                  <span className="font-display text-[26px] font-bold text-hist-dark">{price}</span>
                  {listPrice && (
                    <span className="text-[10.5px] font-bold text-hist-green">launch price</span>
                  )}
                </span>
              </div>
            )}

            {payState === 'pending' && !alreadyOwned ? (
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-hist-orange/10 border border-hist-orange/25 rounded-[14px] px-4 py-3.5">
                  <span className="text-lg">⏳</span>
                  <p className="font-body text-[13px] text-hist-ink leading-relaxed">
                    <b className="text-hist-dark">Confirming your payment…</b> UPI sometimes takes
                    a minute. The chapter unlocks automatically the moment the bank confirms — you
                    can keep studying meanwhile. If it takes longer than 15 minutes, write to{' '}
                    <a className="underline" href="mailto:info@teknomatics.com">info@teknomatics.com</a>.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-[12px] font-semibold text-hist-muted">
                  <span className="w-2 h-2 rounded-full bg-hist-orange animate-pulse" />
                  Checking automatically…
                </div>
                <button
                  className="w-full text-center text-sm text-gray-400 hover:text-gray-600 font-body"
                  onClick={onClose}
                >
                  Keep studying meanwhile
                </button>
              </div>
            ) : payState === 'success' || alreadyOwned ? (
              <div className="text-center space-y-3">
                <div className="text-5xl">🎉</div>
                <p className="font-display font-bold text-hist-dark text-lg">
                  This chapter is yours — forever!
                </p>
                <div className="flex justify-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 bg-hist-gold-soft/60 border border-hist-line px-3 py-1.5 rounded-[11px] text-[12px] font-semibold text-hist-ink">
                    ♾️ <b className="text-hist-dark">Lifetime access</b>
                  </span>
                  <span className="flex items-center gap-1.5 bg-hist-gold-soft/60 border border-hist-line px-3 py-1.5 rounded-[11px] text-[12px] font-semibold text-hist-ink">
                    🧾 <b className="text-hist-dark">Receipt emailed{profile.guardian_email ? ' to your parent' : ''}</b>
                  </span>
                </div>
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
                <p className="text-center text-xs text-gray-400 font-body pt-1">
                  UPI · Cards · Netbanking · 🔒 Secure payment via Razorpay
                </p>
              </div>
            )}

            {payState !== 'success' && payState !== 'pending' && !alreadyOwned && (
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
