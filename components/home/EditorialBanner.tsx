import Link from 'next/link'
import Image from 'next/image'

const IMAGE_URL = 'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_900/editorial-banner.jpg'

export default function EditorialBanner() {
  return (
    <section className="flex flex-col md:flex-row overflow-hidden" style={{ minHeight: 520 }}>

      {/* Left — dark text panel */}
      <div
        className="flex flex-col justify-center px-10 py-16 md:py-24 md:px-16 lg:px-24"
        style={{ background: '#1A1612', flex: '0 0 50%' }}
      >
        {/* Sienna top line */}
        <div className="w-10 h-px bg-[#7C4A2D] mb-8" />

        <div className="eyebrow mb-5" style={{ color: '#6B5E55' }}>Our Story</div>

        <h2
          className="font-serif font-light text-[#FDFAF6] leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
        >
          Made in India.<br />
          <em className="italic" style={{ color: '#C4A882' }}>Made for Her.</em>
        </h2>

        <p className="font-sans text-[14px] text-[#6B5E55] leading-relaxed max-w-[340px] mb-10">
          Every piece in our collection is thoughtfully sourced from Indian artisans —
          celebrating craft, supporting livelihoods, and dressing the modern woman
          with intention.
        </p>

        <Link
          href="/about"
          className="self-start text-[9.5px] font-sans tracking-[0.28em] uppercase text-[#C4A882] border-b border-[#C4A882]/40 pb-0.5 hover:text-[#FDFAF6] hover:border-[#FDFAF6]/40 transition-colors"
        >
          Our Story →
        </Link>
      </div>

      {/* Right — image panel */}
      <div className="relative overflow-hidden" style={{ flex: '1 1 0', minHeight: 320 }}>
        <Image
          src={IMAGE_URL}
          alt="Made in India — Kalokea"
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          unoptimized
        />
        {/* Sienna overlay on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500 opacity-0 hover:opacity-20"
          style={{ background: '#7C4A2D' }}
        />
        {/* Left edge dark fade to blend with text panel */}
        <div
          className="absolute inset-y-0 left-0 w-16 pointer-events-none hidden md:block"
          style={{ background: 'linear-gradient(to right, #1A1612, transparent)' }}
        />
        {/* Bottom caption */}
        <div className="absolute bottom-6 right-6 text-right">
          <div className="text-[8px] font-sans tracking-[0.28em] uppercase text-white/50">Handcrafted</div>
          <div className="text-[11px] font-sans text-white/80 mt-0.5">Proudly Indian</div>
        </div>
      </div>
    </section>
  )
}
