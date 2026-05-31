import type { Product } from '@/lib/api/products'
import type { Category } from '@/lib/api/categories'
import { formatPrice } from './formatPrice'

export function productMeta(product: Product) {
  const img = product.product_images?.find((i) => i.is_primary)?.url
  return {
    title: `${product.name} — ${product.categories?.name || 'Kalokea'} | KALOKEA`,
    description: (product.description || `Shop ${product.name} at Kalokea`).slice(0, 155),
    openGraph: {
      title: product.name,
      description: (product.description || `Shop ${product.name} at Kalokea`).slice(0, 155),
      images: img ? [{ url: img }] : [],
    },
  }
}

export function categoryMeta(category: Category) {
  return {
    title: `${category.name} | Women's Fashion | KALOKEA`,
    description: `Shop the latest ${category.name.toLowerCase()} at Kalokea. Free shipping above ₹999.`,
  }
}
