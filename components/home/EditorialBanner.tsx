'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

export default function EditorialBanner() {
  const [c, setC] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then(d => setC(d.cms)).catch(() => {})
  }, [])

  const imageUrl = c.editorial_image_url || HERO_DEFAULTS.editorial_image_url

  return (
    <section className="reveal-left flex flex-col md:flex-row overflow-hidden" style={{ minHeight: 520 }}>

      {/* Left — image panel */}
      <div className="relative overflow-hidden" style={{ flex: '1 1 0', minHeight: 320 }}>
        {/* Use plain <img> to bypass next/image custom Cloudinary loader for external URLs */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={c.editorial_heading || 'The Edit — Kalokea'}
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="lazy"
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement
            el.src = 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=85&fit=crop'
          }}
        />
        {/* Sienna overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-0 hover:opacity-20"
          style={{ background: '#7C4A2D' }}
        />
        {/* Right edge dark fade to blend with text panel */}
        <div
          className="absolute inset-y-0 right-0 w-16 pointer-events-none hidden md:block"
          style={{ background: 'linear-gradient(to left, #1A1612, transparent)' }}
        />
      </div>

      {/* Right — dark text panel */}
      <div
        className="flex flex-col justify-center px-10 py-16 md:py-24 md:px-16 lg:px-24"
        style={{ background: '#1A1612', flex: '0 0 50%' }}
      >
        {/* Sienna top line */}
        <div className="w-10 h-px bg-[#7C4A2D] mb-8" />

        <div className="eyebrow mb-5" style={{ color: '#6B5E55' }}>
          {c.editorial_eyebrow || 'The Edit'}
        </div>

        <h2
          className="font-serif font-light text-[#FDFAF6] leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
        >
          {c.editorial_heading || "The Art of"}<br />
          <em className="italic" style={{ color: '#C4A882' }}>
            {c.editorial_heading ? '' : 'Effortless Style'}
          </em>
        </h2>

        <p className="font-sans text-[14px] text-[#6B5E55] leading-relaxed max-w-[340px] mb-10">
          {c.editorial_subtext || 'Our curators hand-pick each piece for its craftsmanship, wearability, and that ineffable quality that makes you feel entirely yourself.'}
        </p>

        <Link
          href={c.editorial_cta_link || '/about/'}
          className="self-start text-[9.5px] font-sans tracking-[0.28em] uppercase text-[#C4A882] border-b border-[#C4A882]/40 pb-0.5 hover:text-[#FDFAF6] hover:border-[#FDFAF6]/40 transition-colors"
        >
          {c.editorial_cta_label || 'Our Story'} →
        </Link>
      </div>
    </section>
  )
}
