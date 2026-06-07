'use client'
import Link from 'next/link'
import { useEffect } from 'react'

const NAV_LINKS = [
  { label: 'New Arrivals', href: '/shop?category=new-arrivals' },
  { label: 'Dresses', href: '/shop?category=dresses' },
  { label: 'Tops', href: '/shop?category=tops' },
  { label: 'Bottoms', href: '/shop?category=bottoms' },
  { label: 'Shoes', href: '/shop?category=shoes' },
  { label: 'Bags', href: '/shop?category=bags' },
  { label: 'Accessories', href: '/shop?category=accessories' },
  { label: 'Sale', href: '/shop?category=sale', className: 'text-[#c8a4a5]' },
  { label: 'Everything', href: '/shop' },
]

interface MobileMenuProps {
  open: boolean
  onClose: () => void
}

export default function MobileMenu({ open, onClose }: MobileMenuProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      {/* Backdrop */}
      {open && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}

      {/* Drawer — max 80vw so it never fills the entire screen on narrow phones */}
      <div
        className={`fixed top-0 left-0 h-full w-[80vw] max-w-[320px] bg-white z-50 transform transition-transform duration-300 flex flex-col ${open ? 'translate-x-0' : '-translate-x-full'}`}
        aria-modal="true"
        role="dialog"
        aria-label="Navigation menu"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e8e4e0] shrink-0">
          <span className="font-serif text-xl tracking-widest text-[#0a0a0a]">KALOKEA</span>
          {/* 44×44 close button */}
          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] text-2xl leading-none"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* Scrollable nav list */}
        <nav className="flex-1 overflow-y-auto px-5 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`flex items-center py-3.5 text-sm font-sans tracking-widest uppercase border-b border-[#f4f2ef] hover:text-[#c8a4a5] transition-colors min-h-[44px] ${link.className || 'text-[#0a0a0a]'}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Footer links */}
        <div className="px-5 py-4 border-t border-[#f4f2ef] flex flex-col gap-1 shrink-0">
          <Link
            href="/account"
            onClick={onClose}
            className="flex items-center gap-3 min-h-[44px] text-sm font-sans text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Account
          </Link>
          <Link
            href="/account/wishlist"
            onClick={onClose}
            className="flex items-center gap-3 min-h-[44px] text-sm font-sans text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Wishlist
          </Link>
        </div>
      </div>
    </>
  )
}
