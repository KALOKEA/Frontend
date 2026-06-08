'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api/client'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [heading, setHeading] = useState(HERO_DEFAULTS.newsletter_heading)
  const [subtext, setSubtext] = useState(HERO_DEFAULTS.newsletter_subtext)

  useEffect(() => {
    getHomepageData().then((d) => {
      if (d.cms.newsletter_heading) setHeading(d.cms.newsletter_heading)
      if (d.cms.newsletter_subtext) setSubtext(d.cms.newsletter_subtext)
    }).catch(() => {})
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await api.post('/newsletter/subscribe', { email })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] py-24 px-4 text-center">

      {/* Editorial background watermark — KALOKEA at opacity 4% */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden"
      >
        <span
          className="font-serif font-light text-white whitespace-nowrap"
          style={{ fontSize: 'clamp(5rem, 18vw, 16rem)', opacity: 0.04, letterSpacing: '0.1em' }}
        >
          KALOKEA
        </span>
      </div>

      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-[#c8a4a5] opacity-[0.06] blur-3xl pointer-events-none" />

      <div className="relative">
        {/* Incentive badge */}
        <div className="inline-flex items-center gap-2 bg-[#c8a4a5]/15 border border-[#c8a4a5]/30 px-4 py-1.5 mb-6">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#c8a4a5" strokeWidth="1.5">
            <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
          </svg>
          <span className="text-[9px] font-sans tracking-[0.25em] uppercase text-[#c8a4a5]">10% off your first order</span>
        </div>

        <p className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#c8a4a5] mb-3">Stay in the Loop</p>
        <h2
          className="font-serif font-light text-white mb-3"
          style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)' }}
        >
          {heading}
        </h2>
        <p className="text-[14px] font-sans text-[#6b6b6b] mb-10 max-w-sm mx-auto leading-relaxed">
          {subtext}
        </p>

        {status === 'done' ? (
          <div className="text-center">
            <p className="font-serif text-[#c8a4a5] text-xl mb-1">Thank you!</p>
            <p className="text-[12px] font-sans text-[#6b6b6b] tracking-wide">Check your inbox for your discount code.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row items-stretch justify-center gap-0 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="rose-focus flex-1 w-full sm:w-auto bg-[#1a1a1a] border border-[#2a2a2a] focus:border-[#c8a4a5] text-white text-[14px] font-sans px-5 min-h-[48px] outline-none placeholder:text-[#4a4a4a] transition-colors"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-shimmer w-full sm:w-auto bg-[#c8a4a5] hover:bg-[#a07e80] text-white text-[10px] font-sans tracking-widest uppercase px-7 min-h-[48px] transition-colors disabled:opacity-50 whitespace-nowrap relative overflow-hidden"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-400 text-[11px] font-sans mt-3 tracking-wide">Something went wrong. Please try again.</p>
        )}

        {/* Social proof micro-copy */}
        <p className="text-[10px] font-sans text-[#3a3a3a] tracking-wide mt-6">
          Join 12,000+ women who shop smarter · Unsubscribe anytime
        </p>
      </div>
    </section>
  )
}
