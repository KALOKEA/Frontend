'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import ProductDetailClient from './[slug]/ProductDetailClient'
import Spinner from '@/components/ui/Spinner'

function ProductPageContent() {
  const params = useSearchParams()
  const slug = params.get('slug') || ''

  if (!slug) {
    return (
      <div className="text-center py-20">
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Product not found</h1>
        <p className="text-sm font-sans text-[#6b6b6b]">No product specified.</p>
      </div>
    )
  }

  return <ProductDetailClient slug={slug} />
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  )
}
