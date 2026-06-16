'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

interface Look {
  title: string
  tags: string[]
  image: string
  href: string
}

const DEFAULT_LOOKS: Look[] = JSON.parse(HERO_DEFAULTS.stl_looks)

export default function ShopTheLook() {
  const [looks, setLooks] = useState<Look[]>(DEFAULT_LOOKS)

  useEffect(() => {
    getHomepageData()
      .then(d => {
        try {
          const parsed = JSON.parse(d.cms.stl_looks || '')
          if (Array.isArray(parsed) && parsed.length > 0) setLooks(parsed)
        } catch { /* keep defaults */ }
      })
      .catch(() => {})
  }, [])

  return (
    <section className="k-section-py" style={{ background: '#F0EAE1' }}>
      <div className="k-container">

        {/* Section header — LEFT aligned */}
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

        {/* Grid on desktop / horizontal scroll carousel on mobile */}
        <div className="k-stl-grid">
          {looks.map(({ title, tags, image, href }, i) => (
            <Link
              key={`${i}-${title}`}
              href={href || '/shop/'}
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

              {/* Gradient overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(10,8,6,.7) 0%, transparent 50%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Info */}
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
