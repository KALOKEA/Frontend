'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

const DEFAULT_MESSAGES: string[] = JSON.parse(HERO_DEFAULTS.announcement_items)

export default function AnnouncementBar() {
  const [messages, setMessages] = useState<string[]>(DEFAULT_MESSAGES)

  useEffect(() => {
    getHomepageData()
      .then(d => {
        try {
          const parsed: string[] = JSON.parse(d.cms.announcement_items || '')
          if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
        } catch { /* keep defaults */ }
      })
      .catch(() => {})
  }, [])

  // Duplicate for seamless marquee loop
  const items = [...messages, ...messages]

  return (
    // Outer div is readable by screen readers via aria-label; inner animated
    // track is aria-hidden to avoid repeating text twice for AT users.
    <div
      style={{ background: '#1E1208', padding: '10px 0', overflow: 'hidden' }}
      aria-label={messages.join(' · ')}
    >
      <div
        aria-hidden="true"
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
            {text}{' '}
            <span style={{ color: '#C49070', display: 'inline-flex', alignItems: 'center' }}>
              <svg width="6" height="6" viewBox="0 0 6 6" fill="#C49070">
                <circle cx="3" cy="3" r="3" />
              </svg>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
