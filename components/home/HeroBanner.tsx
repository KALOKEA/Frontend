'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

// Matches reference exactly:
// — grid 1fr 1fr (50/50), min-height:100vh
// — hero-left: background:#1E1208, flex-col, justify-end (text anchored to bottom)
// — hero-eyebrow: .7rem, weight:600, tracking:.25em, color:#C49070, line 32px before
// — hero-title: serif clamp(2.8rem,5vw,5.2rem) weight:300 lineHeight:1.08
// — hero-sub: .88rem rgba(255,255,255,.55) maxWidth:360
// — hero-actions gap:16px; btn-outline-white + btn-brown-lt
// — hero-right: position:relative, overflow:hidden, image fills + vignette
// — hero-scroll indicator at bottom center of right panel
// — NO stats strip, NO "Made in India" badge

export default function HeroBanner() {
  const [c, setC] = useState<HomepageContent>(HERO_DEFAULTS)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getHomepageData().then((d) => setC(d.cms)).catch(() => {})
  }, [])

  const isVideo = c.hero_mode === 'video' && !!c.hero_video_url
  const imageUrl = c.hero_image_url || HERO_DEFAULTS.hero_image_url

  return (
    <section
      className="flex flex-col md:grid"
      style={{
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 0px)',
      }}
    >
      {/* ── Mobile image (above text on mobile) ── */}
      <div
        className="md:hidden relative overflow-hidden"
        style={{ height: '56vw', minHeight: 220, maxHeight: 400 }}
      >
        {isVideo ? (
          <video src={c.hero_video_url} autoPlay muted loop playsInline className="w-full h-full object-cover object-top" />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            className="w-full h-full object-cover object-top"
            loading="eager"
          />
        )}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(30,18,8,.15) 0%, transparent 60%)' }} />
      </div>

      {/* ── Left: dark text panel ── */}
      <div
        className="flex flex-col justify-end relative"
        style={{
          background: '#1E1208',
          padding: 'clamp(40px, 5vw, 72px) 52px clamp(40px, 5vw, 72px) max(52px, calc((100vw - 1380px) / 2 + 52px))',
          minHeight: 'clamp(480px, 60vh, 100vh)',
        }}
      >
        {/* Eyebrow */}
        <div
          className={mounted ? 'animate-fade-up anim-delay-100' : 'opacity-0'}
          style={{
            fontSize: '.7rem',
            fontWeight: 600,
            letterSpacing: '.25em',
            textTransform: 'uppercase',
            color: '#C49070',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span style={{ display: 'block', width: 32, height: 1, background: '#C49070', flexShrink: 0 }} />
          {c.hero_eyebrow}
        </div>

        {/* Title */}
        <h1
          className={`font-serif ${mounted ? 'animate-fade-up anim-delay-200' : 'opacity-0'}`}
          style={{
            fontSize: 'clamp(2.8rem, 5vw, 5.2rem)',
            fontWeight: 300,
            lineHeight: 1.08,
            color: '#FFFFFF',
            marginBottom: 24,
          }}
        >
          {c.hero_headline_1}
          <em style={{ fontStyle: 'italic', display: 'block' }}>{c.hero_headline_2}</em>
        </h1>

        {/* Subtext */}
        <p
          className={mounted ? 'animate-fade-up anim-delay-300' : 'opacity-0'}
          style={{
            fontSize: '.88rem',
            color: 'rgba(255,255,255,.55)',
            lineHeight: 1.7,
            maxWidth: 360,
            marginBottom: 40,
          }}
        >
          {c.hero_subtext}
        </p>

        {/* CTAs — matches .hero-actions */}
        <div
          className={`k-hero-actions ${mounted ? 'animate-fade-up anim-delay-400' : 'opacity-0'}`}
        >
          {/* btn btn-outline-white */}
          <Link
            href={c.hero_cta1_link || '/shop/'}
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
              transition: 'all .2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
          >
            {c.hero_cta1_label}
          </Link>
          {/* btn with background:var(--brown-lt);color:var(--dark) */}
          <Link
            href={c.hero_cta2_link || '/shop/'}
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
              background: '#C49070',
              color: '#1E1208',
              border: 'none',
              transition: 'all .2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#b07d5e' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C49070' }}
          >
            {c.hero_cta2_label}
          </Link>
        </div>
      </div>

      {/* ── Right: image panel — desktop only ── */}
      <div
        className="hidden md:block relative overflow-hidden"
        style={{ minHeight: '100vh' }}
      >
        {isVideo ? (
          <video
            src={c.hero_video_url}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            className="absolute inset-0 w-full h-full object-cover object-top"
            loading="eager"
          />
        )}
        {/* Vignette overlay — matches #home .hero-right::after */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(30,18,8,.15) 0%, transparent 60%)' }}
        />
        {/* Scroll indicator — matches .hero-scroll */}
        <div
          className="absolute"
          style={{
            bottom: 32,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'rgba(255,255,255,.4)',
            fontSize: '.68rem',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
          }}
        >
          Scroll
          <span style={{ display: 'block', width: 1, height: 40, background: 'rgba(255,255,255,.3)' }} />
        </div>
      </div>
    </section>
  )
}
