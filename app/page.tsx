import HeroBanner from '@/components/home/HeroBanner'
import TrustStrip from '@/components/home/TrustStrip'
import QuoteStrip from '@/components/home/QuoteStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialBanner from '@/components/home/EditorialBanner'
import BestSellers from '@/components/home/BestSellers'
import FromTheJournal from '@/components/home/FromTheJournal'
import ShopTheLook from '@/components/home/ShopTheLook'
import WhyKalokea from '@/components/home/WhyKalokea'
import Testimonials from '@/components/home/Testimonials'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import type { Metadata } from 'next'

import { BASE_URL } from '@/lib/api/client'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.com'

// Build-time homepage fetch. Because the site is `output: 'export'`, this runs
// ONCE during the build and the resulting hero content is baked into the static
// HTML — so the correct hero image is present on the very first paint, with no
// client-side API round-trip and no flash of the placeholder/stock image.
// Fails safe: if the backend is unreachable at build time it returns null and the
// component falls back to HERO_DEFAULTS, then the client revalidation fills in
// real data after mount.
async function getInitialCms(): Promise<Record<string, string> | null> {
  try {
    const res = await fetch(`${BASE_URL}/homepage`, { cache: 'force-cache' })
    if (!res.ok) return null
    const json = await res.json()
    const raw = json?.data ?? json
    return (raw?.cms as Record<string, string>) ?? null
  } catch {
    return null
  }
}

// SITE_URL is used for metadata alternates and OG URLs
export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion — Dresses, Tops, Shoes & Accessories India",
  description:
    "Shop Kalokea — India's curated women's fashion boutique. Dresses, tops, bottoms, shoes, bags and accessories. Exclusive designs, premium quality. Free shipping above ₹999. New arrivals every week.",
  // Google & Bing ignore the keywords meta tag; we keep a short, honest set
  // rather than a multi-hundred-term blob (which reads as keyword-stuffing spam).
  keywords: [
    'Kalokea', "women's fashion India", "women's clothing online India",
    'dresses', 'tops', 'co-ord sets', 'bottoms', 'bags',
    'ethnic wear', 'western wear', 'online boutique India',
  ],
  alternates: { canonical: `${SITE_URL}/` },
  openGraph: {
    title: "KALOKEA | Women's Fashion — Dresses, Tops, Shoes & Accessories India",
    description:
      "Discover Kalokea's curated women's fashion. Dresses, tops, shoes, bags and accessories — free shipping above ₹999.",
    url: `${SITE_URL}/`,
    siteName: 'Kalokea',
    type: 'website',
    images: [{ url: `${SITE_URL}/og-image.jpg`, width: 1200, height: 630, alt: "Kalokea — Women's Fashion India" }],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KALOKEA | Women's Fashion India",
    description: "Dresses, tops, shoes, bags and accessories for modern women. Free shipping above ₹999.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
}

export default async function HomePage() {
  const initialCms = await getInitialCms()
  return (
    <>
      <HeroBanner initialCms={initialCms} />
      <TrustStrip />
      <QuoteStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialBanner initialCms={initialCms} />
      <BestSellers />
      <FromTheJournal />
      <ShopTheLook />
      <WhyKalokea />
      <Testimonials />
      <NewsletterSignup />
    </>
  )
}
