'use client'
import { Fragment, useEffect, useState } from 'react'
import { getHomepageData, HERO_DEFAULTS, type HomepageContent } from '@/lib/api/homepageContent'

// Trust strip — horizontal on all screen sizes.
// On mobile: single row, horizontally scrollable (no wrapping).
// On desktop: centered row with equal spacing.
// CMS keys: trust_1_title/sub … trust_4_title/sub

const SVGS = [
  // Delivery truck
  <svg key="truck" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path d="M1 3h15l3 3v11H1z"/><path d="M16 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/><path d="M5.5 16a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
  </svg>,
  // Globe
  <svg key="globe" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>,
  // Return arrow
  <svg key="return" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.3"/>
  </svg>,
  // Shield
  <svg key="shield" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>,
]

export default function TrustStrip() {
  const [cms, setCms] = useState<HomepageContent>(HERO_DEFAULTS)

  useEffect(() => {
    getHomepageData().then(d => setCms(d.cms)).catch(() => {})
  }, [])

  const items = [
    { title: cms.trust_1_title, sub: cms.trust_1_sub },
    { title: cms.trust_2_title, sub: cms.trust_2_sub },
    { title: cms.trust_3_title, sub: cms.trust_3_sub },
    { title: cms.trust_4_title, sub: cms.trust_4_sub },
  ]

  return (
    <div className="k-trust-wrap">
      <div className="k-trust-inner">
        {items.map(({ title, sub }, i) => (
          <Fragment key={i}>
            {i > 0 && <div className="k-trust-divider" />}
            <div className="k-trust-item">
              {SVGS[i]}
              <span className="k-trust-text">
                <strong className="k-trust-bold">{title}</strong>
                {sub ? <> &mdash; {sub}</> : null}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  )
}
