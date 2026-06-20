'use client'
import { useState } from 'react'
import { BASE_URL } from '@/lib/api/client'

interface Props {
  variantId: string
  productName: string
  variantLabel: string
}

export default function BackInStockNotify({ variantId, productName, variantLabel }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    setErrorMsg('')
    try {
      const res = await fetch(`${BASE_URL}/stock-notifications/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: variantId, email: email.trim().toLowerCase() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message || 'Failed to subscribe')
      setStatus('success')
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-[#e8e4e0] rounded px-4 py-3 bg-[#faf8f5]">
        <p className="text-[11px] font-sans tracking-widest text-[#0a0a0a] uppercase mb-1">
          You&apos;re on the list
        </p>
        <p className="text-[13px] font-sans text-[#6b6b6b] leading-relaxed">
          We&apos;ll email you as soon as <strong className="text-[#0a0a0a]">{productName}</strong>{' '}
          ({variantLabel}) is back in stock.
        </p>
      </div>
    )
  }

  return (
    <div className="border border-[#e8e4e0] rounded px-4 py-4 bg-[#faf8f5]">
      <p className="text-[11px] font-sans tracking-widest uppercase text-[#0a0a0a] mb-1">
        Out of stock
      </p>
      <p className="text-[13px] font-sans text-[#6b6b6b] mb-3 leading-relaxed">
        Enter your email and we&apos;ll notify you the moment this size is available again.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          aria-label={`Email to be notified when ${productName} ${variantLabel} is back in stock`}
          className="flex-1 px-3 py-2.5 text-[13px] font-sans border border-[#d8d4d0] bg-white text-[#0a0a0a] placeholder-[#9a9a9a] focus:outline-none focus:border-[#0a0a0a] transition-colors min-h-[44px]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="px-5 py-2.5 bg-[#0a0a0a] text-white text-[10px] font-sans tracking-widest uppercase hover:bg-[#333] transition-colors disabled:opacity-60 whitespace-nowrap min-h-[44px]"
        >
          {status === 'loading' ? 'Sending…' : 'Notify Me'}
        </button>
      </form>
      {status === 'error' && (
        <p role="alert" className="mt-2 text-[12px] font-sans text-red-600">{errorMsg}</p>
      )}
    </div>
  )
}
