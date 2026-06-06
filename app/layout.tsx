import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CartDrawer from '@/components/layout/CartDrawer'
import { ToastProvider } from '@/components/ui/Toast'
import AuthBootstrap from '@/components/AuthBootstrap'
import Analytics from '@/components/Analytics'
import ErrorBoundary from '@/components/ErrorBoundary'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.pages.dev'

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'KALOKEA',
  url: SITE_URL,
  description: "Women's fashion e-commerce — dresses, tops, co-ords and more.",
}

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion",
  description: "Shop the latest women's fashion at Kalokea. Free shipping above ₹999.",
  keywords: 'women fashion, dresses, tops, co-ords, affordable fashion India',
  metadataBase: new URL('https://kalokea.pages.dev'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
          <main><ErrorBoundary>{children}</ErrorBoundary></main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
