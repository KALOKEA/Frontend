'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { getHomepageData } from '@/lib/api/homepageContent'

// Unsplash fallback images (same as prototype) — used when backend image_url is empty
const FALLBACK_IMAGES: Record<string, string> = {
  dresses:     'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=75',
  tops:        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&q=75',
  bags:        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=75',
  bottoms:     'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=75',
  accessories: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=75',
  shoes:       'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=75',
  default:     'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=75',
}

// Static fallback categories — shown when backend returns no categories
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

  // Always render — static fallback ensures categories is never empty after mount
  const cats = categories.length ? categories : STATIC_CATEGORIES
  const [featured, ...rest] = cats.slice(0, 6)

  return (
    <section className="py-20 bg-[#F2EAE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Section header */}
        <div className="text-center mb-12">
          <div className="eyebrow-center mb-4">Shop by Category</div>
          <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Find Your <em className="italic" style={{ color: '#7C4A2D' }}>Signature</em>
          </h2>
        </div>

        {/* Grid */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">

          {/* Featured — spans 2 cols on md+ */}
          {featured && (
            <Link
              href={`/shop?category=${featured.slug}`}
              className="group relative overflow-hidden bg-[#E0D4C4] col-span-2 md:col-span-1 row-span-2 aspect-[3/4] md:aspect-auto"
              style={{ minHeight: 420 }}
            >
              <Image
                src={getCatImage(featured)}
                alt={featured.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
                loading="lazy"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/18 to-transparent group-hover:from-black/76 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-8 text-[#FDFAF6]">
                <span className="text-[9px] font-sans tracking-[0.28em] uppercase text-[#FDFAF6]/60 mb-2">Featured</span>
                <p className="font-serif font-light text-[1.6rem] leading-tight tracking-wide">{featured.name}</p>
                <span className="mt-3 text-[9.5px] font-sans tracking-widest uppercase border-b border-[#C4A882] pb-0.5 text-[#C4A882] group-hover:text-white transition-colors">
                  Shop Now →
                </span>
              </div>
            </Link>
          )}

          {/* Rest */}
          {rest.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden bg-[#E0D4C4] aspect-square"
            >
              <Image
                src={getCatImage(cat)}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                sizes="(max-width: 768px) 50vw, 25vw"
                loading="lazy"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/70 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-5 px-3 text-[#FDFAF6] text-center">
                <p className="font-serif font-light text-[1rem] sm:text-[1.1rem] tracking-wide leading-tight">{cat.name}</p>
                <span className="mt-1.5 text-[9px] font-sans tracking-widest uppercase text-[#C4A882] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
