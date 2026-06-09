'use client'
import { useState, useEffect } from 'react'
import api from '@/lib/api/client'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [subtext, setSubtext] = useState(HERO_DEFAULTS.newsletter_subtext)

  useEffect(() => {
    getHomepageData().then((d) => {
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
    <section className="py-20 px-4 text-center bg-[#F0EAE1]">
      <div className="max-w-[560px] mx-auto">

        <p className="text-[10px] font-sans tracking-[0.28em] uppercase text-[#7C4A2D] mb-4">
          Stay Connected
        </p>

        <h2
          className="font-serif font-light text-[#0A0908] mb-3"
          style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)' }}
        >
          Join the <em className="italic" style={{ color: '#7C4A2D' }}>KALOKEA</em> Circle
        </h2>
        <p className="text-[14px] font-sans text-[#6B5E55] mb-8 max-w-sm mx-auto leading-relaxed">
          {subtext}
        </p>

        {status === 'done' ? (
          <div className="text-center">
            <p className="font-serif text-[#7C4A2D] text-xl mb-1">Thank you!</p>
            <p className="text-[12px] font-sans text-[#6B5E55] tracking-wide">We'll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 w-full sm:w-auto border border-[#D4C8BC] focus:border-[#7C4A2D] bg-white text-[#0A0908] text-[14px] font-sans px-5 min-h-[48px] outline-none placeholder:text-[#B5A89E] transition-colors rounded-none"
              required
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full sm:w-auto bg-[#0A0908] hover:bg-[#7C4A2D] text-white text-[10px] font-sans tracking-widest uppercase px-8 min-h-[48px] transition-colors disabled:opacity-50 whitespace-nowrap border-none rounded-none"
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="text-red-600 text-[11px] font-sans mt-3 tracking-wide">Something went wrong. Please try again.</p>
        )}
      </div>
    </section>
  )
}
