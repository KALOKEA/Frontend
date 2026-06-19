import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "About Kalokea | Premium Women's Fashion Brand in India",
  description: "Learn the story behind Kalokea — India's curated D2C women's fashion brand. Our mission, values, and commitment to quality contemporary clothing for modern Indian women. Free shipping, 7-day returns, COD available.",
  openGraph: {
    title: "About Kalokea | Women's Fashion Brand India",
    description: "Kalokea is a premium D2C women's fashion brand offering dresses, tops, co-ord sets, bottoms, and bags. Curated quality, honest pricing, free shipping above ₹999.",
    url: 'https://kalokea.in/about/',
    images: [{ url: 'https://kalokea.in/og-image.jpg', width: 1200, height: 630, alt: 'About Kalokea' }],
  },
  alternates: { canonical: 'https://kalokea.in/about/' },
}

const ABOUT_PAGE_LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  '@id': 'https://kalokea.in/about/#webpage',
  url: 'https://kalokea.in/about/',
  name: "About Kalokea — Premium Women's Fashion Brand in India",
  description: "Kalokea is a premium direct-to-consumer (D2C) women's fashion brand in India. We curate contemporary women's clothing — dresses, tops, co-ord sets, bottoms, and bags — with a focus on quality, fit, and modern style for the Indian woman.",
  isPartOf: { '@id': 'https://kalokea.in/#website' },
  about: { '@id': 'https://kalokea.in/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://kalokea.in/' },
      { '@type': 'ListItem', position: 2, name: 'About Us', item: 'https://kalokea.in/about/' },
    ],
  },
  mainEntity: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://kalokea.in/#organization',
    name: 'Kalokea',
    url: 'https://kalokea.in',
    logo: { '@type': 'ImageObject', url: 'https://kalokea.in/logo.png', width: 200, height: 60 },
    description: "Kalokea is a premium direct-to-consumer (D2C) women's fashion brand based in India offering curated dresses, tops, co-ord sets, bottoms, bags and jumpsuits. Free shipping above ₹999, 7-day returns, COD available.",
    slogan: "Contemporary Women's Fashion, Made for Modern India",
    foundingDate: '2024',
    foundingLocation: { '@type': 'Country', name: 'India' },
    areaServed: { '@type': 'Country', name: 'India' },
    knowsAbout: ["Women's Fashion", "Women's Clothing", "Dresses", "Tops", "Co-ord Sets", "Fashion Bags", "Indian Fashion"],
    sameAs: ['https://www.instagram.com/kalokea', 'https://www.facebook.com/kalokea.in'],
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'hello@kalokea.in', availableLanguage: ['English', 'Hindi'] },
    hasOfferCatalog: { '@type': 'OfferCatalog', name: "Kalokea Women's Fashion Collection", url: 'https://kalokea.in/shop/' },
  },
})

export default function AboutLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ABOUT_PAGE_LD }} />
      {children}
    </>
  )
}
