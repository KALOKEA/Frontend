// Loads the Razorpay Checkout script on demand and resolves once window.Razorpay
// is available. Static export means there's no global <Script> tag, so the
// checkout page must ensure the SDK is present before opening the modal —
// otherwise `new window.Razorpay()` throws "Razorpay is not defined".

const SRC = 'https://checkout.razorpay.com/v1/checkout.js'

export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description?: string
  image?: string
  handler: (response: {
    razorpay_payment_id: string
    razorpay_order_id: string
    razorpay_signature: string
  }) => void
  prefill?: { name?: string; email?: string; contact?: string }
  notes?: Record<string, string>
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

interface RazorpayInstance { open: () => void; on: (event: string, cb: (e: unknown) => void) => void }
type RazorpayCtor = new (options: RazorpayOptions) => RazorpayInstance

export function loadRazorpay(): Promise<RazorpayCtor | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(null); return }
    const w = window as unknown as { Razorpay?: RazorpayCtor }
    if (w.Razorpay) { resolve(w.Razorpay); return }

    const existing = document.querySelector(`script[src="${SRC}"]`) as HTMLScriptElement | null
    if (existing) {
      existing.addEventListener('load', () => resolve(w.Razorpay || null))
      existing.addEventListener('error', () => resolve(null))
      return
    }

    const script = document.createElement('script')
    script.src = SRC
    script.async = true
    script.onload = () => resolve(w.Razorpay || null)
    script.onerror = () => resolve(null)
    document.body.appendChild(script)
  })
}
