'use client'
import { useEffect, useState } from 'react'
import { productsApi, type Product } from '@/lib/api/products'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import ProductCard from '@/components/shop/ProductCard'
import Spinner from '@/components/ui/Spinner'
import Link from 'next/link'

export default function WishlistPage() {
  const { items } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!items.length) { setLoading(false); return }
    // Fetch each product by loading all and filtering — simple approach
    Promise.all(items.slice(0, 20).map((id) => {
      // We don't have a get-by-id API, so show what we have from wishlist store
      return null
    }))
    setLoading(false)
    // Better: fetch from products API with featured flag and filter locally
    productsApi.getAll({ limit: '100' }).then((res) => {
      const filtered = (res.data || []).filter((p) => items.includes(p.id))
      setProducts(filtered)
    }).finally(() => setLoading(false))
  }, [items])

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>

  if (!items.length) return (
    <div className="text-center py-16">
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-2">Your wishlist is empty</h2>
      <p className="text-sm font-sans text-[#6b6b6b] mb-6">Save items you love and come back to them later.</p>
      <Link href="/shop" className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-6 py-3">
        Browse Products
      </Link>
    </div>
  )

  return (
    <div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">My Wishlist ({items.length})</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
