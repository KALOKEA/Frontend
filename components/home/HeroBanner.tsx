'use client'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroBanner() {
  return (
    <section className="relative flex flex-col md:flex-row min-h-[92vh] bg-[#faf8f5] overflow-hidden">

      {/* ── Mobile: image at top ── */}
      <div className="md:hidden relative w-full overflow-hidden" style={{ height: '56vw', minHeight: 220, maxHeight: 400 }}>
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=85&fit=crop&crop=top"
          alt="Kalokea — Women's Fashion Collection"
          fill
          className="object-cover object-top"
          priority
          unoptimized
        />
      </div>

      {/* ── Left: Text Content ── */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 md:px-14 lg:px-20 xl:px-28 py-12 md:py-0">
        <p className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#c8a4a5] mb-5">
          New Collection — 2026
        </p>
        <h1 className="font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[1.05] text-[#0a0a0a] mb-6">
          Dressed for<br />
          <em className="not-italic italic text-[#c8a4a5]">Every Moment</em>
        </h1>
        <p className="font-sans text-[15px] text-[#6b6b6b] max-w-xs md:max-w-sm mb-10 leading-relaxed">
          Timeless silhouettes, curated fabrics — pieces that move with you, season after season.
        </p>
        <div className="flex flex-wrap gap-3 md:gap-4">
          <Link
            href="/shop"
            className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-7 py-3.5 hover:bg-[#c8a4a5] transition-colors duration-300"
          >
            Shop Collection
          </Link>
          <Link
            href="/shop/new-arrivals"
            className="border border-[#0a0a0a] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase px-7 py-3.5 hover:border-[#c8a4a5] hover:text-[#c8a4a5] transition-colors duration-300"
          >
            New Arrivals
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-3 mt-16 text-[#6b6b6b]">
          <div className="w-8 h-px bg-[#6b6b6b]" />
          <span className="text-[10px] font-sans tracking-[0.2em] uppercase">Scroll to explore</span>
        </div>
      </div>

      {/* ── Right: Image — desktop only ── */}
      <div className="hidden md:block flex-1 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1400&q=90&fit=crop&crop=top"
          alt="Kalokea — Women's Fashion Collection"
          fill
          className="object-cover object-top hover:scale-[1.03] transition-transform duration-700"
          priority
          unoptimized
        />
        {/* Fade into background on left edge */}
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#faf8f5] to-transparent" />
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c8a4a5]/40 to-transparent" />
    </section>
  )
}
