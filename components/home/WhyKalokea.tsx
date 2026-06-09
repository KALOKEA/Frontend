const REASONS = [
  {
    title: 'Thoughtful Design',
    desc: 'Each silhouette is crafted by our in-house designers with the modern Indian woman in mind — versatile, flattering, and timeless.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
  },
  {
    title: 'Quality Guaranteed',
    desc: 'We partner only with certified fabric mills and ethical manufacturers. Every piece passes our 12-point quality check before dispatch.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Fast Pan-India Delivery',
    desc: 'Metro cities receive orders within 2–3 days. Pan India delivery in 5–7 days. Real-time ShipRocket tracking at every step.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="1"/>
        <path d="M16 8h4l3 5v4h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
  },
  {
    title: 'Hassle-Free Returns',
    desc: 'Changed your mind? No problem. We offer a 7-day return window with free pickup — no questions asked, no drama.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
]

export default function WhyKalokea() {
  return (
    <section className="py-20 bg-[#FDFAF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="eyebrow-center mb-4">Our Promise</div>
          <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
            Why <em className="italic" style={{ color: '#7C4A2D' }}>KALOKEA</em>
          </h2>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {REASONS.map(({ title, desc, icon }) => (
            <div
              key={title}
              className="group bg-[#FDFAF6] border border-[#E0D4C4] px-6 py-8 text-center transition-all duration-300 hover:shadow-[0_8px_40px_rgba(10,8,6,0.10)] hover:border-[#C4A882]"
            >
              {/* Icon circle */}
              <div className="w-12 h-12 rounded-full bg-[#F2EAE0] flex items-center justify-center mx-auto mb-5 text-[#7C4A2D] transition-colors duration-300 group-hover:bg-[#7C4A2D] group-hover:text-white">
                {icon}
              </div>

              <h3 className="font-serif font-medium text-[#0A0908] text-[1.05rem] mb-3 leading-snug">
                {title}
              </h3>
              <p className="text-[13px] font-sans text-[#6B5E55] leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
