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
    <section className="relative flex flex-col md:flex-row overflow-hidden min-h-[calc(100vh-58px)] md:min-h-[calc(100vh-68px)]" style={{ background: '#FDFAF6' }}>

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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FDFAF6]/30 pointer-events-none" />
      </div>

      {/* ── Left: Text (43%) ───────────────────────────────────────── */}
      <div
        className="flex flex-col justify-center relative"
        style={{ width: '100%', flex: '0 0 auto', padding: 'clamp(40px, 5vw, 80px) clamp(32px, 6vw, 100px)' }}
      >
        {/* MD+: fixed 43% width */}
        <style>{`@media(min-width:768px){.hero-left{width:43%}}`}</style>
        <div className="hero-left">

          {/* New collection badge */}
          <div className={`inline-flex self-start items-center gap-2 border border-[#E0D4C4] px-3.5 py-1.5 mb-7 ${mounted ? 'animate-fade-in' : 'opacity-0'}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7C4A2D]" style={{ animation: 'pulse 2s infinite' }} />
            <span className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#7C4A2D]">New Collection</span>
          </div>

          {/* Eyebrow */}
          <p className={`text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-4 ${mounted ? 'animate-fade-up anim-delay-100' : 'opacity-0'}`}>
            {c.hero_eyebrow}
          </p>

          {/* Headline */}
          <h1
            className={`font-serif font-light text-[#0A0908] mb-6 leading-[0.97] ${mounted ? 'animate-fade-up anim-delay-200' : 'opacity-0'}`}
            style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)', letterSpacing: '-0.01em' }}
          >
            {c.hero_headline_1}
            <br />
            <em className="not-italic italic" style={{ color: '#7C4A2D' }}>{c.hero_headline_2}</em>
          </h1>

          {/* Subtext */}
          <p className={`font-sans text-[14px] text-[#6B5E55] max-w-[340px] mb-9 leading-relaxed ${mounted ? 'animate-fade-up anim-delay-300' : 'opacity-0'}`}>
            {c.hero_subtext}
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row flex-wrap gap-3 ${mounted ? 'animate-fade-up anim-delay-400' : 'opacity-0'}`}>
            <Link
              href={c.hero_cta1_link || '/shop'}
              className="btn-shimmer bg-[#0A0908] text-[#FDFAF6] text-[9.5px] font-sans tracking-[0.22em] uppercase px-8 py-4 hover:bg-[#1A1612] transition-colors duration-300 text-center relative overflow-hidden"
            >
              {c.hero_cta1_label}
            </Link>
            <Link
              href={c.hero_cta2_link || '/shop'}
              className="border border-[#0A0908] text-[#0A0908] text-[9.5px] font-sans tracking-[0.22em] uppercase px-8 py-4 hover:border-[#7C4A2D] hover:text-[#7C4A2D] transition-all duration-300 text-center"
            >
              {c.hero_cta2_label}
            </Link>
          </div>

          {/* Stats strip */}
          <div className={`hidden md:flex items-center gap-0 mt-14 border-t border-[#E0D4C4] pt-6 ${mounted ? 'animate-fade-in anim-delay-500' : 'opacity-0'}`}>
            {[
              { num: '12K+', label: 'Women Trust Us' },
              { num: '500+', label: 'Curated Styles' },
              { num: '100%', label: 'Made in India' },
            ].map((stat, i) => (
              <div key={stat.label} className="flex items-center gap-5">
                {i > 0 && <div className="w-px h-7 bg-[#E0D4C4] mx-5" />}
                <div>
                  <div className="font-serif text-[22px] font-light text-[#0A0908] leading-none">{stat.num}</div>
                  <div className="text-[9px] font-sans tracking-[0.2em] uppercase text-[#6B5E55] mt-1">{stat.label}</div>
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
        {/* Left-edge ivory fade */}
        <div className="absolute inset-y-0 left-0 w-20 pointer-events-none" style={{ background: 'linear-gradient(to right, #FDFAF6, transparent)' }} />
        {/* Bottom vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(26,22,18,0.08) 0%, transparent 40%)' }} />
        {/* Made in India badge */}
        <div className="absolute bottom-8 left-6 border-l-2 border-[#7C4A2D] pl-3 bg-[#FDFAF6]/90 py-1.5 pr-4">
          <div className="text-[8px] font-sans tracking-[0.28em] uppercase text-[#7C4A2D]">Made in India</div>
          <div className="text-[11px] font-sans text-[#0A0908] mt-0.5">Proudly designed &amp; crafted</div>
        </div>
      </div>
    </section>
  )
}
