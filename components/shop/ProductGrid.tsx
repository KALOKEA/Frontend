import ProductCard from './ProductCard'
import type { Product } from '@/lib/api/products'
import Spinner from '@/components/ui/Spinner'

interface ProductGridProps {
  products: Product[]
  loading?: boolean
}

export default function ProductGrid({ products, loading }: ProductGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!products.length) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-2xl text-[#0a0a0a] mb-2">No products found</p>
        <p className="text-sm font-sans text-[#6b6b6b]">Try adjusting your filters</p>
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
