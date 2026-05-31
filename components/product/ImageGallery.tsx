'use client'
import Image from 'next/image'
import { useState } from 'react'
import type { ProductImage } from '@/lib/api/products'

interface ImageGalleryProps {
  images: ProductImage[]
  productName: string
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const sorted = [...images].sort((a, b) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order)
  const [active, setActive] = useState(0)

  if (!sorted.length) {
    return (
      <div className="aspect-[3/4] bg-[#f4f2ef] flex items-center justify-center">
        <span className="text-[#6b6b6b] text-sm font-sans">No image</span>
      </div>
    )
  }

  return (
    <div className="flex gap-3">
      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex flex-col gap-2 w-16">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-[3/4] overflow-hidden border-2 transition-colors ${i === active ? 'border-[#0a0a0a]' : 'border-transparent hover:border-[#e8e4e0]'}`}
            >
              <Image src={img.url} alt={`${productName} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-[#f4f2ef]">
        <Image
          src={sorted[active].url}
          alt={sorted[active].alt_text || productName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  )
}
