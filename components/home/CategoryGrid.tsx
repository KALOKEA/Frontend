'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { getHomepageData } from '@/lib/api/homepageContent'

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

// Static fallback — used when backend returns no categories
// Order matches design: Dresses(1), Tops(2-center), Bags(3), Bottoms(4), Accessories(5)
const STATIC_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Dresses',     slug: 'dresses',     image_url: '', sort_order: 1, is_active: true },
  { id: 'c2', name: 'Tops',        slug: 'tops',         image_url: '', sort_order: 2, is_active: true },
  { id: 'c3', name: 'Bags',        slug: 'bags',         image_url: '', sort_order: 3, is_active: true },
  { id: 'c4', name: 'Bottoms',     slug: 'bottoms',      image_url: '', sort_order: 4, is_active: true },
  { id: 'c5', name: 'Accessories', slug: 'accessories',  image_url: '', sort_order: 5, is_active: true },
]

function getCatImage(cat: Category): string {
  if (cat.image_url) return cat.image_url
  return FALLBACK_IMAGES[cat.slug] || FALLBACK_IMAGES.default
}

/**
 * Mosaic layout — matches design reference CSS exactly:
 *
 * Desktop 12-col grid (≥768px):
 *   card[0] Dresses:     col 1/5,  row 1/2,  aspect 3/4   (left-top portrait)
 *   card[1] Tops:        col 5/9,  row 1/3,  auto height  (center tall — spans both rows)
 *   card[2] Bags:        col 9/13, row 1/2,  aspect 3/4   (right-top portrait)
 *   card[3] Bottoms:     col 1/5,  row 2/3,  aspect 3/2   (left-bottom landscape)
 *   card[4] Accessories: col 9/13, row 2/3,  aspect 3/2   (right-bottom landscape)
 *
 * Mobile 2-col grid (<768px): all cards span 1 col, aspect 3/4
 */
const MOSAIC_PLACEMENT = [
  // card[0]: left-top portrait
  'md:col-start-1 md:col-end-5 md:row-start-1 md:row-end-2 md:aspect-[3/4]',
  // card[1]: center tall (spans both rows — no aspect, height from combined rows)
  'md:col-start-5 md:col-end-9 md:row-start-1 md:row-end-3 md:aspect-auto',
  // card[2]: right-top portrait
  'md:col-start-9 md:col-end-13 md:row-start-1 md:row-end-2 md:aspect-[3/4]',
  // card[3]: left-bottom landscape
  'md:col-start-1 md:col-end-5 md:row-start-2 md:row-end-3 md:aspect-[3/2]',
  // card[4]: right-bottom landscape
  'md:col-start-9 md:col-end-13 md:row-start-2 md:row-end-3 md:aspect-[3/2]',
]

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getHomepageData().then((d) => {
      if (d.categories?.length) {
        setCategories(d.categories)
        return
      }
      return categoriesApi.getAll().then((data) => {
        const filtered = data.filter((c) => c.slug !== 'new-arrivals' && c.slug !== 'everything' && c.slug !== 'sale')
        setCategories(filtered.length ? filtered : STATIC_CATEGORIES)
      })
    }).catch(() => setCategories(STATIC_CATEGORIES))
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

  const cats = (categories.length ? categories : STATIC_CATEGORIES).slice(0, 5)

  return (
    /* section-sm: padding 48px 0 */
    <section className="py-12">

      {/* Section header — left-aligned, inside container (.section-head) */}
      <div className="mx-auto px-4 sm:px-8 mb-10" style={{ maxWidth: 1380 }}>
        <span
          className="block text-[0.72rem] font-semibold tracking-[0.20em] uppercase mb-2.5"
          style={{ color: '#7C4A2D' }}
        >
          Shop by Category
        </span>
        <h2
          className="font-serif font-normal leading-[1.15]"
          style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', color: '#0A0806' }}
        >
          Find Your <em className="italic font-light">Signature</em>
        </h2>
      </div>

      {/* Mosaic grid — full-width with own max-width + padding (matches .mosaic CSS) */}
      {/* Responsive gutter: px-4 mobile → px-7 sm → px-[52px] lg (matches --gutter CSS var) */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-12 gap-3 mx-auto px-4 sm:px-7 lg:px-[52px]"
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
              unoptimized
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
    </section>
  )
}
