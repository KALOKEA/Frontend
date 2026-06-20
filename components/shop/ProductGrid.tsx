import type { ReactNode } from 'react'
import ProductCard from './ProductCard'
import type { Product } from '@/lib/api/products'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  emptyMessage?: string
  emptySubtext?: string
  emptyAction?: ReactNode
}

export default function ProductGrid({ products, loading, emptyMessage, emptySubtext, emptyAction }: ProductGridProps) {
  if (loading) {
    return <ProductGridSkeleton count={8} />
  }

  if (!products.length) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-2xl text-[#0a0a0a] mb-2">{emptyMessage ?? 'No products found'}</p>
        <p className="text-sm font-sans text-[#6b6b6b]">{emptySubtext ?? 'Try adjusting your filters'}</p>
        {emptyAction}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
