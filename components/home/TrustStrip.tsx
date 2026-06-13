'use client'
import { useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

export default function TrustStrip() {
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then(d => setCms(d.cms)).catch(() => {})
  }, [])

  const items = [
    { title: cms.trust_1_title, sub: cms.trust_1_sub, icon: TruckIcon },
    { title: cms.trust_2_title, sub: cms.trust_2_sub, icon: ReturnIcon },
    { title: cms.trust_3_title, sub: cms.trust_3_sub, icon: ShieldIcon },
    { title: cms.trust_4_title, sub: cms.trust_4_sub, icon: LeafIcon },
  ]

  return (
    <section className="w-full bg-[#f5f0eb] border-y border-[#e8e4e0] overflow-x-auto">
      <div className="flex items-stretch min-w-max md:min-w-0 md:grid md:grid-cols-4 divide-x divide-[#e8e4e0]">
        {items.map(({ title, sub, icon: Icon }, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-6 py-4 min-w-[220px] md:min-w-0 md:justify-center"
          >
            <Icon />
            <span className="text-sm leading-tight">
              <strong className="font-semibold text-[#0a0a0a]">{title}</strong>
              {sub ? <span className="text-[#6b6b6b]"> — {sub}</span> : null}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

function TruckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}>
      <rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  )
}

function ReturnIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}>
      <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.3"/>
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  )
}

function LeafIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{flexShrink:0}}>
      <path d="M17 8C8 10 5.9 16.17 3.82 19.44A5 5 0 0 0 5 21c2.5-1 5-4 6-6 1.32 2.67 3 5 5 6a5 5 0 0 0 1-8z"/>
    </svg>
  )
}
