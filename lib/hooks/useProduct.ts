'use client'
import { useEffect, useState } from 'react'
import { productsApi, type Product } from '@/lib/api/products'

export function useProduct(slug: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    productsApi.getBySlug(slug)
      .then(setProduct)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [slug])

  return { product, loading, error }
}
