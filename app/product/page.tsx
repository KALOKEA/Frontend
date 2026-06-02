import Link from 'next/link'
import type { Metadata } from 'next'

// Product detail now lives at /product/[slug] (statically prerendered).
// This bare /product index just points shoppers to the shop listing.
// (public/_redirects also 301s /product -> /shop at the edge.)
export const metadata: Metadata = {
  title: "Shop | Women's Fashion | KALOKEA",
  robots: { index: false, follow: true },
}

export default function ProductIndexPage() {
  return (
    <div className="text-center py-24">
      <h1 className="font-serif text-3xl text-[#0a0a0a] mb-3">Browse our collection</h1>
      <p className="text-sm font-sans text-[#6b6b6b] mb-6">Discover the latest in women&apos;s fashion.</p>
      <Link href="/shop" className="inline-block bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-6 py-3">
        Go to Shop
      </Link>
    </div>
  )
}
