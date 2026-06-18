'use client'
// Matches reference .why section exactly:
// — padding:80px 0; background:var(--white)=#FFFFFF (NOT #FDFAF6)
// — section header CENTERED: justify-content:center;text-align:center;flex-direction:column;gap:8px
// — section-label: .72rem weight:600 tracking:.2em uppercase color:#7C4A2D
// — section-title: serif clamp(2rem,3.5vw,3rem) weight:400 lineHeight:1.15 color:#0A0806
// — why-grid: grid repeat(4,1fr) gap:24px
// — why-card: padding:32px 24px; background:#FFFFFF; border-radius:6px; text-align:center
//             transition:box-shadow .3s; hover:box-shadow:var(--shadow-lg)
//             NO border — border is NOT in reference
// — why-icon: width:52px; height:52px; background:var(--brown-pale)=#F4EAE2; border-radius:50%;
//             display:flex; align-items:center; justify-content:center; margin:0 auto 20px
//             svg: width:24px; height:24px; stroke:#7C4A2D; fill:none; stroke-width:1.6
//             NO hover color change on icon
// — h3: serif 1.15rem weight:500 margin-bottom:8px
// — p: .82rem color:var(--muted)=#7A6E68 lineHeight:1.65

const REASONS = [
  {
    title: 'Thoughtful Design',
    desc: 'Each silhouette is crafted by our in-house designers with the modern Indian woman in mind — versatile, flattering, and timeless.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  },
  {
    title: 'Quality Guaranteed',
    desc: 'We partner only with certified fabric mills and ethical manufacturers. Every piece passes our 12-point quality check before dispatch.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  },
  {
    title: 'Fast Delivery',
    desc: 'Metro cities receive orders within 2–3 days. Pan India delivery in 5–7 days. Real-time ShipRocket tracking at every step.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>,
  },
  {
    title: 'Hassle-Free Returns',
    desc: 'Changed your mind? No problem. We offer a 7-day return window with free pickup — no questions asked, no drama.',
    svg: <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
  },
]

export default function WhyKalokea() {
  return (
    <section className="k-section-py" style={{ background: '#FFFFFF' }}>
      <div className="k-container">

        {/* Header — CENTERED matching reference inline style */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: '.72rem',
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: '#7C4A2D',
              display: 'block',
            }}
          >
            Our Promise
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#0A0806',
            }}
          >
            Why <em style={{ fontStyle: 'italic', fontWeight: 300 }}>KALOKEA</em>
          </h2>
        </div>

        {/* Cards grid — why-grid: repeat(4,1fr) gap:24px */}
        <div className="k-why-grid">
          {REASONS.map(({ title, desc, svg }) => (
            <div
              key={title}
              className="reveal why-card"
              style={{
                padding: '32px 24px',
                background: '#FFFFFF',
                borderRadius: 6,
                textAlign: 'center',
                transition: 'box-shadow .3s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 40px rgba(10,8,6,.14)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
            >
              {/* Icon circle — why-icon (decorative, h3 below names the feature) */}
              <div
                aria-hidden="true"
                style={{
                  width: 52,
                  height: 52,
                  background: '#F4EAE2',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}
              >
                {svg}
              </div>

              <h3
                className="font-serif"
                style={{ fontSize: '1.15rem', fontWeight: 500, marginBottom: 8, color: '#0A0806' }}
              >
                {title}
              </h3>
              <p style={{ fontSize: '.82rem', color: '#7A6E68', lineHeight: 1.65 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
