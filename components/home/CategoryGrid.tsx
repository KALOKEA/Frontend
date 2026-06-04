'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { categoriesApi, type Category } from '@/lib/api/categories'

const CATEGORY_IMAGES: Record<string, string> = {
  dresses: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&h=800&fit=crop',
  tops: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&h=800&fit=crop',
  bottoms: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4b95?w=600&h=800&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
  bags: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=800&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&h=800&fit=crop',
}

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    categoriesApi.getAll().then((data) => {
      setCategories(data.filter((c) => c.slug !== 'new-arrivals' && c.slug !== 'everything' && c.slug !== 'sale'))
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
            {(cat.image_url || CATEGORY_IMAGES[cat.slug]) && (
              <img
                src={cat.image_url || CATEGORY_IMAGES[cat.slug]}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
