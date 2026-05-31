'use client'
import type { ProductVariant } from '@/lib/api/products'

interface VariantPickerProps {
  variants: ProductVariant[]
  selectedColour: string | null
  selectedSize: string | null
  onColourChange: (colour: string) => void
  onSizeChange: (size: string) => void
}

export default function VariantPicker({
  variants,
  selectedColour,
  selectedSize,
  onColourChange,
  onSizeChange,
}: VariantPickerProps) {
  const colours = [...new Set(variants.filter((v) => v.colour).map((v) => v.colour!))]
  const sizes = [...new Set(
    variants
      .filter((v) => !selectedColour || v.colour === selectedColour)
      .filter((v) => v.size)
      .map((v) => v.size!)
  )]

  const isOOS = (size: string) => {
    const v = variants.find((v) => v.size === size && (!selectedColour || v.colour === selectedColour))
    return !v || v.stock === 0
  }

  return (
    <div className="space-y-5">
      {/* Colour */}
      {colours.length > 0 && (
        <div>
          <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">
            Colour: <span className="text-[#0a0a0a]">{selectedColour || 'Select'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {colours.map((c) => (
              <button
                key={c}
                onClick={() => onColourChange(c)}
                className={`px-3 py-1.5 text-[10px] font-sans tracking-widest border transition-colors ${selectedColour === c ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : 'border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a]'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">
            Size: <span className="text-[#0a0a0a]">{selectedSize || 'Select'}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const oos = isOOS(s)
              return (
                <button
                  key={s}
                  onClick={() => !oos && onSizeChange(s)}
                  disabled={oos}
                  className={`px-3 py-1.5 text-[10px] font-sans tracking-widest border transition-colors relative ${
                    oos
                      ? 'border-[#e8e4e0] text-[#e8e4e0] cursor-not-allowed line-through'
                      : selectedSize === s
                      ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                      : 'border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a]'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
