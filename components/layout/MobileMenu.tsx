'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/shop/new-arrivals/' },
  { label: 'Dresses',      href: '/shop/dresses/' },
  { label: 'Tops',         href: '/shop/tops/' },
  { label: 'Bottoms',      href: '/shop/bottoms/' },
  { label: 'Shoes',        href: '/shop/shoes/' },
  { label: 'Bags',         href: '/shop/bags/' },
  { label: 'Accessories',  href: '/shop/accessories/' },
  { label: 'Sale',         href: '/shop/sale/', accent: true },
  { label: 'Everything',   href: '/shop/' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  const closeRef        = useRef<HTMLButtonElement>(null)
  const dialogRef       = useRef<HTMLDivElement>(null)
  const previousFocus   = useRef<HTMLElement | null>(null)

  // Lock scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Save trigger focus, move focus into drawer on open; restore on close (WCAG 2.4.3)
  useEffect(() => {
    if (open) {
      previousFocus.current = document.activeElement as HTMLElement
      closeRef.current?.focus()
    } else {
      previousFocus.current?.focus()
      previousFocus.current = null
    }
  }, [open])

  // Escape closes menu (WCAG 2.1.2 No Keyboard Trap)
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  // Tab focus trap: keep focus cycling within the dialog (WCAG 2.1.2)
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const dialog = dialogRef.current
      if (!dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute('disabled'))
      if (focusable.length === 0) return
      const first = focusable[0]
      const last  = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-[#0A0908]/40 z-40" onClick={onClose} aria-hidden="true" />
      )}

      <div
        id="mobile-menu"
        ref={dialogRef}
        className={`fixed top-0 right-0 h-full w-[82vw] max-w-[320px] bg-[#FDFAF6] z-50 transform transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
        // Hidden from AT when closed (prevents focus from reaching links via Tab when drawer is off-screen)
        inert={!open ? true : undefined}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0D4C4] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/kalokea-logo.png" alt="Kalokea" style={{ height: 58, width: 'auto', display: 'block' }} />
          <button
            ref={closeRef}
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-[#6B5E55] hover:text-[#0A0908] transition-colors"
            aria-label="Close menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Nav list */}
        <nav className="flex-1 overflow-y-auto px-5 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center py-3.5 text-[10px] font-sans tracking-[0.22em] uppercase border-b border-[#F2EAE0] min-h-[44px] transition-colors ${
                link.accent ? 'text-[#7C4A2D]' : 'text-[#0A0908] hover:text-[#7C4A2D]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer links */}
        <div className="px-5 py-4 border-t border-[#E0D4C4] flex flex-col gap-1 shrink-0">
          <Link
            href="/account/"
            onClick={onClose}
            className="flex items-center gap-3 min-h-[44px] text-sm font-sans text-[#6B5E55] hover:text-[#0A0908] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            My Account
          </Link>
          <Link
            href="/account/wishlist/"
            onClick={onClose}
            className="flex items-center gap-3 min-h-[44px] text-sm font-sans text-[#6B5E55] hover:text-[#0A0908] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            Wishlist
          </Link>
        </div>
      </div>
    </>
  )
}
