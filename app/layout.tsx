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
  logo: `${SITE_URL}/logo.png`,
  description: "India's curated women's fashion boutique — dresses, tops, shoes, bags and accessories.",
  sameAs: [
    'https://www.instagram.com/kalokea',
    'https://www.facebook.com/kalokea',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    email: 'hello@kalokea.in',
    availableLanguage: ['English', 'Hindi'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion",
  description: "Shop the latest women's fashion at Kalokea. Free shipping above ₹999.",
  keywords: 'women fashion, dresses, tops, co-ords, affordable fashion India',
  metadataBase: new URL('https://kalokea.in'),
  openGraph: {
    type: 'website',
    siteName: 'KALOKEA',
    title: "KALOKEA | Women's Fashion",
    description: "Shop the latest women's fashion at Kalokea. Free shipping above ₹999.",
    url: 'https://kalokea.in',
    images: [
      {
        url: 'https://kalokea.in/og-image.jpg',
        width: 1200,
        height: 630,
        alt: "KALOKEA — Women's Fashion",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "KALOKEA | Women's Fashion",
    description: "Shop the latest women's fashion at Kalokea. Free shipping above ₹999.",
    images: ['https://kalokea.in/og-image.jpg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        {/* Favicon + icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* API + images */}
        <link rel="preconnect" href="https://backend-production-73aa.up.railway.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://backend-production-73aa.up.railway.app" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Razorpay — preconnect so the payment modal opens instantly */}
        <link rel="preconnect" href="https://checkout.razorpay.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://checkout.razorpay.com" />
        <link rel="dns-prefetch" href="https://api.razorpay.com" />
        {/* Analytics — reduces first-beacon latency */}
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Analytics />
        <ToastProvider>
          <AuthBootstrap />
          <Header />
          <CartDrawer />
          <main>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <FooterWrapper />
        </ToastProvider>
        <LiveChatWidget />
      </body>
    </html>
  )
}
