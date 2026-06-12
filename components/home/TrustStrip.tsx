'use client'
import { Fragment } from 'react'

// Trust strip — horizontal on all screen sizes.
// On mobile: single row, horizontally scrollable (no wrapping).
// On desktop: centered row with equal spacing.

const ITEMS = [
  {
    text: 'Free Shipping ₹999+',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M1 3h15l3 3v11H1z"/>
        <path d="M16 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
        <path d="M5.5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
      </svg>
    ),
  },
  {
    text: 'Pan India Delivery',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    text: '7-Day Easy Returns',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    ),
  },
  {
    text: 'Secure Checkout',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </svg>
    ),
  },
  {
    text: 'COD Available',
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
]

// Separator dot between items
const Dot = () => (
  <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#D4B8B0', flexShrink: 0, display: 'inline-block' }} />
)

export default function TrustStrip() {
  return (
    <div style={{ background: '#FFFFFF', borderBottom: '1px solid #F0EAE1', overflow: 'hidden' }}>
      {/* Scrollable row — no wrapping on any screen size */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollbarWidth: 'none', // Firefox
          msOverflowStyle: 'none', // IE/Edge
          WebkitOverflowScrolling: 'touch',
          padding: '14px 20px',
          gap: 0,
          justifyContent: 'safe center', // centers on wide screens, scrolls on narrow
          whiteSpace: 'nowrap',
        }}
        className="trust-strip-inner"
      >
        {ITEMS.map(({ text, svg }, i) => (
          <Fragment key={text}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: '.73rem',
                fontWeight: 500,
                color: '#7A6E68',
                letterSpacing: '0.01em',
                flexShrink: 0,
                padding: '0 4px',
              }}
            >
              {svg}
              {text}
            </div>
            {i < ITEMS.length - 1 && (
              <span style={{ margin: '0 14px', width: 3, height: 3, borderRadius: '50%', background: '#D4B8B0', flexShrink: 0, display: 'inline-block' }} />
            )}
          </Fragment>
        ))}
      </div>

      {/* Hide scrollbar in WebKit */}
      <style>{`.trust-strip-inner::-webkit-scrollbar { display: none; }`}</style>
    </div>
  )
}
