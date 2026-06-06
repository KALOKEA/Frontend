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
    <section className="bg-[#0a0a0a] py-16 px-4 text-center">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Stay in the Loop</p>
      <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">{heading}</h2>
      <p className="text-sm font-sans text-[#6b6b6b] mb-8 max-w-md mx-auto">
        {subtext}
      </p>

      {status === 'done' ? (
        <p className="text-[#c8a4a5] font-serif text-lg">Thank you for subscribing! ✨</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row items-center justify-center gap-0 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 w-full sm:w-auto bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-sans px-4 py-3.5 outline-none focus:border-[#c8a4a5] placeholder:text-[#6b6b6b]"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto bg-[#c8a4a5] hover:bg-[#a07e80] text-white text-[10px] font-sans tracking-widest uppercase px-6 py-3.5 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      )}
      {status === 'error' && (
        <p className="text-red-400 text-xs font-sans mt-2">Something went wrong. Please try again.</p>
      )}
    </section>
  )
}
