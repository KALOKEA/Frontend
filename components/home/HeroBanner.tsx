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
    <section className="relative flex flex-col md:flex-row min-h-[92vh] bg-[#faf8f5] overflow-hidden">

      {/* ── Mobile media ──────────────────────────────────────────── */}
      <div
        className="md:hidden relative w-full overflow-hidden"
        style={{ height: '56vw', minHeight: 220, maxHeight: 400 }}
      >
        {isVideo ? (
          <video src={c.hero_video_url} autoPlay muted loop playsInline className="w-full h-full object-cover object-top" />
        ) : (
          <Image
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            fill className="object-cover object-top" priority unoptimized
          />
        )}
        {/* Subtle grain overlay on mobile */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* ── Left: Text ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-12 md:px-14 lg:px-20 xl:px-28 py-10 md:py-0 relative">

        {/* Grain texture on cream side — desktop only */}
        <div className="hidden md:block absolute inset-0 opacity-[0.025] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* New collection floating badge */}
        <div
          className={`inline-flex self-start items-center gap-2 bg-[#c8a4a5]/15 border border-[#c8a4a5]/30 px-3 py-1.5 mb-6 md:mb-8 ${mounted ? 'animate-fade-in anim-delay-0' : 'opacity-0'}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#c8a4a5] animate-pulse" />
          <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#a07e80]">New Collection</span>
        </div>

        {/* Eyebrow */}
        <p className={`text-[10px] font-sans tracking-[0.35em] uppercase text-[#c8a4a5] mb-4 md:mb-5 ${mounted ? 'animate-fade-up anim-delay-100' : 'opacity-0'}`}>
          {c.hero_eyebrow}
        </p>

        {/* Main headline — display size */}
        <h1
          className={`font-serif font-light text-[#0a0a0a] mb-5 md:mb-7 leading-[0.97] ${mounted ? 'animate-fade-up anim-delay-200' : 'opacity-0'}`}
          style={{ fontSize: 'clamp(3rem, 7vw, 6.5rem)', letterSpacing: '-0.01em' }}
        >
          {c.hero_headline_1}
          <br />
          <em className="not-italic italic text-[#c8a4a5]">{c.hero_headline_2}</em>
        </h1>

        {/* Subtext */}
        <p className={`font-sans text-[14px] sm:text-[15px] text-[#6b6b6b] max-w-xs md:max-w-sm mb-8 md:mb-10 leading-relaxed ${mounted ? 'animate-fade-up anim-delay-300' : 'opacity-0'}`}>
          {c.hero_subtext}
        </p>

        {/* CTAs */}
        <div className={`flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 ${mounted ? 'animate-fade-up anim-delay-400' : 'opacity-0'}`}>
          <Link
            href={c.hero_cta1_link || '/shop'}
            className="btn-shimmer bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-8 py-4 hover:bg-[#1a1a1a] transition-colors duration-300 text-center relative overflow-hidden"
          >
            {c.hero_cta1_label}
          </Link>
          <Link
            href={c.hero_cta2_link || '/shop'}
            className="border border-[#0a0a0a] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase px-8 py-4 hover:border-[#c8a4a5] hover:text-[#c8a4a5] transition-all duration-300 text-center"
          >
            {c.hero_cta2_label}
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className={`hidden md:flex items-center gap-3 mt-16 text-[#9b9b9b] ${mounted ? 'animate-fade-in anim-delay-500' : 'opacity-0'}`}>
          <div className="w-6 h-px bg-[#c8a4a5]/50" />
          <span className="text-[9px] font-sans tracking-[0.25em] uppercase">Scroll to explore</span>
          <div className="w-6 h-px bg-[#c8a4a5]/50" />
        </div>
      </div>

      {/* ── Right: Image / Video — desktop only ───────────────────── */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        {isVideo ? (
          <video
            src={c.hero_video_url}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover object-top"
            style={{ position: 'absolute', inset: 0 }}
          />
        ) : (
          <Image
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            fill
            className="object-cover object-top hover:scale-[1.04] transition-transform duration-[1200ms] ease-out"
            priority
            unoptimized
          />
        )}
        {/* Left-side fade */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#faf8f5] to-transparent pointer-events-none" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
      </div>

      {/* Bottom ornament line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a4a5]/50 to-transparent pointer-events-none" />
    </section>
  )
}
