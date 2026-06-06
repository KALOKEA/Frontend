'use client'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import type { ProductImage } from '@/lib/api/products'

// ─── Types ───────────────────────────────────────────────────────────────────

interface MediaItem {
  type: 'image' | 'video'
  url: string
  alt: string
}

interface Props {
  images: ProductImage[]
  productName: string
  videoUrl?: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ImageGallery({ images, productName, videoUrl }: Props) {
  const sorted = [...images].sort(
    (a, b) =>
      (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0) || a.sort_order - b.sort_order,
  )

  // Build unified media array: images first, then optional video
  const media: MediaItem[] = [
    ...sorted.map((img) => ({
      type: 'image' as const,
      url: img.url,
      alt: img.alt_text || productName,
    })),
    ...(videoUrl
      ? [{ type: 'video' as const, url: videoUrl, alt: `${productName} – video` }]
      : []),
  ]

  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [zoomed, setZoomed] = useState(false)
  const pauseRef = useRef<ReturnType<typeof setTimeout>>()

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (media.length <= 1 || paused) return
    const id = setInterval(
      () => setActive((prev) => (prev + 1) % media.length),
      3500,
    )
    return () => clearInterval(id)
  }, [media.length, paused])

  // ── Keyboard: Escape closes zoom ─────────────────────────────────────────
  useEffect(() => {
    if (!zoomed) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoomed(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [zoomed])

  // ── Navigation ──────────────────────────────────────────────────────────
  const navigate = (index: number) => {
    setActive(index)
    setPaused(true)
    clearTimeout(pauseRef.current)
    pauseRef.current = setTimeout(() => setPaused(false), 5000)
  }

  const prev = () => navigate((active - 1 + media.length) % media.length)
  const next = () => navigate((active + 1) % media.length)
  const current = media[active] ?? media[0]

  // ── Empty state ──────────────────────────────────────────────────────────
  if (!media.length) {
    return (
      <div className="aspect-[3/4] bg-[#f4f2ef] flex items-center justify-center">
        <span className="text-[#6b6b6b] text-sm font-sans">No image</span>
      </div>
    )
  }

  return (
    <>
      <div className="flex gap-3 items-start">
        {/* ── Thumbnail strip ─────────────────────────────────────────── */}
        {media.length > 1 && (
          <div className="flex flex-col gap-2 w-16 overflow-y-auto" style={{ maxHeight: '100%' }}>
            {media.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                aria-label={item.type === 'video' ? 'Video' : `Image ${i + 1}`}
                className={`relative flex-shrink-0 aspect-[3/4] overflow-hidden border-2 transition-colors bg-[#f4f2ef] ${
                  i === active
                    ? 'border-[#0a0a0a]'
                    : 'border-transparent hover:border-[#c8c4c0]'
                }`}
              >
                {item.type === 'image' ? (
                  <Image
                    src={item.url}
                    alt={item.alt}
                    fill
                    className="object-contain object-top"
                    sizes="64px"
                  />
                ) : (
                  // Video thumbnail: dark tile with play icon
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* ── Main viewer — no fixed aspect ratio, image sets its own height ── */}
        <div className="relative flex-1 bg-[#f4f2ef] group overflow-hidden">
          {current.type === 'image' ? (
            <>
              {/* width/height are intrinsic hints for Next.js; CSS w-full h-auto
                  makes the image fill width and set height from its natural ratio —
                  zero empty space regardless of the image's actual dimensions. */}
              <Image
                src={current.url}
                alt={current.alt}
                width={600}
                height={800}
                className="w-full h-auto block transition-opacity duration-500 cursor-zoom-in"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={active === 0}
                onClick={() => setZoomed(true)}
              />
              {/* Zoom hint badge */}
              <span className="absolute bottom-3 right-3 bg-black/55 text-white text-[8px] font-sans tracking-widest px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                CLICK TO ZOOM
              </span>
            </>
          ) : (
            <video
              src={current.url}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-auto block"
            />
          )}

          {/* ── Prev / Next arrows (shown on hover) ─────────────────── */}
          {media.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* ── Dot indicators ──────────────────────────────────────── */}
          {media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {media.map((_, i) => (
                <button
                  key={i}
                  onClick={() => navigate(i)}
                  aria-label={`Go to ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === active ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Zoom / Lightbox Modal ─────────────────────────────────────────── */}
      {zoomed && current.type === 'image' && (
        <div
          className="fixed inset-0 z-[9999] bg-black/92 flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {/* Image */}
          <div
            className="relative w-full max-w-xl mx-4"
            style={{ aspectRatio: '3/4', maxHeight: '90vh' }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={current.url}
              alt={current.alt}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Prev/Next in zoom (images only) */}
          {media.filter((m) => m.type === 'image').length > 1 && (
            <>
              <button
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); prev() }}
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* Counter */}
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-[11px] font-sans tracking-widest">
            {active + 1} / {media.length}
          </p>
        </div>
      )}
    </>
  )
}
