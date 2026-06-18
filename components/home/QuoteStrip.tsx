'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

// Quote strip — CMS keys: quote_text, quote_author

export default function QuoteStrip() {
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then(d => setCms(d.cms)).catch(() => {})
  }, [])

  return (
    <div
      className="reveal"
      style={{
        padding: 'clamp(40px, 8vw, 80px) clamp(20px, 4vw, 52px)',
        textAlign: 'center',
        background: '#F9F6F2',
      }}
    >
      <p
        className="font-serif"
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 300,
          lineHeight: 1.4,
          color: '#0A0806',
          maxWidth: 780,
          margin: '0 auto',
        }}
      >
        <em style={{ color: '#7C4A2D', fontStyle: 'italic' }}>{cms.quote_text}</em>
      </p>
      {cms.quote_author && (
        <p
          style={{
            marginTop: 20,
            fontSize: '.8rem',
            fontWeight: 500,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: '#7A6E68',
          }}
        >
          {cms.quote_author}
        </p>
      )}
    </div>
  )
}
