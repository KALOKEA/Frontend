'use client'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Footer from './Footer'

const HIDDEN_PATHS = ['/checkout', '/checkout/']

interface FooterSettings {
  footer_instagram_url: string
  footer_facebook_url:  string
  footer_pinterest_url: string
  seller_gstin:         string
}

const FALLBACK: FooterSettings = {
  footer_instagram_url: 'https://www.instagram.com/kalokea.in',
  footer_facebook_url:  'https://www.facebook.com/kalokea.in',
  footer_pinterest_url: 'https://www.pinterest.com/kalokea',
  seller_gstin:         '',
}

const API = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-73aa.up.railway.app'

export default function FooterWrapper() {
  const pathname = usePathname()
  const hide = HIDDEN_PATHS.some(p => pathname === p || pathname.startsWith('/checkout/'))
  const [settings, setSettings] = useState<FooterSettings>(FALLBACK)

  useEffect(() => {
    fetch(`${API}/settings/public`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setSettings({ ...FALLBACK, ...d }) })
      .catch(() => {/* keep fallback */})
  }, [])

  if (hide) return null
  return (
    <Footer
      instagramUrl={settings.footer_instagram_url}
      facebookUrl={settings.footer_facebook_url}
      pinterestUrl={settings.footer_pinterest_url}
      gstin={settings.seller_gstin}
    />
  )
}
