'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'

const NAV_ITEMS = [
  { href: '/',        icon: Home,        label: 'Home'     },
  { href: '/shop/',   icon: Search,      label: 'Shop'     },
  { href: '/cart/',   icon: ShoppingBag, label: 'Cart'     },
  { href: '/account/wishlist/', icon: Heart, label: 'Saved' },
  { href: '/account/', icon: User,       label: 'Account'  },
]

export default function MobileBottomNav() {
  const pathname  = usePathname()
  const cartItems = useCartStore(s => s.items)
  const wishItems = useWishlistStore(s => s.items)

  const cartCount    = cartItems.reduce((n, i) => n + i.quantity, 0)
  const wishlistCount = wishItems.length

  // Hide on admin routes
  if (pathname.startsWith('/admin')) return null

  return (
    <nav
      className="k-mobile-bottom-nav"
      aria-label="Mobile navigation"
    >
      {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href.replace(/\/$/, '')))
        const badge  = href === '/cart/' ? cartCount : href === '/account/wishlist/' ? wishlistCount : 0

        return (
          <Link
            key={href}
            href={href}
            className={`k-mobile-bottom-nav__item${active ? ' k-mobile-bottom-nav__item--active' : ''}`}
            aria-label={label}
            aria-current={active ? 'page' : undefined}
          >
            <span className="k-mobile-bottom-nav__icon-wrap">
              <Icon size={22} strokeWidth={active ? 2 : 1.5} />
              {badge > 0 && (
                <span className="k-mobile-bottom-nav__badge" aria-hidden="true">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </span>
            <span className="k-mobile-bottom-nav__label">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
