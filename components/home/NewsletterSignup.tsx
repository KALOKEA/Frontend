'use client'
// Matches reference .newsletter exactly:
// — section: padding:80px 0; background:var(--ivory-2)=#F0EAE1
// — .newsletter-inner: max-width:560px; margin:0 auto; text-align:center
// — section-label: .72rem weight:600 tracking:.2em uppercase color:#7C4A2D margin-bottom:10px
// — h2: serif clamp(1.8rem,3vw,2.6rem) weight:400 margin-bottom:10px
// — p: .88rem color:#7A6E68 margin-bottom:32px
// — .nl-form: display:flex gap:8px
// — input: flex:1 padding:14px 18px border:1.5px solid #E4DDD4 border-radius:4px .88rem bg:#fff
//           focus: border-color:#7C4A2D
// — button: padding:14px 24px bg:#0A0806 color:#fff border-radius:4px .78rem weight:600
//           tracking:.1em uppercase hover:bg:#7C4A2D

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
    <section className="k-section-py" style={{ background: '#F0EAE1' }}>
      <div
        className="reveal"
        style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center', padding: '0 24px' }}
      >
        {/* section-label */}
        <span
          style={{
            fontSize: '.72rem',
            fontWeight: 600,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: '#7C4A2D',
            marginBottom: 10,
            display: 'block',
          }}
        >
          Stay Connected
        </span>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
            fontWeight: 400,
            lineHeight: 1.2,
            color: '#0A0806',
            marginBottom: 10,
          }}
        >
          Join the <em style={{ fontStyle: 'italic', color: '#7C4A2D' }}>KALOKEA</em> Circle
        </h2>

        <p
          style={{
            fontSize: '.88rem',
            color: '#7A6E68',
            marginBottom: 32,
            lineHeight: 1.65,
          }}
        >
          {subtext}
        </p>

        {status === 'done' ? (
          <div style={{ textAlign: 'center' }}>
            <p className="font-serif" style={{ color: '#7C4A2D', fontSize: '1.2rem', marginBottom: 4 }}>Thank you!</p>
            <p style={{ fontSize: '.82rem', color: '#7A6E68' }}>We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="k-nl-form"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              style={{
                flex: 1,
                padding: '14px 18px',
                border: '1.5px solid #E4DDD4',
                borderRadius: 4,
                fontSize: '.88rem',
                background: '#FFFFFF',
                outline: 'none',
                fontFamily: 'inherit',
                color: '#0A0806',
                transition: 'border-color .2s',
              }}
              onFocus={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#7C4A2D' }}
              onBlur={e => { (e.currentTarget as HTMLInputElement).style.borderColor = '#E4DDD4' }}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '14px 24px',
                background: '#0A0806',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 4,
                fontSize: '.78rem',
                fontWeight: 600,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background .2s',
                whiteSpace: 'nowrap',
                opacity: status === 'loading' ? 0.6 : 1,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#7C4A2D' }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0A0806' }}
            >
              {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p style={{ color: '#c0392b', fontSize: '.82rem', marginTop: 12 }}>
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </section>
  )
}
