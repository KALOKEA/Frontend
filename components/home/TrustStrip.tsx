'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS } from '@/lib/api/homepageContent'

const ICONS = ['🚚', '↩', '🔒', '✦']

export default function TrustStrip() {
  const [c, setC] = useState(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then((d) => setC(d.cms)).catch(() => {})
  }, [])

  const items = [
    { icon: ICONS[0], title: c.trust_1_title, sub: c.trust_1_sub },
    { icon: ICONS[1], title: c.trust_2_title, sub: c.trust_2_sub },
    { icon: ICONS[2], title: c.trust_3_title, sub: c.trust_3_sub },
    { icon: ICONS[3], title: c.trust_4_title, sub: c.trust_4_sub },
  ]

  return (
    <section className="border-y border-[#e8e4e0] bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y divide-x-0 md:divide-y-0 md:divide-x divide-[#e8e4e0]">
          {items.map((item, idx) => (
            <div
              key={item.title}
              className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-6 py-3.5 sm:py-5 ${
                idx % 2 === 0 ? 'border-r border-[#e8e4e0] md:border-r-0' : ''
              }`}
            >
              <span className="text-xl sm:text-2xl shrink-0">{item.icon}</span>
              <div className="min-w-0">
                <p className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] font-medium leading-tight">
                  {item.title}
                </p>
                <p className="text-[10px] sm:text-[11px] font-sans text-[#6b6b6b] mt-0.5 leading-tight">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
