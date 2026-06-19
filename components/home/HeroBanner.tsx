'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'
import BackgroundMedia from './BackgroundMedia'

interface HeroSlide {
  image: string
  video: string
  mode: 'image' | 'video'
}

// Sanitize CTA links — reject empty, non-path, or space-containing values
function safeLink(link: string | null | undefined, fallback = '/shop/'): string {
  const l = (link || '').trim()
  if (!l || !l.startsWith('/') || l.includes(' ')) return fallback
  return l
}

// Parse hero_slides JSON; fall back to single slide from legacy fields
function parseSlides(c: HomepageContent): HeroSlide[] {
  try {
    const parsed: HeroSlide[] = JSON.parse(c.hero_slides || '[]')
    // Filter out empty/invalid slides — an empty image src causes a blank panel
    const valid = Array.isArray(parsed)
      ? parsed.filter(s => (s.image && s.image.trim()) || (s.video && s.video.trim()))
      : []
    if (valid.length > 0) return valid
  } catch {}
  return [{
    image: c.hero_image_url || HERO_DEFAULTS.hero_image_url,
    video: c.hero_video_url || '',
    mode: (c.hero_mode as 'image' | 'video') || 'image',
  }]
}

export default function HeroBanner({ initialCms }: { initialCms?: Record<string, string> | null }) {
  const [c, setC] = useState<HomepageContent>(
    initialCms ? ({ ...HERO_DEFAULTS, ...initialCms } as HomepageContent) : HERO_DEFAULTS,
  )
  const [mounted, setMounted] = useState(false)
  const [slideIdx, setSlideIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setMounted(true)
    getHomepageData().then((d) => setC(d.cms)).catch(() => {})
  }, [])

  const slides = parseSlides(c)

  // Auto-advance every 5 s — only when >1 slide
  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setTimeout(() => {
      setSlideIdx(i => (i + 1) % slides.length)
    }, 5000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [slideIdx, slides.length])

  const current = slides[Math.min(slideIdx, slides.length - 1)]
  // Video plays whenever a video URL is present — pasting a link is enough, no
  // separate "mode" toggle needed. To show the image instead, clear the URL.
  const isVideo = !!current.video

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSlideIdx(i)
  }

  return (
    <section
      aria-label="Hero"
      className="flex flex-col md:grid -mt-[94px] lg:-mt-[108px]"
      style={{ gridTemplateColumns: '1fr 1fr', minHeight: '100vh' }}
    >
      {/* ── Mobile image (above text on small screens) ── */}
      <div
        className="md:hidden relative overflow-hidden"
        style={{ height: '56vw', minHeight: 220, maxHeight: 400 }}
      >
        <BackgroundMedia
          image={current.image}
          video={current.video}
          isVideo={isVideo}
          alt="Kalokea — Women's Fashion Collection"
          priority
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(30,18,8,.15) 0%, transparent 60%)' }}
        />
        {/* Mobile slide dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-0.5" role="tablist" aria-label="Slides">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="p-2 flex items-center justify-center"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === slideIdx ? true : undefined}
              >
                <span className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === slideIdx ? 'bg-white scale-125' : 'bg-white/40'}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Left: dark text panel ── */}
      <div
        className="flex flex-col justify-end relative k-hero-left"
        style={{ background: '#1E1208', minHeight: 'clamp(480px, 60vh, 100vh)' }}
      >
        {/* Ambient depth orbs */}
        <div className="k-hero-orbs" aria-hidden="true">
          <span className="k-hero-orb k-hero-orb--1" />
          <span className="k-hero-orb k-hero-orb--2" />
          <span className="k-hero-orb k-hero-orb--3" />
        </div>

        {/* Eyebrow */}
        <div
          className={mounted ? 'animate-fade-up anim-delay-100' : 'opacity-0'}
          style={{
            fontSize: '.7rem', fontWeight: 600, letterSpacing: '.25em',
            textTransform: 'uppercase', color: '#C49070', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <span style={{ display: 'block', width: 32, height: 1, background: '#C49070', flexShrink: 0 }} />
          {c.hero_eyebrow}
        </div>

        {/* Title */}
        <h1
          className={`font-serif ${mounted ? 'animate-fade-up anim-delay-200' : 'opacity-0'}`}
          style={{
            fontSize: 'clamp(2.8rem, 5vw, 5.2rem)', fontWeight: 300,
            lineHeight: 1.08, color: '#FFFFFF', marginBottom: 24,
          }}
        >
          {c.hero_headline_1}
          <em style={{ fontStyle: 'italic', display: 'block' }}>{c.hero_headline_2}</em>
        </h1>

        {/* Subtext */}
        <p
          className={mounted ? 'animate-fade-up anim-delay-300' : 'opacity-0'}
          style={{
            fontSize: '.88rem', color: 'rgba(255,255,255,.55)',
            lineHeight: 1.7, maxWidth: 360, marginBottom: 40,
          }}
        >
          {c.hero_subtext}
        </p>

        {/* CTAs */}
        <div className={`k-hero-actions ${mounted ? 'animate-fade-up anim-delay-400' : 'opacity-0'}`}>
          <Link
            href={safeLink(c.hero_cta1_link)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px 28px', fontSize: '.8rem', fontWeight: 600, letterSpacing: '.1em',
              textTransform: 'uppercase', borderRadius: 4, background: 'none',
              border: '1.5px solid rgba(255,255,255,.5)', color: '#fff',
              transition: 'all .2s', textDecoration: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.1)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'none' }}
          >
            {c.hero_cta1_label}
          </Link>
          <Link
            href={safeLink(c.hero_cta2_link)}
            style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              padding: '13px 28px', fontSize: '.8rem', fontWeight: 600, letterSpacing: '.1em',
              textTransform: 'uppercase', borderRadius: 4, background: '#C49070',
              color: '#1E1208', border: 'none', transition: 'all .2s', textDecoration: 'none',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#b07d5e' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#C49070' }}
          >
            {c.hero_cta2_label}
          </Link>
        </div>
      </div>

      {/* ── Right: image / carousel panel — desktop only ── */}
      <div className="hidden md:block relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <BackgroundMedia
          image={current.image}
          video={current.video}
          isVideo={isVideo}
          alt="Kalokea — Women's Fashion Collection"
          priority
          mediaClassName="transition-opacity duration-700"
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(30,18,8,.15) 0%, transparent 60%)' }}
        />

        {/* Slide dots — shown only when multiple slides */}
        {slides.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-0.5 z-10" role="tablist" aria-label="Slides">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="p-2 flex items-center justify-center"
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === slideIdx ? true : undefined}
              >
                <span className={`block w-2 h-2 rounded-full transition-all duration-300 ${
                  i === slideIdx ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/70'
                }`} />
              </button>
            ))}
          </div>
        )}

        {/* Scroll indicator — only when single slide */}
        {slides.length <= 1 && (
          <div
            aria-hidden="true"
            className="absolute"
            style={{
              bottom: 32, left: '50%', transform: 'translateX(-50%)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              color: 'rgba(255,255,255,.4)', fontSize: '.68rem',
              letterSpacing: '.15em', textTransform: 'uppercase',
            }}
          >
            Scroll
            <span style={{ display: 'block', width: 1, height: 40, background: 'rgba(255,255,255,.3)' }} />
          </div>
        )}
      </div>
    </section>
  )
}
