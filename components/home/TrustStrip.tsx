'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

const TruckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" rx="1"/>
    <path d="M16 8h4l3 5v4h-7V8z"/>
    <circle cx="5.5" cy="18.5" r="2.5"/>
    <circle cx="18.5" cy="18.5" r="2.5"/>
  </svg>
)

const ReturnIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
)

const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const SparkleIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5z"/>
  </svg>
)

const SVGICONS = [TruckIcon, ReturnIcon, LockIcon, SparkleIcon]

export default function TrustStrip() {
  const [c, setC] = useState(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then((d) => setC(d.cms)).catch(() => {})
  }, [])

  const items = [
    { Icon: SVGICONS[0], title: c.trust_1_title, sub: c.trust_1_sub },
    { Icon: SVGICONS[1], title: c.trust_2_title, sub: c.trust_2_sub },
    { Icon: SVGICONS[2], title: c.trust_3_title, sub: c.trust_3_sub },
    { Icon: SVGICONS[3], title: c.trust_4_title, sub: c.trust_4_sub },
  ]

  return (
    <section className="border-y border-[#E0D4C4] bg-[#FDFAF6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-x-0 md:divide-y-0 md:divide-x divide-[#E0D4C4]">
          {items.map(({ Icon, title, sub }, idx) => (
            <div
              key={title}
              className={`group flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 sm:py-5 transition-colors hover:bg-[#F2EAE0] ${
                idx % 2 === 0 ? 'border-r border-[#E0D4C4] md:border-r-0' : ''
              }`}
            >
              <div className="shrink-0 text-[#7C4A2D] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#5C3520]">
                <Icon />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#0A0908] font-medium leading-tight">
                  {title}
                </p>
                <p className="text-[10px] sm:text-[11px] font-sans text-[#6B5E55] mt-0.5 leading-snug">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
