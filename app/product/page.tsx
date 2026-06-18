'use client'
/**
 * Fallback for product pages not yet baked into the static build.
 *
 * With output:'export' + Cloudflare Pages, new products added after a deploy
 * have no /product/[slug]/index.html. The _redirects rewrite serves THIS page
 * instead (static files take priority, so existing pages are unaffected).
 *
 * This component reads the slug from window.location.pathname and renders the
 * full ProductDetailClient which fetches the product live from the API.
 */
import { useEffect, useState } from 'react'
import ProductDetailClient from './ProductDetailClient'
import Spinner from '@/components/ui/Spinner'

export default function ProductFallbackPage() {
  // undefined = still reading pathname (SSR safe), '' = bare /product/, string = valid slug
  const [slug, setSlug] = useState<string | undefined>(undefined)

  useEffect(() => {
    // pathname is e.g. /product/new-dress/ → extract "new-dress"
    const parts = window.location.pathname.replace(/\/$/, '').split('/')
    const s = parts[parts.length - 1]
    setSlug(s !== 'product' ? s : '')
  }, [])

  if (slug === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!slug) {
    // Bare /product/ — redirect to shop
    window.location.replace('/shop/')
    return null
  }

  return <ProductDetailClient slug={slug} />
}
