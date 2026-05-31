'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const COLOURS = ['Black', 'White', 'Beige', 'Pink', 'Red', 'Blue', 'Green', 'Yellow', 'Brown']
const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 50000 },
  { label: '₹500 – ₹1,000', min: 50000, max: 100000 },
  { label: '₹1,000 – ₹2,000', min: 100000, max: 200000 },
  { label: 'Above ₹2,000', min: 200000, max: 999999 },
]

export default function FilterSidebar() {
  const router = useRouter()
  const params = useSearchParams()

  const updateParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/shop?${p.toString()}`)
  }, [params, router])

  const size = params.get('size')
  const colour = params.get('colour')

  return (
    <aside className="w-64 shrink-0">
      {/* Clear filters */}
      {(params.toString()) && (
        <button
          onClick={() => router.push('/shop')}
          className="text-[10px] font-sans tracking-widest uppercase text-[#c8a4a5] hover:text-[#a07e80] mb-6 block"
        >
          Clear All Filters
        </button>
      )}

      {/* Price */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-3">Price</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map((r) => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={params.get('min_price') === String(r.min)}
                onChange={() => {
                  updateParam('min_price', String(r.min))
                  updateParam('max_price', String(r.max))
                }}
                className="accent-[#c8a4a5]"
              />
              <span className="text-xs font-sans text-[#0a0a0a]">{r.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => updateParam('size', size === s ? null : s)}
              className={`px-3 py-1.5 text-[10px] font-sans tracking-widest border transition-colors ${size === s ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : 'border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a]'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-3">Colour</h4>
        <div className="space-y-2">
          {COLOURS.map((c) => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={colour === c}
                onChange={() => updateParam('colour', colour === c ? null : c)}
                className="accent-[#c8a4a5]"
              />
              <span className="text-xs font-sans text-[#0a0a0a]">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  )
}
