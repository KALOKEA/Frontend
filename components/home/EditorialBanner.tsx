'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

// Matches reference exactly:
// — display:grid; grid-template-columns:1fr 1fr; min-height:520px
// — editorial-img: position:relative; overflow:hidden; img fills, hover scale 8s
// — editorial-content: background:#1E1208; padding:80px 64px; flex-col; justify-center; gap:24px
// — section-label: .72rem; weight:600; tracking:.2em; uppercase; color:#C49070 (var(--brown-lt))
// — h2: serif clamp(2rem,3.5vw,3rem) weight:300 white line-height:1.2; em:italic only
// — p: rgba(255,255,255,.55); .9rem; line-height:1.7; max-width:380px
// — CTA: btn btn-outline-white (border:1.5px solid rgba(255,255,255,.5); color:#fff)
// — NO extra horizontal line, NO Link arrow

function safeLink(link: string | null | undefined, fallback = '/about/'): string {
  const l = (link || '').trim()
  if (!l || !l.startsWith('/') || l.includes(' ')) return fallback
  return l
}

export default function EditorialBanner() {
  const [c, setC] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then(d => setC(d.cms)).catch(() => {})
  }, [])

  const imageUrl = c.editorial_image_url || HERO_DEFAULTS.editorial_image_url

  return (
    <section
      className="reveal-left group k-editorial"
      style={{ margin: 0 }}
    >
      {/* Left — image panel */}
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={c.editorial_heading || 'The Edit — Kalokea'}
          className="group-hover:scale-[1.04]"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'transform 8s ease',
          }}
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            el.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85&fit=crop'
          }}
        />
      </div>

      {/* Right — dark content panel */}
      <div className="k-editorial-content">
        {/* section-label — color:var(--brown-lt)=#C49070 */}
        <span
          style={{
            fontSize: '.72rem',
            fontWeight: 600,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: '#C49070',
            marginBottom: 0,
            display: 'block',
          }}
        >
          {c.editorial_eyebrow || 'The Edit'}
        </span>

        {/* h2 — white, weight:300, em:italic no extra color */}
        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 300,
            color: '#FFFFFF',
            lineHeight: 1.2,
            margin: 0,
          }}
        >
          {c.editorial_heading ? (
            c.editorial_heading
          ) : (
            <>
              The Art of
              <br />
              <em style={{ fontStyle: 'italic' }}>Effortless Style</em>
            </>
          )}
        </h2>

        {/* body text */}
        <p
          style={{
            color: 'rgba(255,255,255,.55)',
            fontSize: '.9rem',
            lineHeight: 1.7,
            maxWidth: 380,
            margin: 0,
          }}
        >
          {c.editorial_subtext || 'Our curators hand-pick each piece for its craftsmanship, wearability, and that ineffable quality that makes you feel entirely yourself. Discover the stories behind our collections.'}
        </p>

        {/* btn btn-outline-white — matches reference exactly */}
        <Link
          href={safeLink(c.editorial_cta_link)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '13px 28px',
            fontSize: '.8rem',
            fontWeight: 600,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            borderRadius: 4,
            background: 'none',
            border: '1.5px solid rgba(255,255,255,.5)',
            color: '#fff',
            cursor: 'pointer',
            transition: 'all .2s',
            alignSelf: 'flex-start',
            fontFamily: 'inherit',
            textDecoration: 'none',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.1)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
        >
          {c.editorial_cta_label || 'Our Story'}
        </Link>
      </div>
    </section>
  )
}
