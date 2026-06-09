import Link from 'next/link'
import Image from 'next/image'

const IMAGE_URL = 'https://images.unsplash.com/photo-1529139574466-a303027614b7?w=900&q=80'

export default function EditorialBanner() {
  return (
    <section className="flex flex-col md:flex-row overflow-hidden" style={{ minHeight: 520 }}>

      {/* Left — image panel */}
      <div className="relative overflow-hidden" style={{ flex: '1 1 0', minHeight: 320 }}>
        <Image
          src={IMAGE_URL}
          alt="The Edit — Kalokea"
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

        <div className="eyebrow mb-5" style={{ color: '#6B5E55' }}>The Edit</div>

        <h2
          className="font-serif font-light text-[#FDFAF6] leading-[1.05] mb-6"
          style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)' }}
        >
          The Art of<br />
          <em className="italic" style={{ color: '#C4A882' }}>Effortless Style</em>
        </h2>

        <p className="font-sans text-[14px] text-[#6B5E55] leading-relaxed max-w-[340px] mb-10">
          Our curators hand-pick each piece for its craftsmanship, wearability, and that
          ineffable quality that makes you feel entirely yourself. Discover the stories
          behind our collections.
        </p>

        <Link
          href="/about"
          className="self-start text-[9.5px] font-sans tracking-[0.28em] uppercase text-[#C4A882] border-b border-[#C4A882]/40 pb-0.5 hover:text-[#FDFAF6] hover:border-[#FDFAF6]/40 transition-colors"
        >
          Our Story →
        </Link>
      </div>
    </section>
  )
}
