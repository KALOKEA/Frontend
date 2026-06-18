'use client'
import { X } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import DOMPurify from 'dompurify'
import { reviewsApi, type ReviewItem } from '@/lib/api/reviews'
import { uploadReviewMedia } from '@/lib/api/upload'
import { useAuthStore } from '@/lib/store/useAuthStore'
import Link from 'next/link'

// ─── Star component (yellow) ─────────────────────────────────────────────────

function Stars({
  rating,
  interactive = false,
  onRate,
  label,
}: {
  rating: number
  interactive?: boolean
  onRate?: (n: number) => void
  /** Display-mode accessible label, e.g. "Rated 4.5 out of 5 stars" */
  label?: string
}) {
  const [hover, setHover] = useState(0)
  const active = interactive ? (hover || rating) : rating

  // Interactive mode: each star is a button for keyboard/AT access (WCAG 2.1.1)
  if (interactive) {
    return (
      <div role="group" aria-label="Select a star rating" className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onRate && onRate(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            aria-label={`${s} star${s !== 1 ? 's' : ''}`}
            aria-pressed={rating === s}
            className="rounded transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
          >
            <svg
              width={24} height={24} viewBox="0 0 24 24"
              fill={active >= s ? '#F59E0B' : 'none'}
              stroke="#F59E0B" strokeWidth="1.5"
              aria-hidden="true"
            >
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  // Display mode: container is a single img landmark with aria-label
  return (
    <div
      className="flex gap-0.5"
      role="img"
      aria-label={label ?? `Rated ${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((s) => (
        <svg
          key={s} width={13} height={13} viewBox="0 0 24 24"
          fill={active >= s ? '#F59E0B' : 'none'}
          stroke="#F59E0B" strokeWidth="1.5"
          aria-hidden="true"
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  )
}

function SafeText({ text }: { text: string }) {
  const clean =
    typeof window !== 'undefined'
      ? DOMPurify.sanitize(text, { ALLOWED_TAGS: [] })
      : text.replace(/<[^>]*>/g, '')
  return <>{clean}</>
}

// ─── Media thumbnail (image or video) ────────────────────────────────────────

function MediaThumb({ url }: { url: string }) {
  const isVideo = /\.(mp4|mov|webm)(\?|$)/i.test(url) || url.includes('/video/')
  const [zoomed, setZoomed] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Focus close button when lightbox opens
  useEffect(() => {
    if (zoomed) closeBtnRef.current?.focus()
  }, [zoomed])

  // Escape closes lightbox
  useEffect(() => {
    if (!zoomed) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setZoomed(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [zoomed])

  return (
    <>
      <button
        onClick={() => setZoomed(true)}
        aria-label={isVideo ? 'View review video' : 'View review photo'}
        className="relative w-16 h-16 overflow-hidden bg-[#f4f2ef] border border-[#e8e4e0] hover:border-[#0a0a0a] transition-colors flex-shrink-0"
      >
        {isVideo ? (
          <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        ) : (
          <Image src={url} alt="Review media" fill className="object-cover" sizes="64px" />
        )}
      </button>

      {/* Lightbox */}
      {zoomed && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={isVideo ? 'Review video' : 'Review photo'}
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomed(false)}
        >
          <button
            ref={closeBtnRef}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white"
            onClick={() => setZoomed(false)}
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <div onClick={(e) => e.stopPropagation()}>
            {isVideo ? (
              <video src={url} controls autoPlay className="max-w-full max-h-[85vh] rounded" />
            ) : (
              <div className="relative" style={{ maxWidth: '90vw', maxHeight: '85vh' }}>
                <img src={url} alt="Review media" className="max-w-full max-h-[85vh] object-contain" />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function ProductReviews({ product_id }: { product_id: string }) {
  const { isLoggedIn } = useAuthStore()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg, setSubmitMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function loadReviews() {
    setLoading(true)
    reviewsApi
      .getByProduct(product_id)
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadReviews() }, [product_id]) // eslint-disable-line

  // Add media files (max 5 total)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const combined = [...mediaFiles, ...files].slice(0, 5)
    setMediaFiles(combined)
    // Generate preview URLs
    const previews = combined.map((f) =>
      f.type.startsWith('video/') ? '__video__' : URL.createObjectURL(f),
    )
    setMediaPreviews(previews)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeMedia(i: number) {
    setMediaFiles((prev) => prev.filter((_, idx) => idx !== i))
    setMediaPreviews((prev) => prev.filter((_, idx) => idx !== i))
  }

  async function submitReview() {
    if (!rating) { setSubmitMsg({ text: 'Please select a star rating.', ok: false }); return }
    if (!body.trim()) { setSubmitMsg({ text: 'Please write something about the product.', ok: false }); return }
    setSubmitting(true)
    setSubmitMsg(null)
    try {
      // Upload media first
      let media_urls: string[] = []
      if (mediaFiles.length > 0) {
        setUploading(true)
        const results = await Promise.all(mediaFiles.map((f) => uploadReviewMedia(f)))
        media_urls = results.map((r) => r.url)
        setUploading(false)
      }

      await reviewsApi.create({
        product_id,
        rating,
        title: title.trim() || undefined,
        body: body.trim(),
        media_urls: media_urls.length > 0 ? media_urls : undefined,
      })

      setSubmitMsg({ text: 'Thank you! Your review is pending approval and will appear shortly.', ok: true })
      setRating(0); setTitle(''); setBody('')
      setMediaFiles([]); setMediaPreviews([])
      setShowForm(false)
    } catch (e: any) {
      setUploading(false)
      setSubmitMsg({ text: e?.message || 'Could not submit review. Try again.', ok: false })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="text-xs text-[#6b6b6b] py-4">Loading reviews…</p>

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  return (
    <div>
      {/* Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-[#e8e4e0]">
          <span className="font-serif text-3xl text-[#0a0a0a]" aria-hidden="true">{avg.toFixed(1)}</span>
          <div>
            <Stars rating={Math.round(avg)} label={`Rated ${avg.toFixed(1)} out of 5 stars`} />
            <p className="text-[11px] text-[#6b6b6b] mt-0.5">
              {reviews.length} review{reviews.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Review list */}
      {reviews.length > 0 ? (
        <div className="space-y-5 mb-6">
          {reviews.map((r) => {
            const text = r.body || r.comment || ''
            return (
              <div key={r.id} className="border-b border-[#f0ece8] pb-5 last:border-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Stars rating={r.rating} label={`Rated ${r.rating} out of 5 stars`} />
                    <span className="text-xs font-sans font-medium text-[#0a0a0a]">
                      {r.users?.name || r.guest_name || 'Verified Customer'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#6b6b6b]">
                    {new Date(r.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
                {r.title && (
                  <p className="text-sm font-sans font-medium text-[#0a0a0a] mb-1">
                    <SafeText text={r.title} />
                  </p>
                )}
                {text && (
                  <p className="text-sm font-sans text-[#6b6b6b] leading-relaxed mb-3">
                    <SafeText text={text} />
                  </p>
                )}
                {/* Attached media */}
                {r.media_urls && r.media_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {r.media_urls.map((url, i) => (
                      <MediaThumb key={i} url={url} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-sm font-sans text-[#6b6b6b] mb-5 text-center py-4">
          No reviews yet — be the first!
        </p>
      )}

      {/* Submit success */}
      {submitMsg?.ok && (
        <p role="status" className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 mb-4">
          {submitMsg.text}
        </p>
      )}

      {/* Write a review */}
      {isLoggedIn ? (
        !showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="text-[11px] uppercase tracking-widest text-[#7C4A2D] hover:underline"
          >
            + Write a review
          </button>
        ) : (
          <div className="border border-[#e8e4e0] p-4 bg-[#faf8f5]">
            <h4 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-4">Your review</h4>

            {/* Star picker */}
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">Rating *</p>
              <Stars rating={rating} interactive onRate={setRating} />
            </div>

            <div className="mb-3">
              <label htmlFor="review-title" className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">
                Title (optional)
              </label>
              <input
                id="review-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summarise your experience"
                maxLength={120}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="review-body" className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">
                Review *
              </label>
              <textarea
                id="review-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={4}
                placeholder="What did you like or dislike? How does it fit?"
                maxLength={1000}
                className="w-full border border-[#e8e4e0] px-3 py-2 text-sm focus:border-[#0a0a0a] outline-none bg-white resize-none"
              />
              <p className="text-[10px] text-[#6b6b6b] mt-0.5 text-right">{body.length}/1000</p>
            </div>

            {/* Media upload */}
            <div className="mb-4">
              <p className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-2">
                Photos / Videos (optional, max 5)
              </p>

              {/* Previews */}
              {mediaPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {mediaPreviews.map((preview, i) => (
                    <div key={i} className="relative w-16 h-16 border border-[#e8e4e0] overflow-hidden bg-[#f4f2ef]">
                      {preview === '__video__' ? (
                        <div className="w-full h-full flex items-center justify-center bg-[#1a1a1a]">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      ) : (
                        <img src={preview} alt="" className="w-full h-full object-cover" />
                      )}
                      <button
                        onClick={() => removeMedia(i)}
                        aria-label={`Remove media ${i + 1}`}
                        className="absolute top-0 right-0 w-5 h-5 bg-black/70 text-white flex items-center justify-center"
                      >
                        <X size={10} aria-hidden={true} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {mediaFiles.length < 5 && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-[#7C4A2D] text-[#7C4A2D] text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[#7C4A2D]/5 transition-colors"
                  >
                    + Add photos/videos
                  </button>
                </>
              )}
            </div>

            {submitMsg && !submitMsg.ok && (
              <p role="alert" className="text-sm text-red-600 mb-3">{submitMsg.text}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => { setShowForm(false); setSubmitMsg(null); setMediaFiles([]); setMediaPreviews([]) }}
                className="px-4 py-2 text-sm border border-[#e8e4e0] hover:bg-white"
              >
                Cancel
              </button>
              <button
                onClick={submitReview}
                disabled={submitting || uploading}
                className="px-4 py-2 text-sm bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-50"
              >
                {uploading ? 'Uploading media…' : submitting ? 'Submitting…' : 'Submit review'}
              </button>
            </div>
          </div>
        )
      ) : (
        <p className="text-xs text-[#6b6b6b]">
          <Link href="/login/" className="underline hover:text-[#0a0a0a]">Sign in</Link> to write a review.
        </p>
      )}
    </div>
  )
}
