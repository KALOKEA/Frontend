'use client'
import { useCartStore } from '@/lib/store/useCartStore'

export default function CartIcon() {
  const { items, toggleCart } = useCartStore()
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <button
      onClick={toggleCart}
      className="relative w-9 h-9 flex items-center justify-center text-[#0A0908] hover:text-[#7C4A2D] transition-colors"
      aria-label="Cart"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#7C4A2D] text-[#FDFAF6] text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
