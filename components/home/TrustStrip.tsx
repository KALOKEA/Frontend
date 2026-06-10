'use client'

// Matches reference .trust-bar exactly:
// — background:#FFFFFF; padding:20px 0; border-bottom:1px solid #F0EAE1
// — trust-inner: display:flex; justify-content:center; gap:48px; flex-wrap:wrap
// — trust-item: display:flex; align-items:center; gap:10px; font-size:.78rem; font-weight:500; color:#7A6E68
// — svg: width:20px; height:20px; stroke:#7C4A2D; fill:none; stroke-width:1.8
// — Single-line text labels matching reference HTML exactly

const ITEMS = [
  {
    text: 'Free Shipping ₹999+',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    ),
  },
  {
    text: 'Pan India Delivery',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
        <path d="M1 3h15l3 3v11H1z"/>
        <path d="M16 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
        <path d="M5.5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
      </svg>
    ),
  },
  {
    text: '7-Day Easy Returns',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
  {
    text: 'Secure Checkout',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    text: 'COD Available',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 20, height: 20, flexShrink: 0 }}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.27 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.18 3h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9a16 16 0 0 0 6.91 6.91l.27-.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
  },
]

export default function TrustStrip() {
  return (
    <div style={{ background: '#FFFFFF', padding: '20px 0', borderBottom: '1px solid #F0EAE1' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 48,
          flexWrap: 'wrap',
          padding: '0 52px',
        }}
      >
        {ITEMS.map(({ text, svg }) => (
          <div
            key={text}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              fontSize: '.78rem',
              fontWeight: 500,
              color: '#7A6E68',
            }}
          >
            {svg}
            {text}
          </div>
        ))}
      </div>
    </div>
  )
}
