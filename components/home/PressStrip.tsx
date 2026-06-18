'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

interface PressLogo {
  name: string
  url: string
}

const DEFAULT_LOGOS: PressLogo[] = JSON.parse(HERO_DEFAULTS.press_logos)

export default function PressStrip() {
  const [logos, setLogos] = useState<PressLogo[]>(DEFAULT_LOGOS)
  const [heading, setHeading] = useState<string>(HERO_DEFAULTS.press_heading)

  useEffect(() => {
    getHomepageData()
      .then(d => {
        if (d.cms.press_heading) setHeading(d.cms.press_heading)
        try {
          const parsed = JSON.parse(d.cms.press_logos || '')
          if (Array.isArray(parsed) && parsed.length > 0) setLogos(parsed)
        } catch { /* keep defaults */ }
      })
      .catch(() => {})
  }, [])

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
          {heading}
        </span>

        {/* Logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          {logos.filter(l => l.name).map(({ name, url }, i) => (
            <a
              key={`${i}-${name}`}
              href={url || '#'}
              target={url ? '_blank' : undefined}
              rel="noopener noreferrer"
              aria-label={`${name}${url ? ' — opens in new tab' : ''}`}
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
