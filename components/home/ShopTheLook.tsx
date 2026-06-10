'use client'
import Link from 'next/link'

// Matches reference .stl-section exactly:
// — padding:80px 0; background:var(--ivory-2)=#F0EAE1
// — section-head LEFT aligned (section-head: display:flex;justify-content:space-between;gap:24px;margin-bottom:40px)
// — section-label: .72rem weight:600 tracking:.2em uppercase color:#7C4A2D
// — section-title: serif clamp(2rem,3.5vw,3rem) weight:400 lineHeight:1.15 color:#0A0806; em:italic weight:300
// — stl-grid: grid repeat(3,1fr) gap:24px
// — stl-card: position:relative; overflow:hidden; border-radius:4px; cursor:pointer
// — img: aspect-ratio:4/5 (NOT 3/4); transition:transform .5s; hover:scale(1.04)
// — ::after gradient: linear-gradient(to top, rgba(10,8,6,.7) 0%, transparent 50%)
// — stl-info: position:absolute bottom:0 left:0 right:0 padding:20px z-index:1
// — stl-tag: bg:rgba(255,255,255,.15) backdrop-filter:blur(4px) padding:4px 10px border-radius:40px .7rem color:#fff weight:500
// — NO "Shop This Look →" hover text

const LOOKS = [
  {
    title: 'The Golden Hour',
    tags: ['Aurelia Dress', 'Chain Bag'],
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=700&q=80',
    href: '/shop/',
  },
  {
    title: 'Power Dressing',
    tags: ['Elara Blazer', 'Wrap Skirt'],
    image: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=700&q=80',
    href: '/shop/',
  },
  {
    title: 'Weekend Edit',
    tags: ['Linen Co-ord', 'Rhea Tote'],
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&q=80',
    href: '/shop/',
  },
]

export default function ShopTheLook() {
  return (
    <section className="k-section-py" style={{ background: '#F0EAE1' }}>
      <div className="k-container">

        {/* Section header — LEFT aligned, matches .section-head */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: 24,
            marginBottom: 40,
          }}
        >
          <div>
            <span
              style={{
                display: 'block',
                fontSize: '.72rem',
                fontWeight: 600,
                letterSpacing: '.2em',
                textTransform: 'uppercase',
                color: '#7C4A2D',
                marginBottom: 10,
              }}
            >
              Styled For You
            </span>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                fontWeight: 400,
                lineHeight: 1.15,
                color: '#0A0806',
              }}
            >
              Shop the{' '}
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Look</em>
            </h2>
          </div>
        </div>

        {/* Grid — stl-grid: repeat(3,1fr) gap:24px */}
        <div className="k-stl-grid">
          {LOOKS.map(({ title, tags, image, href }) => (
            <Link
              key={title}
              href={href}
              className="reveal group"
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 4,
                cursor: 'pointer',
                display: 'block',
                textDecoration: 'none',
              }}
            >
              {/* Image — aspect-ratio:4/5 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={title}
                className="group-hover:scale-[1.04]"
                style={{
                  width: '100%',
                  aspectRatio: '4/5',
                  objectFit: 'cover',
                  transition: 'transform .5s',
                  display: 'block',
                }}
                loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
              />

              {/* Gradient overlay — matches .stl-card::after */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,8,6,.7) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Info — stl-info */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: 20,
                  zIndex: 1,
                }}
              >
                <h3
                  className="font-serif"
                  style={{
                    fontFamily: 'inherit',
                    fontSize: '1.15rem',
                    fontWeight: 400,
                    color: '#fff',
                    marginBottom: 8,
                  }}
                >
                  {title}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        background: 'rgba(255,255,255,.15)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        padding: '4px 10px',
                        borderRadius: 40,
                        fontSize: '.7rem',
                        color: '#fff',
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
