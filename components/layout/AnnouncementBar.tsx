'use client'
import { useState } from 'react'

const MESSAGES = [
  { text: 'Free Shipping on Orders Above ₹999', highlight: '₹999' },
  { text: 'New Arrivals Every Friday', highlight: 'Every Friday' },
  { text: 'Easy 15-Day Returns', highlight: '15-Day Returns' },
  { text: 'Ethically Sourced Fabrics', highlight: 'Ethically Sourced' },
  { text: 'COD Available Pan India', highlight: 'COD Available' },
]

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true)

  if (!visible) return null

  const track = [...MESSAGES, ...MESSAGES]

  return (
    <div className="relative bg-[#1A1612] text-[#FDFAF6] overflow-hidden" style={{ height: 34 }}>
      {/* Marquee track */}
      <div className="marquee-track absolute inset-0 flex items-center">
        {track.map((m, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-[10px] font-sans tracking-[0.22em] uppercase whitespace-nowrap" style={{ paddingRight: 0 }}>
              {m.text}
            </span>
            {/* Separator dot */}
            <span className="mx-10 inline-block w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#7C4A2D' }} />
          </span>
        ))}
      </div>

      {/* Left + right fade masks */}
      <div className="absolute inset-y-0 left-0 w-12 pointer-events-none" style={{ background: 'linear-gradient(to right, #1A1612, transparent)' }} />
      <div className="absolute inset-y-0 right-8 w-12 pointer-events-none" style={{ background: 'linear-gradient(to left, #1A1612, transparent)' }} />

      {/* Dismiss */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-0 top-0 bottom-0 w-8 flex items-center justify-center text-[#6B5E55] hover:text-[#FDFAF6] transition-colors z-10 bg-[#1A1612]"
        aria-label="Dismiss"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>
  )
}
