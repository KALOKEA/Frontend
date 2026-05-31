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
      {open && <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-[320px] bg-white z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#e8e4e0]">
          <span className="font-serif text-xl tracking-widest text-[#0a0a0a]">KALOKEA</span>
          <button onClick={onClose} className="text-2xl text-[#6b6b6b] hover:text-[#0a0a0a] leading-none">×</button>
        </div>
        <nav className="px-6 py-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className={`block py-3 text-sm font-sans tracking-widest uppercase border-b border-[#f4f2ef] text-[#0a0a0a] hover:text-[#c8a4a5] transition-colors ${link.className || ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="px-6 pt-4 flex flex-col gap-3">
          <Link href="/account" onClick={onClose} className="flex items-center gap-3 text-sm font-sans text-[#6b6b6b] hover:text-[#0a0a0a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            My Account
          </Link>
          <Link href="/account/wishlist" onClick={onClose} className="flex items-center gap-3 text-sm font-sans text-[#6b6b6b] hover:text-[#0a0a0a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Wishlist
          </Link>
        </div>
      </div>
    </>
  )
}
