'use client'
import { useState, useEffect } from 'react'
import { productsApi, type Product } from '@/lib/api/products'
import ProductCard from '@/components/shop/ProductCard'
import Spinner from '@/components/ui/Spinner'

const TABS = [
  { label: 'New Arrivals', sort: 'newest' },
  { label: 'Best Sellers', sort: 'newest' },
  { label: 'Featured', featured: 'true' },
  { label: 'Sale', category: 'sale' },
]

export default function FeaturedProducts() {
  const [tab, setTab] = useState(0)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    const t = TABS[tab]
    const params: Record<string, string> = { limit: '8', sort: t.sort || 'newest' }
    if (t.featured) params.featured = t.featured
    if (t.category) params.category_slug = t.category

    productsApi.getAll(params)
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [tab])

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-2">Hand-Picked</p>
        <h2 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] mb-6">Featured Pieces</h2>
        <div className="flex items-center justify-center gap-0 border border-[#e8e4e0] w-fit mx-auto">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setTab(i)}
              className={`px-5 py-2.5 text-[10px] font-sans tracking-widest uppercase transition-colors border-r last:border-r-0 border-[#e8e4e0] ${i === tab ? 'bg-[#0a0a0a] text-white' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  )
}
