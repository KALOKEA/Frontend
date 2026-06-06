'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'
import { getHomepageData } from '@/lib/api/homepageContent'

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    // Use homepage aggregated data first (already in-flight from other components)
    getHomepageData().then((d) => {
      if (d.categories?.length) {
        setCategories(d.categories)
        return
      }
      // Fallback to direct fetch
      return categoriesApi.getAll().then((data) => {
        setCategories(data.filter((c) => c.slug !== 'new-arrivals' && c.slug !== 'everything' && c.slug !== 'sale'))
      })
    }).catch(() => {})
  }, [])

  if (!categories.length) return null

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-2">Browse By</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0a0a0a]">Shop the Look</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.slice(0, 6).map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group relative overflow-hidden aspect-[3/4] bg-[#f4f2ef]"
          >
            {cat.image_url && (
              <Image
                src={cat.image_url}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
                loading="lazy"
              />
            )}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6 text-white">
              <p className="font-serif text-xl tracking-wide">{cat.name}</p>
              <p className="text-[10px] font-sans tracking-widest uppercase mt-1 opacity-80">Shop Now</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
