'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import CartIcon from './CartIcon'
import MobileMenu from './MobileMenu'
import { useAuthStore } from '@/lib/store/useAuthStore'

// Matches design reference: Shop, Dresses, Tops, Bottoms, Bags, About
const NAV_LINKS = [
  { label: 'Shop',    href: '/shop/' },
  { label: 'Dresses', href: '/shop/dresses/' },
  { label: 'Tops',    href: '/shop/tops/' },
  { label: 'Bottoms', href: '/shop/bottoms/' },
  { label: 'Bags',    href: '/shop/bags/' },
  { label: 'About',   href: '/about/' },
]

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const [scrolled, setScrolled]     = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const { isLoggedIn } = useAuthStore()

  // Transparent nav: only on home page when not scrolled (matches design reference)
  const isHome = pathname === '/'
  const isTransparent = isHome && !scrolled

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    handler() // set correct state immediately on mount (matches reference script.js)
    window.addEventListener('scroll', handler, { passive: true })
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
    router.push(`/shop/?search=${encodeURIComponent(q)}`)
  }

  // Nav link colour — matches .nav-links a / .nav-links a.light in design CSS
  const linkCls = isTransparent
    ? 'text-white/85 hover:text-white'
    : 'text-[#160F09] hover:text-[#7C4A2D]'

  // Icon button colour — matches .nav-btn svg / .nav-btn.light svg
  const iconCls = isTransparent
    ? 'text-white hover:bg-white/10'
    : 'text-[#0A0806] hover:bg-[#F0EAE1]'

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[900] transition-all duration-300 ${
          scrolled
            ? 'bg-white shadow-[0_2px_20px_rgba(10,8,6,0.08)]'
            : isTransparent
              ? 'bg-transparent'
              : 'bg-white shadow-[0_2px_20px_rgba(10,8,6,0.08)]'
        }`}
      >
        {/* ── Desktop: left-logo layout matching design reference ──────────── */}
        {/* nav-inner: display:flex; justify-content:space-between; gap:24px    */}
        <div
          className="hidden md:flex items-center justify-between gap-6 mx-auto"
          style={{ maxWidth: 1380, padding: '0 52px', height: 68 }}
        >
          {/* Logo — left-aligned (.nav-logo) */}
          <Link
            href="/"
            className={`font-serif font-semibold tracking-[0.12em] uppercase leading-none select-none shrink-0 transition-colors duration-300 ${
              isTransparent ? 'text-white' : 'text-[#0A0806]'
            }`}
            style={{ fontSize: '1.7rem' }}
          >
            KALOKEA
          </Link>

          {/* Nav links — center (.nav-links) */}
          <nav className="flex items-center gap-8">
            {NAV_LINKS.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-[0.82rem] font-medium tracking-[0.08em] uppercase transition-colors duration-200 ${linkCls}`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Actions — right (.nav-actions) */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${iconCls}`}
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href={isLoggedIn ? '/account/wishlist/' : '/login/'}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${iconCls}`}
              aria-label="Wishlist"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </Link>

            {/* Account */}
            <Link
              href={isLoggedIn ? '/account/' : '/login/'}
              className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${iconCls}`}
              aria-label="Account"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </Link>

            <CartIcon className={iconCls} />
          </div>
        </div>

        {/* ── Mobile: hamburger-left, logo-center, cart-right ──────────────── */}
        {/* On mobile: .nav-links hidden, .menu-btn shown (matches design CSS)   */}
        <div className="md:hidden flex items-center justify-between px-4 h-[58px]">
          {/* Hamburger */}
          <button
            className={`w-10 h-10 flex items-center justify-center -ml-1 transition-colors rounded-full ${iconCls}`}
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
          <Link
            href="/"
            className={`font-serif font-semibold tracking-[0.12em] uppercase leading-none transition-colors duration-300 ${
              isTransparent ? 'text-white' : 'text-[#0A0806]'
            }`}
            style={{ fontSize: '1.2rem' }}
          >
            KALOKEA
          </Link>

          {/* Cart */}
          <CartIcon />
        </div>
      </header>

      {/* ── Search overlay ────────────────────────────────────────────────── */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex flex-col animate-fade-in">
          <div className="absolute inset-0 bg-[#0A0806]/95" onClick={() => setSearchOpen(false)} />
          <div className="relative flex flex-col items-center justify-start pt-[120px] px-4">
            {/* Search box — matches #search-overlay .search-box */}
            <div className="w-full max-w-[600px] border-b border-white/30 flex items-center gap-4 pb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.7)" strokeWidth="1.6" strokeLinecap="round" className="shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search for dresses, tops, bags…"
                  className="w-full bg-transparent border-none outline-none font-serif text-[2rem] text-white font-light placeholder-white/30"
                />
              </form>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors shrink-0"
                aria-label="Close search"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Quick search results area */}
            <div className="w-full max-w-[600px] mt-10 flex flex-col gap-2">
              {['Dresses', 'Tops', 'Bags', 'New Arrivals', 'Sale'].map(term => (
                <button
                  key={term}
                  onClick={() => {
                    setSearchOpen(false)
                    router.push(`/shop/${term.toLowerCase().replace(/ /g, '-')}/`)
                  }}
                  className="text-left py-3 border-b border-white/10 text-white/70 hover:text-white font-sans text-[0.84rem] tracking-[0.12em] uppercase transition-colors duration-200"
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
