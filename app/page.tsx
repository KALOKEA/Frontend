import HeroBanner from '@/components/home/HeroBanner'
import TrustStrip from '@/components/home/TrustStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import EditorialBanner from '@/components/home/EditorialBanner'
import BestSellers from '@/components/home/BestSellers'
import PressStrip from '@/components/home/PressStrip'
import InstagramGrid from '@/components/home/InstagramGrid'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion — Dresses, Tops, Shoes & Accessories India",
  description:
    "Shop Kalokea — India's curated women's fashion boutique. Dresses, tops, bottoms, shoes, bags and accessories. Exclusive designs, premium quality. Free shipping above ₹999. New arrivals every week.",
  keywords: [
    // Brand
    'kalokea', 'kalokea fashion', 'kalokea clothing', 'kalokea online store',
    "kalokea women's fashion", 'kalokea india', 'kalokea collection', 'kalokea boutique',
    // Broad women's fashion India
    "women's fashion india", 'online shopping for women india', "women's clothing online india",
    "buy women's clothes india", "women's clothing brand india", "women's boutique online india",
    "women's fashion store india", "women's apparel india", "women's wear india",
    // Style descriptors
    "trendy women's clothing india", "stylish women's wear", "contemporary women's fashion",
    "women's western wear india", "women's ethnic fusion wear", "women's premium fashion online",
    "women's wardrobe essentials", 'fashion for modern women', "women's designer wear india",
    // Categories
    "buy dresses online india", "women's tops online india", "women's shoes online india",
    "women's handbags india", "women's accessories india", "women's skirts india",
    "women's trousers india", "women's bottoms india",
    // Occasion
    "women's party wear india", "women's office wear india", "women's casual wear india",
    "women's festive wear india", "women's everyday fashion", "women's evening wear india",
    "women's brunch outfits india",
    // Value
    "affordable women's fashion india", "women's clothing deals india",
    "women's latest fashion 2025", 'new arrivals women fashion india',
    // Long-tail
    "shop women's clothes online india", "women's dress shopping india",
    "best women's fashion brand india", "women's style india",
    "women's fashion shopping india", "women's clothing collection india",
    'free shipping women fashion india', "women's fashion free delivery india",
  ].join(', '),
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

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kalokea',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL}/shop/everything/?q={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />

      <HeroBanner />
      <TrustStrip />
      <CategoryGrid />
      <FeaturedProducts />
      <EditorialBanner />
      <BestSellers />
      <PressStrip />
      <InstagramGrid />
      <NewsletterSignup />
    </>
  )
}
