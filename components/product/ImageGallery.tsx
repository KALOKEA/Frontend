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
  const pauseRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // Cleanup pause timer on unmount
  useEffect(() => () => clearTimeout(pauseRef.current), [])
  const zoomCloseRef = useRef<HTMLButtonElement>(null)
  // Touch swipe state
  const touchStartX = useRef<number | null>(null)

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

  // ── Auto-focus close button when zoom opens (WCAG 2.4.3) ─────────────────
  useEffect(() => {
    if (zoomed) zoomCloseRef.current?.focus()
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
      {/* Mobile: column (main image top, thumbnails bottom horizontal strip)
          Desktop md+: row (thumbnails left vertical, main image right)       */}
      <div className="flex flex-col md:flex-row gap-3 md:items-start">

        {/* ── Main viewer — top on mobile (order-1), right on desktop (order-2) ── */}
        <div
          className="relative flex-1 bg-[#f4f2ef] group overflow-hidden md:order-2"
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX }}
          onTouchEnd={(e) => {
            if (touchStartX.current === null) return
            const dx = e.changedTouches[0].clientX - touchStartX.current
            touchStartX.current = null
            if (Math.abs(dx) < 40) return // ignore tiny taps
            if (dx < 0) next(); else prev()
          }}
        >
          {current.type === 'image' ? (
            <>
              {/* Wrap in button so zoom is keyboard-accessible (WCAG 2.1.1) */}
              <button
                onClick={() => setZoomed(true)}
                aria-label={`Zoom: ${current.alt}`}
                className="block w-full cursor-zoom-in"
              >
                <Image
                  src={current.url}
                  alt={current.alt}
                  width={600}
                  height={800}
                  className="w-full h-auto block transition-opacity duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={active === 0}
                />
              </button>
              {/* Zoom hint — tap on mobile, hover on desktop */}
              <span className="absolute bottom-3 right-3 bg-black/55 text-white text-[8px] font-sans tracking-widest px-2 py-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none select-none" aria-hidden="true">
                TAP TO ZOOM
              </span>
            </>
          ) : (
            /* Video: use controls so user can play/pause; aspect-[9/16] as a
               portrait fallback so the container is never zero-height while loading */
            <div className="relative w-full aspect-[3/4] bg-[#0a0a0a] flex items-center justify-center">
              <video
                src={current.url}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {/* ── Prev / Next arrows ─────────────────────────────────── */}
          {media.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={next}
                aria-label="Next image"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/80 backdrop-blur-sm flex items-center justify-center shadow opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2.5" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          {/* ── Dot indicators (mobile only — desktop uses thumbnail strip) ── */}
          {media.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
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

        {/* ── Thumbnail strip ─────────────────────────────────────────────── */}
        {/* Mobile: horizontal scroll row at bottom (order-2)                  */}
        {/* Desktop md+: vertical left column (order-1, w-16)                  */}
        {media.length > 1 && (
          <div className="flex flex-row gap-2 overflow-x-auto pb-1 md:pb-0 md:flex-col md:w-16 md:overflow-x-hidden md:overflow-y-auto md:order-1">
            {media.map((item, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                aria-label={item.type === 'video' ? 'Video' : `Image ${i + 1}`}
                className={`relative flex-shrink-0 w-14 md:w-16 aspect-[3/4] overflow-hidden border-2 transition-colors bg-[#f4f2ef] ${
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
                  <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Zoom / Lightbox Modal ─────────────────────────────────────────── */}
      {zoomed && current.type === 'image' && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Zoomed view: ${current.alt}`}
          className="fixed inset-0 z-[9999] bg-black/92 flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          {/* Close button — receives focus on modal open */}
          <button
            ref={zoomCloseRef}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            onClick={() => setZoomed(false)}
            aria-label="Close zoom"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
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
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/15 hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                onClick={(e) => { e.stopPropagation(); next() }}
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </>
          )}

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-[11px] font-sans tracking-widest">
            {active + 1} / {media.length}
          </p>
        </div>
      )}
    </>
  )
}
