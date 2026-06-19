'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

// Unsplash fallback images — same as design reference prototype
const FALLBACK_IMAGES: Record<string, string> = {
  dresses:     'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=75',
  tops:        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=75',
  bags:        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=75',
  bottoms:     'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=75',
  accessories: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=75',
  shoes:       'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=75',
  default:     'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=75',
}


function getCatImage(cat: Category): string {
  if (cat.image_url) return cat.image_url
  return FALLBACK_IMAGES[cat.slug] || FALLBACK_IMAGES.default
}

/**
 * Mosaic layout — matches reference styles.css exactly:
 *   mosaic-card:nth-child(1) { grid-column:1/5;  grid-row:1/2; aspect-ratio:3/4  }
 *   mosaic-card:nth-child(2) { grid-column:5/9;  grid-row:1/3; aspect-ratio:auto }
 *   mosaic-card:nth-child(3) { grid-column:9/13; grid-row:1/2; aspect-ratio:3/4  }
 *   mosaic-card:nth-child(4) { grid-column:1/5;  grid-row:2/3; aspect-ratio:3/2  }
 *   mosaic-card:nth-child(5) { grid-column:9/13; grid-row:2/3; aspect-ratio:3/2  }
 *
 * Container: grid-template-rows:auto auto (reference) → k-mosaic-grid class
 * Mobile 2-col: all cards reset to span 1 col, aspect-ratio 3/4
 */
const MOSAIC_PLACEMENT = [
  // card[0]: Dresses — left-top portrait
  'md:col-start-1  md:col-end-5  md:row-start-1 md:row-end-2 md:aspect-[3/4]',
  // card[1]: Tops — center tall, spans both rows, height from row size (no aspect override)
  'md:col-start-5  md:col-end-9  md:row-start-1 md:row-end-3 md:aspect-auto',
  // card[2]: Bags — right-top portrait
  'md:col-start-9  md:col-end-13 md:row-start-1 md:row-end-2 md:aspect-[3/4]',
  // card[3]: Bottoms — left-bottom landscape
  'md:col-start-1  md:col-end-5  md:row-start-2 md:row-end-3 md:aspect-[3/2]',
  // card[4]: Accessories — right-bottom landscape
  'md:col-start-9  md:col-end-13 md:row-start-2 md:row-end-3 md:aspect-[3/2]',
]

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getHomepageData()
      .then((d) => {
        setCms(d.cms)
        // If CMS provides pre-loaded categories use them; else call API
        if (d.categories?.length) {
          setCategories(d.categories.filter((c: Category) => c.is_active !== false))
          return
        }
        return categoriesApi.getAll().then((data) => {
          const filtered = data.filter(
            (c) => c.is_active !== false &&
                   c.slug !== 'new-arrivals' &&
                   c.slug !== 'everything' &&
                   c.slug !== 'sale'
          )
          setCategories(filtered)
        })
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!gridRef.current || !categories.length) return
    const el = gridRef.current
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add('revealed'); obs.disconnect() }
    }, { threshold: 0.08 })
    el.classList.add('reveal-ready')
    obs.observe(el)
    return () => obs.disconnect()
  }, [categories])

  const cats = categories.slice(0, 5)

  // Hide section when loaded with no categories
  if (!loading && cats.length === 0) return null

  return (
    /* section-sm: padding 48px 0 */
    <section className="py-12">

      {/* Section header — left-aligned, inside container (.section-head) */}
      <div className="mx-auto px-4 sm:px-8 mb-10" style={{ maxWidth: 1380 }}>
        <span
          className="block text-[0.72rem] font-semibold tracking-[0.20em] uppercase mb-2.5"
          style={{ color: '#7C4A2D' }}
        >
          {cms.category_eyebrow || 'Shop by Category'}
        </span>
        <h2
          className="font-serif font-normal leading-[1.15]"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#0A0806' }}
        >
          {cms.category_heading || 'Find Your '}
          {!cms.category_heading && <em className="italic font-light">Signature</em>}
        </h2>
      </div>

      {/* Mosaic grid — full-width with own max-width + padding */}
      {loading ? (
        /* Skeleton — 2-col mobile, 5-cell mosaic on md+ */
        <div
          className="grid grid-cols-2 md:grid-cols-12 k-mosaic-grid gap-3 mx-auto px-4 sm:px-7 lg:px-[52px]"
          style={{ maxWidth: 1380 }}
          aria-hidden="true"
        >
          {MOSAIC_PLACEMENT.map((placement, i) => (
            <div
              key={i}
              className={`bg-[#E4DDD4] animate-pulse aspect-[3/4] ${placement}`}
              style={{ borderRadius: 4 }}
            />
          ))}
        </div>
      ) : (
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-12 k-mosaic-grid gap-3 mx-auto px-4 sm:px-7 lg:px-[52px]"
        style={{ maxWidth: 1380 }}
      >
        {cats.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/shop/${cat.slug}/`}
            className={`group relative overflow-hidden bg-[#E4DDD4] aspect-[3/4] ${MOSAIC_PLACEMENT[i] ?? ''}`}
            style={{ borderRadius: 4 }}
          >
            <Image
              src={getCatImage(cat)}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.05]"
              sizes="(max-width: 768px) 50vw, 33vw"
              loading="lazy"
            />
            {/* Gradient overlay — matches ::after in design CSS */}
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.65) 0%, transparent 55%)' }}
            />
            {/* Label — matches .mosaic-label */}
            <div className="absolute bottom-5 left-5 z-10 text-white">
              <span
                className="block text-[0.68rem] font-semibold tracking-[0.20em] uppercase mb-1"
                style={{ opacity: 0.7 }}
              >
                Category
              </span>
              <h3 className="font-serif font-normal text-[1.3rem]">{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
      )}
    </section>
  )
}
