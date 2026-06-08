'use client'
import { useState } from 'react'
import { couponsApi } from '@/lib/api/coupons'
import { useCartStore } from '@/lib/store/useCartStore'

interface CouponInputProps {
  onApply: (discount: number, code: string) => void
  onRemove: () => void
  appliedCode: string | null
}

export default function CouponInput({ onApply, onRemove, appliedCode }: CouponInputProps) {
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
      const res = await couponsApi.validate(code.trim().toUpperCase(), subtotal)
      if (res.valid) {
        onApply(res.discount_amount, code.trim().toUpperCase())
      } else {
        setError(res.message || 'Invalid coupon code')
      }
    } catch {
      setError('Invalid or expired coupon')
    } finally {
      setLoading(false)
    }
  }

  if (appliedCode) {
    return (
      <div className="flex items-center justify-between border border-[#7C4A2D] px-4 py-3">
        <p className="text-xs font-sans text-[#0a0a0a]">
          Coupon <span className="font-medium">{appliedCode}</span> applied ✓
        </p>
        <button onClick={onRemove} className="text-[10px] font-sans text-[#6b6b6b] hover:text-[#0a0a0a] tracking-widest uppercase underline">Remove</button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Coupon code"
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
      {error && <p className="text-[11px] text-red-500 font-sans mt-1">{error}</p>}
    </div>
  )
}
