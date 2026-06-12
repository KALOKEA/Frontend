'use client'

// Matches reference index.html / styles.css exactly:
// background:#1E1208 (var(--dark)), padding:10px 0
// marquee-item: display:flex; gap:24px; padding:0 24px; font-size:.7rem; font-weight:600;
//               letter-spacing:.2em; uppercase; color:rgba(255,255,255,.7)
// span (✦): color:var(--brown-lt)=#C49070
// animation: marquee 28s linear infinite, pauses on hover
// No fade masks, no dismiss button

const MESSAGES = [
  'Free Shipping on Orders Above ₹999',
  'New Arrivals Every Friday',
  'Easy 7-Day Returns',
  'Ethically Sourced Fabrics',
  'COD Available Pan India',
]

export default function AnnouncementBar() {
  // Duplicate for seamless loop (10 items total — matches reference)
  const items = [...MESSAGES, ...MESSAGES]

  return (
    <div style={{ background: '#1E1208', padding: '10px 0', overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          animation: 'marquee 28s linear infinite',
        }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'paused')}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.animationPlayState = 'running')}
      >
        {items.map((text, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 24,
              padding: '0 24px',
              fontSize: '.7rem',
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,.7)',
              whiteSpace: 'nowrap',
            }}
          >
            {text} <span style={{ color: '#C49070', display: 'inline-flex', alignItems: 'center' }}><svg width='6' height='6' viewBox='0 0 6 6' fill='#C49070'><circle cx='3' cy='3' r='3'/></svg></span>
          </div>
        ))}
      </div>
    </div>
  )
}
