'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { productsApi, type Product } from '@/lib/api/products'
import ProductGrid from '@/components/shop/ProductGrid'
import FilterSidebar from '@/components/shop/FilterSidebar'
import SortDropdown from '@/components/shop/SortDropdown'
import Pagination from '@/components/shop/Pagination'

function ShopContent() {
  const params = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)

  const page = Number(params.get('page') || 1)
  const limit = 20

  useEffect(() => {
    setLoading(true)
    const query: Record<string, string> = { limit: String(limit), page: String(page) }
    if (params.get('category')) query.category_slug = params.get('category')!
    if (params.get('sort')) query.sort = params.get('sort')!
    if (params.get('min_price')) query.min_price = params.get('min_price')!
    if (params.get('max_price')) query.max_price = params.get('max_price')!
    if (params.get('size')) query.size = params.get('size')!
    if (params.get('colour')) query.colour = params.get('colour')!
    if (params.get('featured')) query.featured = params.get('featured')!

    productsApi.getAll(query)
      .then((res) => { setProducts(res.data || []); setTotal(res.meta?.total || 0) })
      .catch(() => { setProducts([]); setTotal(0) })
      .finally(() => setLoading(false))
  }, [params, page])

  const category = params.get('category')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl md:text-4xl text-[#0a0a0a] mb-1">
          {category ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : 'All Products'}
        </h1>
        <p className="text-xs font-sans text-[#6b6b6b]">{total} products</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden lg:block">
          <Suspense><FilterSidebar /></Suspense>
        </div>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-end mb-6">
            <Suspense><SortDropdown /></Suspense>
          </div>
          <ProductGrid products={products} loading={loading} />
          <Suspense><Pagination total={total} page={page} limit={limit} /></Suspense>
        </div>
      </div>
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense>
      <ShopContent />
    </Suspense>
  )
}
