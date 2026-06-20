'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import {
  siteContentApi,
  type FooterLink,
  FOOTER_HELP_DEFAULT,
  FOOTER_COMPANY_DEFAULT, FOOTER_LEGAL_DEFAULT,
} from '@/lib/api/siteContent'
import { BASE_URL } from '@/lib/api/client'

const HIDDEN_PATHS = ['/checkout', '/checkout/']

interface FooterSettings {
  footer_instagram_url: string
  footer_facebook_url:  string
  footer_pinterest_url: string
  seller_gstin:         string
}

const SETTINGS_FALLBACK: FooterSettings = {
  footer_instagram_url: 'https://www.instagram.com/kalokea.fashion',
  footer_facebook_url:  'https://www.facebook.com/kalokea.in',
  footer_pinterest_url: 'https://www.pinterest.com/kalokea',
  seller_gstin:         '',
}

interface ColState {
  helpCol:    FooterLink[]
  companyCol: FooterLink[]
  legalLinks: FooterLink[]
  copyright:  string
}

const COL_FALLBACK: ColState = {
  helpCol:    FOOTER_HELP_DEFAULT,
  companyCol: FOOTER_COMPANY_DEFAULT,
  legalLinks: FOOTER_LEGAL_DEFAULT,
  copyright:  'KALOKEA. All rights reserved.',
}

export default function FooterWrapper() {
  const pathname = usePathname()
  const hide = HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith('/checkout/'))
  const [settings, setSettings] = useState<FooterSettings>(SETTINGS_FALLBACK)
  const [cols, setCols]         = useState<ColState>(COL_FALLBACK)

  useEffect(() => {
    // Fetch social links / GSTIN from settings API
    fetch(`${BASE_URL}/settings/public`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setSettings({ ...SETTINGS_FALLBACK, ...(d?.data ?? d) }) })
      .catch(() => {/* keep fallback */})

    // Fetch footer column links from site_content API
    siteContentApi.getParsed()
      .then(d => {
        setCols({
          helpCol:    d.footer_help_col,
          companyCol: d.footer_company_col,
          legalLinks: d.footer_legal_links,
          copyright:  d.footer_copyright,
        })
      })
      .catch(() => {/* keep fallback */})
  }, [])

  if (hide) return null
  return (
    <Footer
      instagramUrl={settings.footer_instagram_url}
      facebookUrl={settings.footer_facebook_url}
      pinterestUrl={settings.footer_pinterest_url}
      gstin={settings.seller_gstin}
      helpCol={cols.helpCol}
      companyCol={cols.companyCol}
      legalLinks={cols.legalLinks}
      copyright={cols.copyright}
    />
  )
}
