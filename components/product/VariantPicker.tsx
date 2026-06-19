'use client'
import type { ProductVariant } from '@/lib/api/products'
import { getColorHex, isLightColor } from '@/lib/utils/colorHex'

// ─── Props ────────────────────────────────────────────────────────────────────

interface VariantPickerProps {
  variants: ProductVariant[]
  selectedColour: string | null
  selectedSize: string | null
  onColourChange: (colour: string) => void
  onSizeChange: (size: string) => void
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function VariantPicker({
  variants,
  selectedColour,
  selectedSize,
  onColourChange,
  onSizeChange,
}: VariantPickerProps) {
  const colours = Array.from(
    new Set(variants.filter((v) => v.is_active && v.colour).map((v) => v.colour!)),
  )
  const sizes = Array.from(
    new Set(
      variants
        .filter((v) => v.is_active && (!selectedColour || v.colour === selectedColour))
        .filter((v) => v.size)
        .map((v) => v.size!),
    ),
  )

  // A size is OOS only when EVERY active variant for that size (within the
  // selected colour, if any) has stock=0. Using .find() was wrong: it checked
  // only the first match, so if the first colour-variant had stock=0 the size
  // appeared disabled even when another colour still had stock.
  const isOOS = (size: string) => {
    const matching = variants.filter(
      (v) => v.is_active && v.size === size && (!selectedColour || v.colour === selectedColour),
    )
    return matching.length === 0 || matching.every((v) => v.stock === 0)
  }

  return (
    <div className="space-y-5">
      {/* ── Colour swatches ────────────────────────────────────────────── */}
      {colours.length > 0 && (
        <div>
          <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-3">
            Colour:{' '}
            <span className="text-[#0a0a0a] normal-case tracking-normal">
              {selectedColour || 'Select'}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            {colours.map((c) => {
              const hex = getColorHex(c)
              const light = isLightColor(hex)
              const selected = selectedColour === c
              return (
                <button
                  key={c}
                  onClick={() => onColourChange(c)}
                  title={c}
                  aria-label={c}
                  aria-pressed={selected}
                  className={`relative w-10 h-10 rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0a0a0a] ${
                    selected
                      ? 'scale-110 ring-2 ring-offset-2 ring-[#0a0a0a]'
                      : 'ring-1 ring-[#d4d0cc] hover:ring-[#0a0a0a] hover:scale-105'
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  {/* Checkmark when selected — decorative, aria-pressed on button conveys state */}
                  {selected && (
                    <svg
                      aria-hidden="true"
                      className="absolute inset-0 m-auto"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={light ? '#0a0a0a' : 'white'}
                      strokeWidth="3.5"
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Size buttons ──────────────────────────────────────────────── */}
      {sizes.length > 0 && (
        <div>
          <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] mb-2">
            Size:{' '}
            <span className="text-[#0a0a0a] normal-case tracking-normal">
              {selectedSize || 'Select'}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => {
              const oos = isOOS(s)
              return (
                <button
                  key={s}
                  onClick={() => !oos && onSizeChange(s)}
                  disabled={oos}
                  aria-pressed={selectedSize === s}
                  aria-label={oos ? `${s} — out of stock` : s}
                  className={`px-4 py-2.5 min-h-[44px] text-[10px] font-sans tracking-widest border transition-colors relative ${
                    oos
                      ? 'border-[#e8e4e0] text-[#d0ccc8] cursor-not-allowed line-through'
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
