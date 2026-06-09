'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import CartIcon from './CartIcon'
import MobileMenu from './MobileMenu'
import { useAuthStore } from '@/lib/store/useAuthStore'

const NAV_LEFT = [
  { label: 'New Arrivals', href: '/shop/new-arrivals/' },
  { label: 'Dresses',      href: '/shop/dresses/' },
  { label: 'Tops',         href: '/shop/tops/' },
  { label: 'Bottoms',      href: '/shop/bottoms/' },
]

const NAV_RIGHT = [
  { label: 'Shoes',        href: '/shop/shoes/' },
  { label: 'Bags',         href: '/shop/bags/' },
  { label: 'Accessories',  href: '/shop/accessories/' },
  { label: 'Sale',         href: '/shop/sale/', accent: true },
]

export default function Header() {
  const router = useRouter()
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn } = useAuthStore()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 6)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
    else setSearchQuery('')
  }, [searchOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setSearchOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setSearchOpen(false)
    router.push(`/shop?search=${encodeURIComponent(q)}`)
  }

  const navLinkStyle = (accent = false) =>
    `nav-link text-[9.5px] font-sans tracking-[0.22em] uppercase transition-colors pb-0.5 whitespace-nowrap ${
      accent
        ? 'text-[#7C4A2D] hover:text-[#9E6544]'
        : 'text-[#0A0908] hover:text-[#7C4A2D]'
    }`

  return (
    <>
      <header
        className={`sticky top-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'bg-[#FDFAF6]/96 backdrop-blur-md shadow-[0_2px_24px_rgba(26,22,18,0.08)]'
            : 'bg-[#FDFAF6] border-b border-[#E0D4C4]'
        }`}
      >
        {/* ── Desktop: center-logo split nav ─────────────────────────────── */}
        <div className="hidden md:grid max-w-[1440px] mx-auto px-8 lg:px-14" style={{ gridTemplateColumns: '1fr auto 1fr', height: 68, alignItems: 'center' }}>

          {/* Left nav */}
          <nav className="flex items-center gap-6 lg:gap-8">
            {NAV_LEFT.map(n => (
              <Link key={n.href} href={n.href} className={navLinkStyle()}>
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Centre logo */}
          <Link href="/" className="group flex flex-col items-center gap-0 px-8">
            <span className="font-serif text-[20px] lg:text-[22px] tracking-[0.42em] text-[#0A0908] uppercase leading-none select-none">
              KALOKEA
            </span>
            <span className="h-px bg-[#7C4A2D] w-0 group-hover:w-full transition-all duration-500 ease-out mt-1" />
          </Link>

          {/* Right nav + icons */}
          <nav className="flex items-center justify-end gap-6 lg:gap-8">
            {NAV_RIGHT.map(n => (
              <Link key={n.href} href={n.href} className={navLinkStyle(n.accent)}>
                {n.label}
              </Link>
            ))}

            {/* Divider */}
            <span className="w-px h-4 bg-[#E0D4C4]" />

            {/* Icons */}
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="w-9 h-9 flex items-center justify-center text-[#0A0908] hover:text-[#7C4A2D] transition-colors"
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link href={isLoggedIn ? '/account/wishlist' : '/login'} className="w-9 h-9 flex items-center justify-center text-[#0A0908] hover:text-[#7C4A2D] transition-colors" aria-label="Wishlist">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </Link>

            {/* Account */}
            <Link href={isLoggedIn ? '/account' : '/login'} className="w-9 h-9 flex items-center justify-center text-[#0A0908] hover:text-[#7C4A2D] transition-colors" aria-label="Account">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            <CartIcon />
          </nav>
        </div>

        {/* ── Mobile: logo center + hamburger left + cart right ───────────── */}
        <div className="md:hidden flex items-center justify-between px-4 h-[58px]">
          {/* Hamburger */}
          <button
            className="w-11 h-11 flex items-center justify-center text-[#0A0908] -ml-1"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          {/* Logo */}
          <Link href="/" className="font-serif text-[18px] tracking-[0.38em] text-[#0A0908] uppercase leading-none">
            KALOKEA
          </Link>

          {/* Cart */}
          <CartIcon />
        </div>
      </header>

      {/* ── Search overlay ────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0908]/55 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
          <div className="relative bg-[#FDFAF6] border-b border-[#E0D4C4] px-4 sm:px-8 py-5 shadow-float">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B5E55" strokeWidth="1.5" strokeLinecap="round" className="shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                ref={searchRef}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dresses, tops, bags…"
                className="flex-1 text-[15px] font-sans text-[#0A0908] placeholder-[#9B8F87] outline-none bg-transparent"
              />
              {searchQuery && (
                <button type="button" onClick={() => setSearchQuery('')} className="w-9 h-9 flex items-center justify-center text-[#9B8F87] hover:text-[#0A0908] text-xl leading-none">×</button>
              )}
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="btn-shimmer px-5 py-2.5 text-[9.5px] uppercase tracking-[0.22em] bg-[#0A0908] text-[#FDFAF6] hover:bg-[#1A1612] disabled:opacity-40 transition-colors shrink-0 relative overflow-hidden"
              >
                Search
              </button>
            </form>
            {/* Quick tags */}
            <div className="max-w-2xl mx-auto mt-3 flex flex-wrap gap-2 pl-7">
              {['Dresses', 'Tops', 'Sale', 'New Arrivals', 'Bags'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchOpen(false)
                    router.push(`/shop/${term.toLowerCase().replace(/ /g, '-')}/`)
                  }}
                  className="text-[9.5px] uppercase tracking-[0.2em] text-[#6B5E55] border border-[#E0D4C4] px-3 py-1.5 hover:border-[#7C4A2D] hover:text-[#7C4A2D] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
