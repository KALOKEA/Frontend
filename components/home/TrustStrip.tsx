'use client'

const ITEMS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: 'Free Shipping ₹999+',
    sub: 'On all orders above ₹999',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Pan India Delivery',
    sub: 'Ships to all 28 states',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
    ),
    title: '7-Day Easy Returns',
    sub: 'Hassle-free return policy',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
    title: 'Secure Checkout',
    sub: 'Razorpay 256-bit encrypted',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2"/>
        <line x1="2" y1="10" x2="22" y2="10"/>
      </svg>
    ),
    title: 'COD Available',
    sub: 'Cash on delivery pan India',
  },
]

export default function TrustStrip() {
  return (
    <section
      className="py-5 border-b"
      style={{ background: '#FFFFFF', borderColor: '#F0EAE1' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Mobile: scroll horizontally so 5 items stay in one row.
            sm+: revert to wrapping flex centred */}
        <div className="flex items-center gap-8 lg:gap-12 overflow-x-auto scrollbar-none snap-x -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {ITEMS.map(({ icon, title, sub }, idx) => (
            <div key={idx} className="flex items-center gap-2.5 shrink-0 snap-start">
              <div className="text-[#7C4A2D]">{icon}</div>
              <div>
                <p className="text-[10px] font-sans tracking-widest uppercase text-[#0A0908] font-medium leading-tight whitespace-nowrap">
                  {title}
                </p>
                <p className="text-[10px] font-sans text-[#6B5E55] mt-0.5 leading-snug whitespace-nowrap">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
