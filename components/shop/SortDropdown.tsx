'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const SORTS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
]

export default function SortDropdown() {
  const router = useRouter()
  const params = useSearchParams()
  const current = params.get('sort') || 'newest'

  const onChange = (value: string) => {
    const p = new URLSearchParams(params.toString())
    p.set('sort', value)
    router.push(`/shop?${p.toString()}`)
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="border border-[#e8e4e0] text-xs font-sans text-[#0a0a0a] px-3 py-2 min-h-[44px] outline-none focus:border-[#0a0a0a] bg-white"
    >
      {SORTS.map((s) => (
        <option key={s.value} value={s.value}>{s.label}</option>
      ))}
    </select>
  )
}
