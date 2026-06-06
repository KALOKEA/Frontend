'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { homepageContentApi, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

export default function HeroBanner() {
  const [c, setC] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    homepageContentApi.getAll().then(setC).catch(() => {})
  }, [])

  const isVideo = c.hero_mode === 'video' && !!c.hero_video_url
  const imageUrl = c.hero_image_url || HERO_DEFAULTS.hero_image_url

  return (
    <section className="relative flex flex-col md:flex-row min-h-[92vh] bg-[#faf8f5] overflow-hidden">

      {/* ── Mobile: media at top ───────────────────────────────────────── */}
      <div
        className="md:hidden relative w-full overflow-hidden"
        style={{ height: '56vw', minHeight: 220, maxHeight: 400 }}
      >
        {isVideo ? (
          <video
            src={c.hero_video_url}
            autoPlay muted loop playsInline
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <Image
            src={imageUrl}
            alt="Kalokea — Women's Fashion Collection"
            fill
            className="object-cover object-top"
            priority
            unoptimized
          />
        )}
      </div>

      {/* ── Left: Text content ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-14 lg:px-20 xl:px-28 py-12 md:py-0">
        <p className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#c8a4a5] mb-5">
          {c.hero_eyebrow}
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.05] text-[#0a0a0a] mb-6">
          {c.hero_headline_1}
          <br />
          <em className="not-italic italic text-[#c8a4a5]">{c.hero_headline_2}</em>
        </h1>
        <p className="font-sans text-[15px] text-[#6b6b6b] max-w-xs md:max-w-sm mb-10 leading-relaxed">
          {c.hero_subtext}
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <Link
            href={c.hero_cta1_link || '/shop'}
            className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-7 py-3.5 hover:bg-[#c8a4a5] transition-colors duration-300"
          >
            {c.hero_cta1_label}
          </Link>
          <Link
            href={c.hero_cta2_link || '/shop'}
            className="border border-[#0a0a0a] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase px-7 py-3.5 hover:border-[#c8a4a5] hover:text-[#c8a4a5] transition-colors duration-300"
          >
            {c.hero_cta2_label}
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-3 mt-16 text-[#6b6b6b]">
          <div className="w-8 h-px bg-[#6b6b6b]" />
          <span className="text-[10px] font-sans tracking-[0.2em] uppercase">Scroll to explore</span>
        </div>
      </div>

      {/* ── Right: Image or Video — desktop only ─────────────────────── */}
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
            className="object-cover object-top hover:scale-[1.03] transition-transform duration-700"
            priority
            unoptimized
          />
        )}
        {/* Fade from left */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#faf8f5] to-transparent pointer-events-none" />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a4a5]/40 to-transparent" />
    </section>
  )
}
