'use client'
import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function SuccessContent() {
  const params = useSearchParams()
  const orderNumber = params.get('order') || ''

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 border-2 border-[#7C4A2D] flex items-center justify-center mx-auto mb-6">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C4A2D" strokeWidth="1.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="font-serif text-4xl text-[#0a0a0a] mb-2">Order Placed!</h1>
        {orderNumber && (
          <p className="text-sm font-sans text-[#6b6b6b] mb-1">Order #{orderNumber}</p>
        )}
        <p className="text-sm font-sans text-[#6b6b6b] mb-8">
          Thank you for shopping with Kalokea. You&apos;ll receive a confirmation email shortly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/account/orders" className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-6 py-3 hover:bg-[#2a2a2a] transition-colors">
            Track Order
          </Link>
          <Link href="/shop" className="border border-[#0a0a0a] text-[#0a0a0a] text-[11px] font-sans tracking-widest uppercase px-6 py-3 hover:bg-[#0a0a0a] hover:text-white transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}
