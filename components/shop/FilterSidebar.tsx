'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
export const COLOURS = ['Black', 'White', 'Beige', 'Pink', 'Red', 'Blue', 'Green', 'Yellow', 'Brown', 'Maroon', 'Navy']
export const PRICE_RANGES = [
  { label: 'Under ₹500', min: 0, max: 50000 },
  { label: '₹500 – ₹1,000', min: 50000, max: 100000 },
  { label: '₹1,000 – ₹2,000', min: 100000, max: 200000 },
  { label: 'Above ₹2,000', min: 200000, max: 999999 },
]

export function useFilters() {
  const router = useRouter()
  const params = useSearchParams()

  const updateParam = useCallback((key: string, value: string | null) => {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    p.delete('page')
    router.push(`/shop/?${p.toString()}`)
  }, [params, router])

  const clearAll = useCallback(() => router.push('/shop/'), [router])

  return { params, updateParam, clearAll }
}

export function FilterPanel({ onApply }: { onApply?: () => void }) {
  const { params, updateParam, clearAll } = useFilters()
  const size = params.get('size')
  const colour = params.get('colour')

  const apply = (key: string, value: string | null) => {
    updateParam(key, value)
    onApply?.()
  }

  return (
    <div>
      {params.toString() && (
        <button
          onClick={() => { clearAll(); onApply?.() }}
          className="text-[10px] font-sans tracking-widest uppercase text-[#7C4A2D] hover:text-[#5C3520] mb-6 block"
        >
          Clear all filters
        </button>
      )}

      {/* Price */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6B5E55] mb-3">Price</h4>
        <div className="space-y-2">
          {PRICE_RANGES.map(r => (
            <label key={r.label} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={params.get('min_price') === String(r.min)}
                onChange={() => {
                  updateParam('min_price', String(r.min))
                  updateParam('max_price', String(r.max))
                  onApply?.()
                }}
                className="accent-[#7C4A2D]"
              />
              <span className="text-xs font-sans text-[#0A0908]">{r.label}</span>
            </label>
          ))}
          {params.get('min_price') && (
            <button
              onClick={() => {
                updateParam('min_price', null)
                updateParam('max_price', null)
                onApply?.()
              }}
              className="text-[10px] text-[#6b5c55] hover:text-[#7C4A2D]"
            >
              Clear price
            </button>
          )}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6B5E55] mb-3">Size</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(s => (
            <button
              key={s}
              onClick={() => apply('size', size === s ? null : s)}
              className={`px-3 py-2.5 min-h-[44px] text-[10px] font-sans tracking-widest border transition-colors ${
                size === s
                  ? 'border-[#7C4A2D] bg-[#7C4A2D] text-white'
                  : 'border-[#E0D4C4] text-[#0A0908] hover:border-[#7C4A2D]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Colour */}
      <div className="mb-6">
        <h4 className="text-[10px] font-sans tracking-widest uppercase text-[#6B5E55] mb-3">Colour</h4>
        <div className="space-y-2">
          {COLOURS.map(c => (
            <label key={c} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={colour === c}
                onChange={() => apply('colour', colour === c ? null : c)}
                className="accent-[#7C4A2D]"
              />
              <span className="text-xs font-sans text-[#0A0908]">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function FilterSidebar() {
  return (
    <aside className="w-56 shrink-0">
      <FilterPanel />
    </aside>
  )
}
