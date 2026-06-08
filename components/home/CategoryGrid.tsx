'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { getHomepageData } from '@/lib/api/homepageContent'

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
        setCategories(data.filter((c) => c.slug !== 'new-arrivals' && c.slug !== 'everything' && c.slug !== 'sale'))
      })
    }).catch(() => {})
  }, [])

  // Reveal on scroll
  useEffect(() => {
    if (!gridRef.current || !categories.length) return
    const el = gridRef.current
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        el.classList.add('revealed')
        obs.disconnect()
      }
    }, { threshold: 0.08 })
    el.classList.add('reveal-ready')
    obs.observe(el)
    return () => obs.disconnect()
  }, [categories])

  if (!categories.length) return null

  const [featured, ...rest] = categories.slice(0, 6)

  return (
    <section className="py-20 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-[10px] font-sans tracking-[0.35em] uppercase text-[#c8a4a5] mb-3">Browse By</p>
          <h2 className="font-serif font-light text-[#0a0a0a] mb-2" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Shop the Look
          </h2>
          <div className="mx-auto w-10 h-px bg-[#c8a4a5] mt-4" />
        </div>

        {/* Grid: featured (col-span-2) + 4 smaller */}
        <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">

          {/* Featured — spans 2 cols on md+ */}
          {featured && (
            <Link
              href={`/shop?category=${featured.slug}`}
              className="group relative overflow-hidden bg-[#f4f2ef] col-span-2 md:col-span-1 row-span-2 aspect-[3/4] md:aspect-auto"
              style={{ minHeight: '420px' }}
            >
              {featured.image_url && (
                <Image
                  src={featured.image_url}
                  alt={featured.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                  unoptimized
                />
              )}
              {/* Gradient overlay — darker for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent group-hover:from-black/75 transition-all duration-500" />
              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-start justify-end p-6 sm:p-8 text-white">
                <span className="text-[9px] font-sans tracking-[0.3em] uppercase text-white/60 mb-2">Featured Category</span>
                <p className="font-serif font-light text-[1.6rem] leading-tight tracking-wide">{featured.name}</p>
                <span className="mt-3 text-[10px] font-sans tracking-widest uppercase border-b border-[#c8a4a5] pb-0.5 text-[#e8c9ca] group-hover:text-white transition-colors">
                  Shop Now →
                </span>
              </div>
            </Link>
          )}

          {/* Remaining 4 in 2-col grid on right side */}
          {rest.slice(0, 5).map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className="group relative overflow-hidden bg-[#f4f2ef] aspect-square"
            >
              {cat.image_url && (
                <Image
                  src={cat.image_url}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  loading="lazy"
                  unoptimized
                />
              )}
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent group-hover:from-black/65 transition-all duration-500" />
              {/* Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-4 sm:pb-5 px-3 text-white text-center">
                <p className="font-serif font-light text-[1rem] sm:text-[1.1rem] tracking-wide leading-tight">{cat.name}</p>
                {/* Underline reveal on hover */}
                <span className="mt-1.5 text-[9px] font-sans tracking-widest uppercase text-[#c8a4a5] opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
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
