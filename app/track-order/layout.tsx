import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

export const metadata: Metadata = {
  title: 'Track Your Order | KALOKEA',
  description: 'Track your Kalokea order status using your order number and the email you used at checkout.',
  alternates: { canonical: 'https://kalokea.pages.dev/track-order/' },
}

export default function TrackOrderLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
