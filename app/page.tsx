import HeroBanner from '@/components/home/HeroBanner'
import TrustStrip from '@/components/home/TrustStrip'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion — Made For Women Who Choose Themselves",
  description: "Shop the latest women's fashion at Kalokea. Dresses, tops, bottoms, shoes, bags and accessories. Free shipping above ₹999.",
}

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <TrustStrip />
      <FeaturedProducts />
      <CategoryGrid />
      <NewsletterSignup />
    </>
  )
}
