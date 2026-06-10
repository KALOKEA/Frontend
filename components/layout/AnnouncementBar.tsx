'use client'

// Matches reference index.html announcement bar exactly:
// — ✦ sparkle separator (not bullet •)
// — No dismiss button — always visible like the reference HTML
// — Uppercase tracking text, continuous scroll, hover pauses

const MESSAGES = [
  'Free Shipping on Orders Above ₹999',
  'New Arrivals Every Friday',
  'Easy 7-Day Returns',
  'Ethically Sourced Fabrics',
  'COD Available Pan India',
]

export default function AnnouncementBar() {
  // Duplicate the track so the marquee loops seamlessly
  const track = [...MESSAGES, ...MESSAGES]

  return (
    <div
      className="relative bg-[#1A1612] text-[#FDFAF6] overflow-hidden select-none"
      style={{ height: 34 }}
    >
      {/* Marquee track — pauses on hover like reference script.js */}
      <div className="marquee-track absolute inset-0 flex items-center">
        {track.map((text, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="text-[10px] font-sans tracking-[0.28em] uppercase whitespace-nowrap"
              style={{ color: '#E8DDD4' }}
            >
              {text}
            </span>
            {/* ✦ sparkle separator — matches reference HTML exactly */}
            <span
              className="mx-8 shrink-0 text-[#7C4A2D]"
              style={{ fontSize: 10, lineHeight: 1 }}
              aria-hidden="true"
            >
              ✦
            </span>
          </span>
        ))}
      </div>

      {/* Left + right edge fade masks */}
      <div
        className="absolute inset-y-0 left-0 w-16 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #1A1612, transparent)' }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #1A1612, transparent)' }}
      />
    </div>
  )
}
