import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Shop Women's Fashion — Dresses, Tops & More | Kalokea",
  description:
    "Browse Kalokea's complete women's fashion collection. Shop dresses, tops, bottoms, shoes, bags and accessories. Free shipping above ₹999.",
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'}/shop/`,
  },
  openGraph: {
    title: "Shop Women's Fashion | Kalokea",
    description: "Curated women's fashion — dresses, tops, bottoms, shoes, bags and accessories.",
    type: 'website',
    siteName: 'Kalokea',
  },
}

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
