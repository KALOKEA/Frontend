import type { Metadata } from 'next'
import Link from 'next/link'
import CmsPageContent from '@/components/CmsPageContent'

export const metadata: Metadata = {
  title: 'Refund & Return Policy | Kalokea',
  description: 'Kalokea refund and return policy — 7-day returns on eligible items.',
  alternates: { canonical: 'https://kalokea.in/refund-policy/' },
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <nav className="flex items-center gap-1.5 text-[10px] font-sans tracking-widest uppercase text-[#9b9b9b] mb-10">
        <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
        <span>/</span>
        <span className="text-[#6b6b6b]">Refund & Return Policy</span>
      </nav>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Refund & Return Policy</h1>
      <p className="text-sm font-sans text-[#9b9b9b] mb-10">Last updated: June 2025</p>
      <CmsPageContent slug="refund-policy" />
    </div>
  )
}
