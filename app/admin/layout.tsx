import type { Metadata } from 'next'
import AdminLayoutClient from './AdminLayoutClient'

/**
 * Server layout — tells crawlers to never index or follow links on /admin/*.
 * The client-side auth guard lives in AdminLayoutClient.tsx.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
