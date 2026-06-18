'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'
import BackgroundMedia from './BackgroundMedia'

interface EditorialSlide {
  image: string
  video: string
  mode: 'image' | 'video'
}

function safeLink(link: string | null | undefined, fallback = '/about/'): string {
  const l = (link || '').trim()
  if (!l || !l.startsWith('/') || l.includes(' ')) return fallback
  return l
}

function parseSlides(c: HomepageContent): EditorialSlide[] {
  try {
    const parsed: EditorialSlide[] = JSON.parse(c.editorial_slides || '[]')
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch {}
  return [{
    image: c.editorial_image_url || HERO_DEFAULTS.editorial_image_url,
    video: c.editorial_video_url || '',
    mode: (c.editorial_mode as 'image' | 'video') || 'image',
  }]
}

export default function EditorialBanner({ initialCms }: { initialCms?: Record<string, string> | null }) {
  const [c, setC] = useState<HomepageContent>(
    initialCms ? ({ ...HERO_DEFAULTS, ...initialCms } as HomepageContent) : HERO_DEFAULTS,
  )
  const [slideIdx, setSlideIdx] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    getHomepageData().then(d => setC(d.cms)).catch(() => {})
  }, [])

  const slides = parseSlides(c)

  // Auto-advance every 6 s — only when >1 slide
  useEffect(() => {
    if (slides.length <= 1) return
    timerRef.current = setTimeout(() => {
      setSlideIdx(i => (i + 1) % slides.length)
    }, 6000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [slideIdx, slides.length])

  const current = slides[Math.min(slideIdx, slides.length - 1)]
  // Video plays whenever a video URL is present — pasting a link is enough.
  const isVideo = !!current.video

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setSlideIdx(i)
  }

  return (
    <section
      aria-label="Editorial"
      className="reveal-left group k-editorial"
      style={{ margin: 0 }}
    >
      {/* Left — image / carousel panel */}
      <div className="k-editorial-media">
        <BackgroundMedia
          image={current.image}
          video={current.video}
          isVideo={isVideo}
          alt={c.editorial_heading || 'The Edit — Kalokea'}
          objectPosition="center"
          mediaClassName="group-hover:scale-[1.04] transition-transform duration-[8000ms] ease-out"
          fallbackSrc="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85&fit=crop"
        />

        {/* Slide dots — visible when multiple slides */}
        {slides.length > 1 && (
          <div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-0.5 z-10"
            role="tablist"
            aria-label="Editorial slides"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="p-2 flex items-center justify-center"
                aria-label={`Go to editorial slide ${i + 1}`}
                aria-current={i === slideIdx ? true : undefined}
              >
                <span className={`block w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                  i === slideIdx ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
                }`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right — dark content panel */}
      <div className="k-editorial-content">
        <span
          style={{
            fontSize: '.72rem', fontWeight: 600, letterSpacing: '.2em',
            textTransform: 'uppercase', color: '#C49070', display: 'block',
          }}
        >
          {c.editorial_eyebrow || 'The Edit'}
        </span>

        <h2
          className="font-serif"
          style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 300,
            color: '#FFFFFF', lineHeight: 1.2, margin: 0,
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

        <p
          style={{
            color: 'rgba(255,255,255,.55)', fontSize: '.9rem',
            lineHeight: 1.7, maxWidth: 380, margin: 0,
          }}
        >
          {c.editorial_subtext || 'Our curators hand-pick each piece for its craftsmanship, wearability, and that ineffable quality that makes you feel entirely yourself. Discover the stories behind our collections.'}
        </p>

        <Link
          href={safeLink(c.editorial_cta_link)}
          style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            padding: '13px 28px', fontSize: '.8rem', fontWeight: 600, letterSpacing: '.1em',
            textTransform: 'uppercase', borderRadius: 4, background: 'none',
            border: '1.5px solid rgba(255,255,255,.5)', color: '#fff',
            cursor: 'pointer', transition: 'all .2s', alignSelf: 'flex-start',
            fontFamily: 'inherit', textDecoration: 'none',
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
