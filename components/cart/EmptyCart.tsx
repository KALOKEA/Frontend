import Link from 'next/link'

export default function EmptyCart() {
  return (
    <div className="text-center py-20">
      <div className="w-16 h-16 border border-[#e8e4e0] flex items-center justify-center mx-auto mb-6">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6b6b6b" strokeWidth="1.5">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
      </div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-2">Your cart is empty</h2>
      <p className="text-sm font-sans text-[#6b6b6b] mb-8">Looks like you haven&apos;t added anything yet.</p>
      <Link
        href="/shop"
        className="inline-block bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-8 py-4 hover:bg-[#2a2a2a] transition-colors"
      >
        Start Shopping
      </Link>
    </div>
  )
}
