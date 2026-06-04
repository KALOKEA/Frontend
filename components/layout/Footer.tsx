import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-8 pb-5 mt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Single compact row: brand + links */}
        <div className="flex flex-col md:flex-row md:items-start gap-6 mb-6">

          {/* Brand */}
          <div className="shrink-0">
            <h4 className="font-serif text-lg tracking-widest text-white mb-1">KALOKEA</h4>
            <p className="text-[#6b6b6b] text-[11px] font-sans">Fashion for every woman.</p>
          </div>

          {/* Links — horizontal wrap */}
          <div className="flex-1 flex flex-wrap gap-x-8 gap-y-3 md:justify-end text-[11px] font-sans">
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Shop</span>
              {['New Arrivals','Dresses','Tops','Bottoms','Sale'].map(c => (
                <Link key={c} href={`/shop?category=${c.toLowerCase().replace(/ /g,'-')}`} className="text-[#9b9b9b] hover:text-[#c8a4a5] transition-colors">{c}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Account</span>
              {[['Orders','/account/orders'],['Profile','/account/profile'],['Wishlist','/account/wishlist']].map(([l,h]) => (
                <Link key={h} href={h} className="text-[#9b9b9b] hover:text-[#c8a4a5] transition-colors">{l}</Link>
              ))}
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[9px] uppercase tracking-widest text-[#6b6b6b] mb-0.5">Help</span>
              {[['Shipping','/shipping'],['Returns','/returns'],['Contact','/contact'],['About','/about']].map(([l,h]) => (
                <Link key={h} href={h} className="text-[#9b9b9b] hover:text-[#c8a4a5] transition-colors">{l}</Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1a1a1a] pt-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[10px] font-sans text-[#6b6b6b]">© {new Date().getFullYear()} Kalokea. All rights reserved.</p>
          <div className="flex items-center gap-3">
            {['Visa','MC','UPI','RZP'].map(m => (
              <span key={m} className="border border-[#2a2a2a] px-1.5 py-0.5 text-[9px] font-sans text-[#6b6b6b]">{m}</span>
            ))}
            <Link href="/privacy" className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5]">Privacy</Link>
            <Link href="/terms" className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#c8a4a5]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
