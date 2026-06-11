'use client'
import { useCartStore } from '@/lib/store/useCartStore'

export default function CartIcon({ className }: { className?: string }) {
  const { items, toggleCart } = useCartStore()
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <button
      onClick={toggleCart}
      className={`relative w-10 h-10 flex items-center justify-center rounded-full transition-colors ${className || 'text-[#0A0908] hover:bg-[#F0EAE1]'}`}
      aria-label={count > 0 ? `Cart, ${count} item${count !== 1 ? 's' : ''}` : 'Cart'}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span aria-hidden="true" className="absolute -top-1 -right-1 bg-[#7C4A2D] text-[#FDFAF6] text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  )
}
