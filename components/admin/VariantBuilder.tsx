'use client'
import { useState } from 'react'

interface VariantRow {
  size: string
  colour: string
  stock: number
  sku: string
}

interface VariantBuilderProps {
  variants: VariantRow[]
  onChange: (variants: VariantRow[]) => void
}

export default function VariantBuilder({ variants, onChange }: VariantBuilderProps) {
  const add = () => onChange([...variants, { size: '', colour: '', stock: 0, sku: '' }])
  const remove = (i: number) => onChange(variants.filter((_, idx) => idx !== i))
  const update = (i: number, key: keyof VariantRow, value: string | number) =>
    onChange(variants.map((v, idx) => idx === i ? { ...v, [key]: value } : v))

  return (
    <div>
      <div className="space-y-2 mb-3">
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-4 gap-2 items-center">
            <input value={v.size} onChange={(e) => update(i, 'size', e.target.value)} placeholder="Size" className="border border-[#e8e4e0] px-3 py-2 text-xs font-sans outline-none focus:border-[#0a0a0a]" />
            <input value={v.colour} onChange={(e) => update(i, 'colour', e.target.value)} placeholder="Colour" className="border border-[#e8e4e0] px-3 py-2 text-xs font-sans outline-none focus:border-[#0a0a0a]" />
            <input value={v.stock} onChange={(e) => update(i, 'stock', Number(e.target.value))} type="number" placeholder="Stock" className="border border-[#e8e4e0] px-3 py-2 text-xs font-sans outline-none focus:border-[#0a0a0a]" />
            <button type="button" onClick={() => remove(i)} className="text-[10px] font-sans text-red-500 hover:text-red-700">Remove</button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} className="text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] underline hover:text-[#c8a4a5]">
        + Add Variant
      </button>
    </div>
  )
}
