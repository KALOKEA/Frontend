'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

export default function QuoteStrip() {
  const [c, setC] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then(d => setC(d.cms)).catch(() => {})
  }, [])

  const quoteText   = c.quote_text   || '"Wear what makes you feel alive."'
  const quoteAuthor = c.quote_author || '— KALOKEA'

  return (
    <section className="py-20 px-4 bg-[#FDFAF6] text-center">
      <div className="max-w-3xl mx-auto">
        {/* Ornament */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-px bg-[#E0D4C4]" />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 0L8.57 5.18H14L9.71 8.38L11.28 13.56L7 10.36L2.72 13.56L4.29 8.38L0 5.18H5.43L7 0Z" fill="#C49070" />
          </svg>
          <div className="w-12 h-px bg-[#E0D4C4]" />
        </div>

        <blockquote
          className="font-serif font-light leading-relaxed text-[#160F09]"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
        >
          {quoteText}
        </blockquote>

        <p className="mt-6 text-[10px] font-sans tracking-[0.25em] uppercase text-[#7A6E68]">
          {quoteAuthor}
        </p>
      </div>
    </section>
  )
}
