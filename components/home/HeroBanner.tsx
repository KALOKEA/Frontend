'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

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
    <section className="relative flex flex-col md:flex-row overflow-hidden min-h-[calc(100vh-58px)] md:min-h-[calc(100vh-68px)]">

      {/* ── Mobile media ───────────────────────────────────────────── */}
      <div className="md:hidden relative w-full overflow-hidden" style={{ height: '58vw', minHeight: 220, maxHeight: 420 }}>
        {isVideo ? (
          <video src={c.hero_video_url} autoPlay muted loop playsInline className="w-full h-full object-cover object-top" />
        ) : (
          <Image
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            fill className="object-cover object-top" priority unoptimized
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1612]/40 pointer-events-none" />
      </div>

      {/* ── Left: Text (43%) — dark panel matching prototype ──────── */}
      <div
        className="flex flex-col justify-center relative"
        style={{ width: '100%', flex: '0 0 auto', padding: 'clamp(40px, 5vw, 80px) clamp(32px, 6vw, 100px)', background: '#1A1612' }}
      >
        {/* MD+: fixed 43% width */}
        <style>{`@media(min-width:768px){.hero-left{width:43%}}`}</style>
        <div className="hero-left">

          {/* Eyebrow with line decoration (matches prototype) */}
          <p className={`text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#C4A882] mb-8 flex items-center gap-3 ${mounted ? 'animate-fade-up anim-delay-100' : 'opacity-0'}`}>
            <span className="inline-block w-8 h-px bg-[#C4A882]" />
            {c.hero_eyebrow}
          </p>

          {/* Headline */}
          <h1
            className={`font-serif font-light text-[#FDFAF6] mb-6 leading-[1.08] ${mounted ? 'animate-fade-up anim-delay-200' : 'opacity-0'}`}
            style={{ fontSize: 'clamp(2.8rem, 5vw, 5.2rem)', letterSpacing: '-0.01em' }}
          >
            {c.hero_headline_1}
            <br />
            <em className="italic" style={{ color: '#C4A882' }}>{c.hero_headline_2}</em>
          </h1>

          {/* Subtext */}
          <p className={`font-sans text-[14px] max-w-[360px] mb-10 leading-[1.7] ${mounted ? 'animate-fade-up anim-delay-300' : 'opacity-0'}`} style={{ color: 'rgba(255,255,255,0.55)' }}>
            {c.hero_subtext}
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row flex-wrap gap-4 ${mounted ? 'animate-fade-up anim-delay-400' : 'opacity-0'}`}>
            <Link
              href={c.hero_cta1_link || '/shop/'}
              className="btn-shimmer border border-white/50 text-white text-[9.5px] font-sans tracking-[0.22em] uppercase px-8 py-4 hover:bg-white/10 transition-colors duration-300 text-center relative overflow-hidden"
            >
              {c.hero_cta1_label}
            </Link>
            <Link
              href={c.hero_cta2_link || '/shop/'}
              className="text-[9.5px] font-sans tracking-[0.22em] uppercase px-8 py-4 text-center transition-all duration-300"
              style={{ background: '#C4A882', color: '#1A1612' }}
            >
              {c.hero_cta2_label}
            </Link>
          </div>

          {/* Stats strip */}
          <div className={`hidden md:flex items-center gap-0 mt-14 border-t pt-6 ${mounted ? 'animate-fade-in anim-delay-500' : 'opacity-0'}`} style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            {[
              { num: '12K+', label: 'Women Trust Us' },
              { num: '500+', label: 'Curated Styles' },
              { num: '100%', label: 'Made in India' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-7 mx-5" style={{ background: 'rgba(255,255,255,0.1)' }} />}
                <div>
                  <div className="font-serif text-[22px] font-light text-[#FDFAF6] leading-none">{stat.num}</div>
                  <div className="text-[9px] font-sans tracking-[0.2em] uppercase mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right: Image (57%) — desktop only ─────────────────────── */}
      <div
        className="hidden md:block relative overflow-hidden"
        style={{ flex: '1 1 0', position: 'relative' }}
      >
        {isVideo ? (
          <video
            src={c.hero_video_url}
            autoPlay muted loop playsInline
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <Image
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            fill
            className="object-cover object-top"
            style={{ transition: 'transform 1.4s cubic-bezier(0.25,0.46,0.45,0.94)' }}
            priority
            unoptimized
          />
        )}
        {/* Left-edge dark fade to blend with text panel */}
        <div className="absolute inset-y-0 left-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #1A1612, transparent)' }} />
        {/* Subtle top-right vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(26,22,18,0.15) 0%, transparent 60%)' }} />
        {/* Made in India badge */}
        <div className="absolute bottom-8 left-6 border-l-2 border-[#C4A882] pl-3 bg-[#1A1612]/80 py-1.5 pr-4">
          <div className="text-[8px] font-sans tracking-[0.28em] uppercase text-[#C4A882]">Made in India</div>
          <div className="text-[11px] font-sans text-white/70 mt-0.5">Proudly designed &amp; crafted</div>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
          <span className="text-[8px] font-sans tracking-[0.2em] uppercase">Scroll</span>
          <span className="inline-block w-px h-8 bg-white/25" />
        </div>
      </div>
    </section>
  )
}
