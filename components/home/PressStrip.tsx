'use client'
import Link from 'next/link'

const LOGOS = [
  { name: 'Vogue India',      url: 'https://www.vogue.in/' },
  { name: 'Elle',             url: 'https://elle.in/' },
  { name: "Harper's Bazaar",  url: 'https://harpersbazaar.in/' },
  { name: 'Femina',           url: 'https://www.femina.in/' },
  { name: 'Grazia',           url: 'https://www.grazia.co.in/' },
]

export default function PressStrip() {
  return (
    <div
      style={{
        borderTop: '1px solid #F0EAE1',
        borderBottom: '1px solid #F0EAE1',
        background: '#FFFFFF',
        padding: '40px max(20px, min(52px, 4vw))',
      }}
    >
      <div
        style={{
          maxWidth: 1380,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          flexWrap: 'wrap',
        }}
      >
        {/* Label */}
        <span
          style={{
            fontSize: '.68rem',
            fontWeight: 700,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: '#B5A89E',
            whiteSpace: 'nowrap',
          }}
        >
          As Seen In
        </span>

        {/* Logos — real links to each magazine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          {LOGOS.map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name} — opens in new tab`}
              style={{
                fontFamily: 'var(--font-cormorant), serif',
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#B5A89E',
                letterSpacing: '.06em',
                textDecoration: 'none',
                transition: 'color .2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#7C4A2D' }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#B5A89E' }}
            >
              {name}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
