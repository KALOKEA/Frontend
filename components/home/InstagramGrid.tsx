import Link from 'next/link'

const INSTAGRAM_URL = 'https://www.instagram.com/kalokea.in'

// Static Cloudinary images — replace slugs with real post IDs as needed
const GRID_IMAGES = [
  'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_600/instagram/post1.jpg',
  'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_600/instagram/post2.jpg',
  'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_600/instagram/post3.jpg',
  'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_600/instagram/post4.jpg',
  'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_600/instagram/post5.jpg',
  'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_600/instagram/post6.jpg',
]

const InstagramIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="20" height="20" rx="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
)

export default function InstagramGrid() {
  return (
    <section className="py-20 bg-[#FDFAF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="eyebrow-center mb-4">Follow Along</div>
          <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)' }}>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#7C4A2D] transition-colors"
            >
              @kalokea.in
            </a>
          </h2>
          <p className="text-[12px] font-sans text-[#6B5E55] mt-2">on Instagram</p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2">
          {GRID_IMAGES.map((src, i) => (
            <a
              key={i}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden aspect-square bg-[#E0D4C4]"
              aria-label={`Kalokea on Instagram — post ${i + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />
              {/* Sienna hover overlay */}
              <div className="absolute inset-0 bg-[#7C4A2D] opacity-0 group-hover:opacity-25 transition-opacity duration-400 pointer-events-none" />
              {/* Instagram icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <InstagramIcon />
              </div>
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] border border-[#7C4A2D] px-6 py-2.5 hover:bg-[#7C4A2D] hover:text-white transition-colors duration-300"
          >
            <InstagramIcon />
            Follow @kalokea.in
          </a>
        </div>
      </div>
    </section>
  )
}
