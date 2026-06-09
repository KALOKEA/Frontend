'use client'
import Link from 'next/link'

// Cloudinary images — update slugs once real look images are uploaded
const LOOKS = [
  {
    title: 'The Golden Hour',
    tags: ['Aurelia Dress', 'Chain Bag'],
    image: 'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_700/looks/look-1.jpg',
    href: '/shop',
  },
  {
    title: 'Power Dressing',
    tags: ['Elara Blazer', 'Wrap Skirt'],
    image: 'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_700/looks/look-2.jpg',
    href: '/shop',
  },
  {
    title: 'Weekend Edit',
    tags: ['Linen Co-ord', 'Rhea Tote'],
    image: 'https://res.cloudinary.com/kalokea/image/upload/q_auto,f_auto,w_700/looks/look-3.jpg',
    href: '/shop',
  },
]

export default function ShopTheLook() {
  return (
    <section className="py-20 bg-[#F2EAE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="eyebrow-center mb-4">Styled For You</div>
          <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Shop the <em className="italic" style={{ color: '#7C4A2D' }}>Look</em>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {LOOKS.map(({ title, tags, image, href }) => (
            <Link
              key={title}
              href={href}
              className="group relative overflow-hidden bg-[#E0D4C4] aspect-[3/4] block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent group-hover:from-black/80 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className="font-serif font-light text-white text-[1.2rem] leading-snug mb-3">
                  {title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-sans tracking-widest uppercase bg-white/15 text-white/90 px-3 py-1 border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-4 text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#C4A882] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop This Look →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
