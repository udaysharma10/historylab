// Razorpay Standard Web Checkout (Sprint 3). The client never sees prices as
// inputs or the key secret: create-order returns the server-priced order plus
// the public key id, and verify-payment checks the signature server-side.
import { supabase } from './supabase'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
      on: (event: string, handler: (resp: unknown) => void) => void
    }
  }
}

let scriptPromise: Promise<boolean> | null = null

function loadCheckoutScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true)
  scriptPromise ??= new Promise((resolve) => {
    const el = document.createElement('script')
    el.src = 'https://checkout.razorpay.com/v1/checkout.js'
    el.onload = () => resolve(true)
    el.onerror = () => {
      scriptPromise = null
      resolve(false)
    }
    document.head.appendChild(el)
  })
  return scriptPromise
}

export interface CheckoutCallbacks {
  /** verified server-side — safe to unlock */
  onSuccess: () => void
  onFailure: (message: string) => void
  onDismiss: () => void
}

export async function startCheckout(productId: string, cb: CheckoutCallbacks) {
  const loaded = await loadCheckoutScript()
  if (!loaded || !window.Razorpay) {
    cb.onFailure('Could not load the payment window. Check your connection and try again.')
    return
  }

  const { data: order, error } = await supabase.functions.invoke('create-order', {
    body: { product_id: productId },
  })
  if (error || !order?.order_id) {
    // Surface the server's own error body — a generic message hides the cause.
    let status: number | undefined
    let serverMsg = ''
    const ctx = (error as { context?: Response } | null)?.context
    if (ctx instanceof Response) {
      status = ctx.status
      try {
        const body = await ctx.clone().json()
        serverMsg = [body.error, body.step && `step: ${body.step}`, body.detail]
          .filter(Boolean)
          .join(' · ')
      } catch {
        serverMsg = ''
      }
    }
    cb.onFailure(
      status === 409
        ? 'This chapter is already unlocked on your account — reload the page.'
        : `Could not start the payment${serverMsg ? ` (${serverMsg})` : ''}. Please try again in a minute.`
    )
    return
  }

  const rzp = new window.Razorpay({
    key: order.key_id,
    order_id: order.order_id,
    amount: order.amount,
    currency: order.currency,
    name: 'HistoryLab',
    description: order.product_name,
    prefill: { email: order.prefill_email, name: order.prefill_name },
    theme: { color: '#C05F35' },
    handler: async (resp: {
      razorpay_order_id: string
      razorpay_payment_id: string
      razorpay_signature: string
    }) => {
      const { data, error: verifyErr } = await supabase.functions.invoke('verify-payment', {
        body: resp,
      })
      if (verifyErr || !data?.success) {
        // Payment may still land via the webhook — tell the user the truth.
        cb.onFailure(
          'Payment received but confirmation is pending — if the chapter does not unlock in a few minutes, contact help@historylab.in.'
        )
        return
      }
      cb.onSuccess()
    },
    modal: { ondismiss: () => cb.onDismiss() },
  })
  rzp.on('payment.failed', () => {
    cb.onFailure('The payment did not go through. No money was taken — you can try again.')
  })
  rzp.open()
}
