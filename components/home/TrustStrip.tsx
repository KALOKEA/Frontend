export default function TrustStrip() {
  const items = [
    { icon: '🚚', title: 'Free Delivery', sub: 'On orders above ₹999' },
    { icon: '↩', title: 'Easy Returns', sub: '7-day hassle-free returns' },
    { icon: '🔒', title: 'Secure Payments', sub: 'Razorpay 256-bit encrypted' },
    { icon: '✦', title: 'Made in India', sub: 'Proudly designed & sourced' },
  ]

  return (
    <section className="border-y border-[#e8e4e0] bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e8e4e0]">
          {items.map(item => (
            <div key={item.title} className="flex items-center gap-3 px-6 py-5">
              <span className="text-2xl shrink-0">{item.icon}</span>
              <div>
                <p className="text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] font-medium">
                  {item.title}
                </p>
                <p className="text-[11px] font-sans text-[#6b6b6b] mt-0.5">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
