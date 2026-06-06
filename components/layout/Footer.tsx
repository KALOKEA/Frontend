import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-8 pb-5 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Top section: brand + links */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 mb-8">

          {/* Brand — full row on mobile, 1 column on sm+ */}
          <div className="col-span-3 sm:col-span-1">
            <h4 className="font-serif text-lg tracking-widest text-white mb-1">KALOKEA</h4>
            <p className="text-[#6b6b6b] text-[11px] font-sans leading-relaxed">
              Fashion for every woman.
            </p>
          </div>

          {/* Shop */}
          <div className="flex flex-col gap-2 text-[11px] font-sans">
            <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Shop</span>
            {['New Arrivals','Dresses','Tops','Bottoms','Sale'].map(c => (
              <Link
                key={c}
                href={`/shop?category=${c.toLowerCase().replace(/ /g,'-')}`}
                className="text-[#9b9b9b] hover:text-[#c8a4a5] transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>

          {/* Account */}
          <div className="flex flex-col gap-2 text-[11px] font-sans">
            <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Account</span>
            {([['Orders','/account/orders'],['Profile','/account/profile'],['Wishlist','/account/wishlist']] as [string,string][]).map(([l,h]) => (
              <Link key={h} href={h} className="text-[#9b9b9b] hover:text-[#c8a4a5] transition-colors">{l}</Link>
            ))}
          </div>

          {/* Help */}
          <div className="flex flex-col gap-2 text-[11px] font-sans">
            <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Help</span>
            {([
              ['Track Order','/track-order'],
              ['Shipping Policy','/shipping-policy'],
              ['Refund Policy','/refund-policy'],
              ['Contact Us','/contact'],
              ['About','/about'],
            ] as [string,string][]).map(([l,h]) => (
              <Link key={h} href={h} className="text-[#9b9b9b] hover:text-[#c8a4a5] transition-colors">{l}</Link>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a1a] pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[10px] font-sans text-[#6b6b6b]">
            © {new Date().getFullYear()} Kalokea. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Visa','MC','UPI','RZP'].map(m => (
              <span key={m} className="border border-[#2a2a2a] px-1.5 py-0.5 text-[9px] font-sans text-[#6b6b6b]">
                {m}
              </span>
            ))}
            <Link href="/privacy-policy" className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5]">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5]">Terms</Link>
            <Link href="/refund-policy" className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5]">Refunds</Link>
            <Link href="/shipping-policy" className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5]">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
