import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import FooterWrapper from '@/components/layout/FooterWrapper'
import CartDrawer from '@/components/layout/CartDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import AuthBootstrap from '@/components/AuthBootstrap'
import Analytics from '@/components/Analytics'
import ErrorBoundary from '@/components/ErrorBoundary'
import LiveChatWidget from '@/components/LiveChatWidget'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import BackToTop from '@/components/layout/BackToTop'
import ScrollRevealInit from '@/components/ScrollRevealInit'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.in'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Kalokea',
  url: SITE_URL,
  logo: {
    '@type': 'ImageObject',
    url: `${SITE_URL}/logo.png`,
    width: 200,
    height: 60,
  },
  description: "India's curated women's fashion boutique — dresses, tops, shoes, bags and accessories.",
  foundingDate: '2024',
  sameAs: [
    'https://www.instagram.com/kalokea.fashion',
    'https://www.facebook.com/kalokea.in',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@kalokea.in',
    availableLanguage: ['English', 'Hindi'],
  },
}

// WebSite schema tells Google about the site search — enables Sitelinks Searchbox
// in search results when users search for "kalokea".
const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Kalokea',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/shop/?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion — Dresses, Tops & More",
  description: "Shop the latest women's fashion at Kalokea — dresses, tops, co-ords, bags and accessories. Free shipping above ₹999. Easy 7-day returns. COD available pan India.",
  keywords: [
    // Brand
    'kalokea', 'kalokea fashion', 'kalokea women', 'kalokea online',
    // Core categories
    "women's fashion india", "women's clothing online", "ladies fashion india", "girls fashion online",
    "women's dresses", "women's tops", "women's kurtas", "women's blouses",
    "women's co-ords", "women's palazzo", "women's skirts", "women's pants",
    "women's bags", "women's handbags", "women's tote bags", "women's sling bags",
    "women's accessories", "women's jewellery", "women's earrings",
    // Dress types
    'maxi dress', 'midi dress', 'mini dress', 'floral dress', 'casual dress',
    'party wear dress', 'summer dress', 'western dress', 'bodycon dress',
    'a-line dress', 'wrap dress', 'shift dress', 'shirt dress',
    'ethnic dress', 'fusion dress', 'indo-western dress',
    // Tops
    'crop top', 'women top', 'flowy top', 'linen top', 'cotton top',
    'printed top', 'embroidered top', 'designer top', 'trendy top',
    'formal top women', 'casual top women', 'boho top',
    // Bottoms
    'palazzo pants', 'wide leg pants', 'straight pants', 'high waist pants',
    'flared skirt', 'pencil skirt', 'wrap skirt', 'midi skirt',
    // Co-ords & sets
    'co-ord set', 'matching set women', 'co-ord set india', 'two piece set',
    'crop top skirt set', 'loungewear set', 'linen co-ord',
    // Ethnic & fusion
    'kurta set', 'kurti women', 'indo-western', 'ethnic wear online',
    'fusion wear india', 'desi fashion', 'indian fashion online',
    // Bags
    'women handbag', 'tote bag', 'shoulder bag', 'crossbody bag',
    'clutch bag', 'bucket bag', 'leather bag women', 'canvas bag women',
    // Fashion descriptors
    'affordable fashion india', 'budget fashion india', 'stylish women india',
    'trendy clothes india', 'everyday fashion', 'office wear women',
    'party wear women', 'beach wear women', 'vacation outfits',
    'summer collection india', 'festive wear women',
    // Style movements
    'boho fashion india', 'minimalist fashion', 'capsule wardrobe india',
    'slow fashion india', 'sustainable fashion india', 'ethical fashion india',
    // Shopping terms
    'buy dresses online india', 'buy tops online india', 'buy women clothes online',
    'online shopping for women', 'women fashion website india',
    'new arrivals women fashion', 'sale women clothes',
    'discount women clothing india', 'free shipping clothes india',
    // Fabric
    'linen dress women', 'cotton dress women', 'georgette dress',
    'rayon kurta', 'silk top women', 'chiffon dress',
    // Occasions
    'bridal wear', 'wedding guest outfit', 'reception outfit women',
    'office wear india', 'casual wear women india', 'date night outfit',
    'college girl fashion', 'work from home outfit',
    // City-specific
    'women fashion mumbai', 'women fashion delhi', 'women fashion bangalore',
    'women fashion chennai', 'women fashion hyderabad', 'women fashion pune',
    'women fashion kolkata', 'women fashion ahmedabad',
    // Lifestyle & brand terms
    'kalokea dresses', 'kalokea tops', 'kalokea bags', 'kalokea co-ords',
    'shop kalokea', 'kalokea india', 'kalokea new arrivals',
    'women boutique online india', 'premium women fashion',
    'curated women fashion', 'women fashion brand india',
    'made in india fashion', 'indian women clothing brand',
    // Price & value
    'affordable dresses india', 'cheap women clothes india',
    'fashion under 999', 'fashion under 1999', 'best price women fashion',
    'value fashion india', 'quality women clothes',
    // Returns & services
    'cod fashion india', 'cash on delivery clothes', '7 day return policy',
    'easy return fashion', 'free delivery fashion india',
    // SEO long-tail
    'best women fashion brand india 2025', 'top women clothing store india',
    'women online boutique india', 'ladies suit sets online',
    'trendy kurta sets online', 'western wear for women india',
    'latest fashion for women india', 'stylish clothes for women online',
    'new fashion arrivals india every friday', 'friday fashion drop',
    'ethically sourced clothes india', 'women premium ethnic wear',
    'indo-western fusion wear online', 'bollywood inspired fashion',
    'celebrity fashion india', 'instagram fashion india',
    'ootd india women', 'fashion blogger india outfit',
    'women party outfits india', 'bridesmaid outfits india',
    'mehndi outfit women', 'sangeet outfit', 'garba wear women',
    'navratri outfit', 'diwali fashion women', 'eid outfits women',
  ].join(', '),
  metadataBase: new URL('https://kalokea.in'),
  openGraph: {
    type: 'website',
    siteName: 'KALOKEA',
    title: "KALOKEA | Women's Fashion",
    description: "Shop the latest women's fashion at Kalokea. Free shipping above Rs.999.",
    url: 'https://kalokea.in',
    images: [
      {
        url: 'https://kalokea.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "KALOKEA -- Women's Fashion",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KALOKEA | Women's Fashion",
    description: "Shop the latest women's fashion at Kalokea. Free shipping above Rs.999.",
    images: ['https://kalokea.in/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Favicons — all KALOKEA logo files from /public */}
        <link rel="shortcut icon"   href="/favicon.ico" />
        <link rel="icon"            href="/favicon.ico" sizes="any" />
        <link rel="icon"            type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon"            type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180"   href="/apple-touch-icon.png" />
        {/* Open Graph / PWA manifest logo */}
        <link rel="image_src" href="/logo.png" />
        {/* API + images */}
        <link rel="preconnect" href="https://backend-production-73aa.up.railway.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://backend-production-73aa.up.railway.app" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Razorpay -- preconnect so the payment modal opens instantly */}
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
        {/* Analytics -- reduces first-beacon latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body>
        {/* Skip-to-content — WCAG 2.4.1 (Level A). Visible only on keyboard focus. */}
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Analytics />
        <ToastProvider>
          <AuthBootstrap />
          <Header />
          <CartDrawer />
          {/* pt accounts for fixed header: ~36px announcement bar + 58/68px nav */}
          <main id="main-content" tabIndex={-1} className="pt-[94px] md:pt-[104px]">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <FooterWrapper />
        </ToastProvider>
        <LiveChatWidget />
        <WhatsAppButton />
        <BackToTop />
        <ScrollRevealInit />
      </body>
    </html>
  )
}
