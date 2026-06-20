'use client'
import Link from 'next/link'
import type { FooterLink } from '@/lib/api/siteContent'
import {
  FOOTER_SHOP_DEFAULT, FOOTER_HELP_DEFAULT,
  FOOTER_COMPANY_DEFAULT, FOOTER_LEGAL_DEFAULT,
} from '@/lib/api/siteContent'

// Matches reference footer exactly:
// — background:#1E1208 (var(--dark)); color:rgba(255,255,255,.6)
// — footer-top: max-width:1380; padding:64px 52px 48px; grid 1.6fr 1fr 1fr 1fr; gap:48px
// — footer-brand .logo: serif 1.6rem weight:600 color:#fff tracking:.12em margin-bottom:16px
// — footer-brand p: .82rem lineHeight:1.7 max-width:260px
// — footer-social: display:flex; gap:12px; margin-top:24px
// — social-btn: 36×36 border-radius:50% border:1px solid rgba(255,255,255,.15)
//               hover:background:#7C4A2D border-color:#7C4A2D
//               svg: 15×15 fill:rgba(255,255,255,.6) NOT stroke
// — footer-col h4: .72rem weight:700 tracking:.18em uppercase color:rgba(255,255,255,.5) mb:20px
// — footer-col li: .84rem cursor:pointer transition:color; hover:color:#fff
// — footer-bottom: border-top:1px solid rgba(255,255,255,.07); padding:20px 52px;
//                  display:flex; justify-content:space-between; flex-wrap:wrap; gap:12px; font-size:.76rem
// — footer-legal: display:flex; gap:20px; a:hover color:#fff
// — footer-pay: display:flex; gap:8px
// — pay-chip: padding:4px 10px; bg:rgba(255,255,255,.08); border-radius:4px; .68rem; weight:600; color:rgba(255,255,255,.5)
// — Text chips (NOT SVG icons): Razorpay, UPI, Cards, COD

interface FooterProps {
  instagramUrl?: string
  facebookUrl?:  string
  pinterestUrl?: string
  gstin?:        string
  // Column data (loaded from site_content via FooterWrapper)
  shopCol?:     FooterLink[]
  helpCol?:     FooterLink[]
  companyCol?:  FooterLink[]
  legalLinks?:  FooterLink[]
  copyright?:   string
}

export default function Footer({
  instagramUrl = 'https://www.instagram.com/kalokea.fashion',
  facebookUrl  = 'https://www.facebook.com/kalokea.fashion',
  pinterestUrl = 'https://www.pinterest.com/kalokea',
  gstin        = '',
  shopCol      = FOOTER_SHOP_DEFAULT,
  helpCol      = FOOTER_HELP_DEFAULT,
  companyCol   = FOOTER_COMPANY_DEFAULT,
  legalLinks   = FOOTER_LEGAL_DEFAULT,
  copyright    = 'KALOKEA. All rights reserved.',
}: FooterProps) {
  const socialBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    borderRadius: '50%',
    border: '1px solid rgba(255,255,255,.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all .2s',
    textDecoration: 'none',
  }

  const colLinkStyle: React.CSSProperties = {
    fontSize: '.84rem',
    color: 'rgba(255,255,255,.6)',
    transition: 'color .2s',
    textDecoration: 'none',
  }

  function renderCol(heading: string, links: FooterLink[]) {
    return (
      <div>
        <h4 style={{ fontSize: '.72rem', fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 20 }}>
          {heading}
        </h4>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
          {links.map(({ label, href }) => (
            <li key={`${heading}-${href}-${label}`}>
              <Link
                href={href}
                style={colLinkStyle}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.6)' }}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <footer style={{ background: '#1E1208', color: 'rgba(255,255,255,.6)' }}>

      {/* ── Footer top ── */}
      <div className="k-footer-grid">
        {/* Brand col */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <Link href="/" aria-label="Kalokea Home" style={{ display: 'inline-block', marginBottom: 16, textDecoration: 'none' }}>
            <img
              src="/kalokea-logo.png"
              alt="Kalokea"
              style={{ height: 72, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }}
            />
          </Link>
          <p style={{ fontSize: '.82rem', lineHeight: 1.7, maxWidth: 260, color: 'rgba(255,255,255,.6)' }}>
            Premium women&apos;s fashion rooted in Indian craftsmanship and global sensibility. Dressed for every chapter of your story.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <a
              href={instagramUrl} target="_blank" rel="noopener noreferrer"
              aria-label="Instagram"
              style={socialBtnStyle}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#7C4A2D'; el.style.borderColor = '#7C4A2D' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,.15)' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: 'rgba(255,255,255,.6)' }} aria-hidden="true">
                <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
                <circle cx="12" cy="12" r="4.5" fill="none" stroke="rgba(255,255,255,.6)" strokeWidth="1.5"/>
                <circle cx="17.5" cy="6.5" r="1" fill="rgba(255,255,255,.6)"/>
              </svg>
            </a>
            <a
              href={facebookUrl} target="_blank" rel="noopener noreferrer"
              aria-label="Facebook"
              style={socialBtnStyle}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#7C4A2D'; el.style.borderColor = '#7C4A2D' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,.15)' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: 'rgba(255,255,255,.6)' }} aria-hidden="true">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a
              href={pinterestUrl} target="_blank" rel="noopener noreferrer"
              aria-label="Pinterest"
              style={socialBtnStyle}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = '#7C4A2D'; el.style.borderColor = '#7C4A2D' }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'transparent'; el.style.borderColor = 'rgba(255,255,255,.15)' }}
            >
              <svg viewBox="0 0 24 24" style={{ width: 15, height: 15, fill: 'rgba(255,255,255,.6)' }} aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.771 0 3.135-1.867 3.135-4.563 0-2.385-1.715-4.052-4.163-4.052-2.836 0-4.5 2.127-4.5 4.326 0 .856.33 1.774.741 2.276a.3.3 0 0 1 .069.285c-.076.313-.244.995-.277 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </a>
          </div>
        </div>

        {renderCol('Shop',    shopCol)}
        {renderCol('Help',    helpCol)}
        {renderCol('Company', companyCol)}
      </div>

      {/* GSTIN row */}
      {gstin && (
        <div style={{ maxWidth: 1380, margin: '0 auto', paddingLeft: 'clamp(20px, 4vw, 52px)', paddingRight: 'clamp(20px, 4vw, 52px)', paddingTop: 16, paddingBottom: 8, borderTop: '1px solid rgba(255,255,255,.07)' }}>
          <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.4)' }}>
            Kalokea Fashion Pvt. Ltd. &nbsp;|&nbsp; GSTIN: {gstin} &nbsp;|&nbsp; Registered in Gujarat, India
          </p>
        </div>
      )}

      {/* ── Footer bottom ── */}
      <div className="k-footer-bottom">
        <span style={{ color: 'rgba(255,255,255,.6)' }}>
          &copy; {new Date().getFullYear()} {copyright}
        </span>

        {/* Legal links */}
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {legalLinks.map(({ label, href }) => (
            <Link
              key={`${href}-${label}`}
              href={href}
              style={{ color: 'rgba(255,255,255,.6)', transition: 'color .2s', textDecoration: 'none', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,.6)' }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Pay chips — text chips matching reference exactly */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }} aria-label="Accepted payment methods" role="list">
          {['Razorpay', 'UPI', 'Cards', 'COD'].map(chip => (
            <span
              key={chip}
              role="listitem"
              style={{
                padding: '4px 10px',
                background: 'rgba(255,255,255,.08)',
                borderRadius: 4,
                fontSize: '.68rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,.5)',
              }}
            >
              {chip}
            </span>
          ))}
        </div>
      </div>

    </footer>
  )
}
