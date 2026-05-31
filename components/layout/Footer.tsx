import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white pt-16 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="font-serif text-2xl tracking-widest mb-4">KALOKEA</h4>
            <p className="text-[#6b6b6b] text-xs font-sans leading-relaxed mb-4">
              Fashion that celebrates every woman. Confident. Elegant. Unstoppable.
            </p>
            <div className="flex gap-3">
              {['instagram','facebook','pinterest'].map((s) => (
                <a key={s} href="#" className="w-8 h-8 border border-[#2a2a2a] flex items-center justify-center text-[#6b6b6b] hover:border-[#c8a4a5] hover:text-[#c8a4a5] transition-colors">
                  <span className="text-[10px] uppercase">{s[0]}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Shop</h5>
            <ul className="space-y-2">
              {['New Arrivals','Dresses','Tops','Bottoms','Shoes','Bags','Accessories','Sale'].map((cat) => (
                <li key={cat}>
                  <Link href={`/shop?category=${cat.toLowerCase().replace(' ','-')}`} className="text-xs font-sans text-[#e8e4e0] hover:text-[#c8a4a5] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Account</h5>
            <ul className="space-y-2">
              {[['My Orders','/account/orders'],['My Profile','/account/profile'],['My Addresses','/account/addresses'],['Wishlist','/account/wishlist'],['My Reviews','/account/reviews']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs font-sans text-[#e8e4e0] hover:text-[#c8a4a5] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-4">Help</h5>
            <ul className="space-y-2">
              {[['Size Guide','/size-guide'],['Shipping','/shipping'],['Returns','/returns'],['Contact Us','/contact'],['Privacy Policy','/privacy'],['Terms','/terms']].map(([label, href]) => (
                <li key={href}>
                  <Link href={href} className="text-xs font-sans text-[#e8e4e0] hover:text-[#c8a4a5] transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] font-sans text-[#6b6b6b]">© 2026 Kalokea. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-sans text-[#6b6b6b] tracking-widest">SECURE PAYMENTS</span>
            <div className="flex gap-2">
              {['Visa','MC','UPI','RZP'].map((m) => (
                <span key={m} className="border border-[#2a2a2a] px-2 py-0.5 text-[9px] font-sans text-[#6b6b6b]">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
