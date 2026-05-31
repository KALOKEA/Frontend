'use client'
import Link from 'next/link'

export default function ReviewsPage() {
  return (
    <div>
      <h2 className="font-serif text-2xl text-[#0a0a0a] mb-6">My Reviews</h2>
      <p className="text-sm font-sans text-[#6b6b6b]">
        You can leave a review on any product page after your order is delivered.
      </p>
      <Link href="/account/orders" className="inline-block mt-4 text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] underline hover:text-[#c8a4a5]">
        View My Orders
      </Link>
    </div>
  )
}
