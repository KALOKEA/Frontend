import type { Metadata, Viewport } from 'next'

export const viewport: Viewport = { width: 'device-width', initialScale: 1 }

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kalokea.com'

export const metadata: Metadata = {
  title: 'Help & Support | KALOKEA',
  description:
    'Get help with your Kalokea order — shipping, returns, exchanges, sizing, COD and payments. Browse FAQs or reach us on WhatsApp and email.',
  alternates: { canonical: `${SITE_URL}/help/` },
  openGraph: {
    title: 'Help & Support | KALOKEA',
    description: 'FAQs and customer support for Kalokea — orders, shipping, returns, sizing and payments.',
    url: `${SITE_URL}/help/`,
  },
}

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children
}
