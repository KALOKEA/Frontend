'use client'
import { Check, Tag } from 'lucide-react'
import { useState } from 'react'
import { couponsApi } from '@/lib/api/coupons'
import { useCartStore } from '@/lib/store/useCartStore'

interface CouponInputProps {
  onApply: (discount: number, code: string) => void
  onRemove: () => void
  appliedCode: string | null
  /** Logged-in user ID — passed to backend so per-user caps and new_users_only are enforced at validation. */
  userId?: string | null
  /** Guest email from billing form — same purpose as userId for guest checkouts. */
  guestEmail?: string | null
  /** When true, show "New customer? Try WELCOME15" hint. */
  showWelcomeHint?: boolean
}

export default function CouponInput({
  onApply,
  onRemove,
  appliedCode,
  userId,
  guestEmail,
  showWelcomeHint,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { items } = useCartStore()
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  const apply = async () => {
    if (!code.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await couponsApi.validate(
        code.trim().toUpperCase(),
        subtotal,
        userId,
        guestEmail,
      )
      if (res.valid) {
        onApply(res.discount_amount, code.trim().toUpperCase())
      } else {
        setError(res.message || 'Invalid coupon code')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      setError(msg || 'Invalid or expired coupon')
    } finally {
      setLoading(false)
    }
  }

  const applyCode = (prefill: string) => {
    setCode(prefill)
  }

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between border border-[#7C4A2D] px-4 py-3">
        <p className="text-xs font-sans text-[#0a0a0a]">
          <Check size={11} className="inline mr-1 text-[#7C4A2D]" aria-hidden={true} />
          Coupon <span className="font-medium">{appliedCode}</span> applied
        </p>
        <button
          onClick={onRemove}
          aria-label={`Remove coupon ${appliedCode}`}
          className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#0a0a0a] tracking-widest uppercase underline"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      {showWelcomeHint && (
        <button
          type="button"
          onClick={() => applyCode('WELCOME15')}
          className="flex items-center gap-1.5 text-[11px] font-sans text-[#7C4A2D] mb-2 hover:underline"
        >
          <Tag size={11} />
          New customer? Use <span className="font-medium font-mono">WELCOME15</span> for 15% off your first order
        </button>
      )}
      <div className="flex">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && apply()}
          placeholder="Coupon code"
          aria-label="Coupon code"
          className="flex-1 border border-[#e8e4e0] border-r-0 px-4 py-3 text-base font-sans outline-none focus:border-[#0a0a0a] uppercase placeholder:normal-case placeholder:text-[#6b6b6b] min-h-[44px]"
        />
        <button
          onClick={apply}
          disabled={loading || !code}
          className="bg-[#0a0a0a] text-white text-[10px] font-sans tracking-widest uppercase px-4 min-h-[44px] hover:bg-[#2a2a2a] disabled:opacity-50"
        >
          {loading ? '...' : 'Apply'}
        </button>
      </div>
      {error && <p role="alert" className="text-[11px] text-red-500 font-sans mt-1">{error}</p>}
    </div>
  )
}
