'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/lib/store/useAuthStore'

function SuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') || ''
  const { isLoggedIn, user } = useAuthStore()
  const firstName = (user as any)?.name?.split(' ')[0] || (user as any)?.first_name || ''

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 bg-[#FDFAF6]">
      <div className="w-full max-w-lg">

        {/* ── Checkmark ── */}
        <div className="flex justify-center mb-8">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: '#16A34A' }}
            aria-hidden="true"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* ── Heading ── */}
        <div className="text-center mb-8">
          {firstName && (
            <p className="font-sans text-[11px] tracking-[0.28em] uppercase text-[#7C4A2D] mb-3">
              Thank you, {firstName}
            </p>
          )}
          <h1 className="font-serif font-light text-[#0A0908] mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 2.8rem)' }}>
            Order Placed!
          </h1>
          <p className="font-sans text-[14px] text-[#6B5E55] leading-relaxed">
            We&apos;ve received your order and will begin processing it shortly.
            A confirmation email is on its way to you.
          </p>
        </div>

        {/* ── Order number card ── */}
        {orderNumber && (
          <div
            className="mb-8 p-6 text-center"
            style={{ background: '#F5EDE3', borderLeft: '3px solid #7C4A2D' }}
          >
            <p className="font-sans text-[10px] tracking-[0.28em] uppercase text-[#7C4A2D] mb-2">
              Order Number
            </p>
            <p className="font-serif text-[1.35rem] text-[#0A0908] tracking-wide">
              #{orderNumber}
            </p>
            <p className="font-sans text-[12px] text-[#7A6E68] mt-2">
              Keep this for tracking &amp; support
            </p>
          </div>
        )}

        {/* ── What happens next ── */}
        <div className="mb-10 space-y-4">
          {[
            { step: '1', text: 'Order confirmed — we\'re preparing your items' },
            { step: '2', text: 'Shipped within 1–2 business days with tracking' },
            { step: '3', text: 'Delivered in 3–7 business days pan India' },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-4">
              <div
                className="shrink-0 w-7 h-7 flex items-center justify-center font-sans text-[11px] font-semibold text-[#7C4A2D]"
                style={{ border: '1.5px solid #C4A882', borderRadius: '50%' }}
              >
                {step}
              </div>
              <p className="font-sans text-[13.5px] text-[#6B5E55] leading-relaxed pt-0.5">{text}</p>
            </div>
          ))}
        </div>

        {/* ── CTAs ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={isLoggedIn ? '/account/orders/' : `/track-order/?order=${orderNumber}`}
            className="flex-1 text-center text-white text-[11px] font-sans tracking-widest uppercase px-6 py-4 transition-colors"
            style={{ background: '#16A34A' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#15803D')}
            onMouseLeave={e => (e.currentTarget.style.background = '#16A34A')}
          >
            {isLoggedIn ? 'View My Orders' : 'Track Order'}
          </Link>
          <Link
            href="/shop/"
            className="flex-1 text-center border border-[#0A0908] text-[#0A0908] text-[11px] font-sans tracking-widest uppercase px-6 py-4 hover:bg-[#0A0908] hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* ── Support nudge ── */}
        <p className="text-center font-sans text-[12px] text-[#9A8F88] mt-8">
          Questions? Email{' '}
          <a
            href="mailto:support@kalokea.com"
            className="underline text-[#7C4A2D] hover:text-[#5A3520] transition-colors"
          >
            support@kalokea.com
          </a>
        </p>

      </div>
    </div>
  )
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}
