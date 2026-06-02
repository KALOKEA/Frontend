import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { ToastProvider } from '@/components/ui/Toast'
import AuthBootstrap from '@/components/AuthBootstrap'

export const metadata: Metadata = {
  title: "KALOKEA | Women's Fashion",
  description: "Shop the latest women's fashion at Kalokea. Free shipping above ₹999.",
  keywords: 'women fashion, dresses, tops, co-ords, affordable fashion India',
  metadataBase: new URL('https://kalokea.pages.dev'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <AuthBootstrap />
          <Header />
          <main>{children}</main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  )
}
