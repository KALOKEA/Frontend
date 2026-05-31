'use client'
import { useEffect, useState } from 'react'
import { productsApi, type Product } from '@/lib/api/products'
import ProductCard from '@/components/shop/ProductCard'

interface RelatedProductsProps {
  category_id?: string
  exclude_id: string
}

export default function RelatedProducts({ category_id, exclude_id }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!category_id) return
    productsApi.getAll({ category_id, limit: 4 })
      .then((res) => setProducts((res.data || []).filter((p) => p.id !== exclude_id).slice(0, 4)))
      .catch(() => {})
  }, [category_id, exclude_id])

  if (!products.length) return null

  return (
    <section className="py-16 border-t border-[#e8e4e0]">
      <h3 className="font-serif text-2xl text-[#0a0a0a] mb-8 text-center">You May Also Like</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  )
}
