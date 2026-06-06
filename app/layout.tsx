import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.pages.dev'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KALOKEA',
  url: SITE_URL,
  description: "Women's fashion e-commerce — dresses, tops, co-ords and more.",
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
  metadataBase: new URL('https://kalokea.pages.dev'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://backend-production-73aa.up.railway.app" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://backend-production-73aa.up.railway.app" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
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
          <Footer />
        </ToastProvider>
        <LiveChatWidget />
      </body>
    </html>
  )
}
