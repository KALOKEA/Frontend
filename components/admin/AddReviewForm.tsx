'use client'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import api from '@/lib/api/client'
import { adminApi } from '@/lib/api/admin'
import { useToast } from '@/components/ui/Toast'

interface ProductLite { id: string; name: string }

/**
 * Admin tool to add a review directly to a product (seed / import feedback).
 * Posts to /reviews/admin/create — auto-approved, counts toward the rating.
 */
export default function AddReviewForm({ onCreated }: { onCreated?: () => void }) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<ProductLite[]>([])
  const [productId, setProductId] = useState('')
  const [rating, setRating] = useState(5)
  const [guestName, setGuestName] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [date, setDate] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!open || products.length) return
    api.get<any>('/products?limit=200&is_active=true')
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.data ?? [])
        setProducts(list.map((p: any) => ({ id: p.id, name: p.name })))
      })
      .catch(() => {})
  }, [open, products.length])

  async function submit() {
    if (!productId || !guestName.trim()) {
      toast('Pick a product and enter a reviewer name')
      return
    }
    setSaving(true)
    try {
      await adminApi.createReview({
        product_id: productId,
        rating,
        guest_name: guestName.trim(),
        title: title.trim() || undefined,
        body: body.trim() || undefined,
        created_at: date ? new Date(date).toISOString() : undefined,
      })
      toast('Review added')
      setProductId(''); setRating(5); setGuestName(''); setTitle(''); setBody(''); setDate('')
      setOpen(false)
      onCreated?.()
    } catch (e: any) {
      toast(e?.message || 'Failed to add review')
    } finally {
      setSaving(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 text-xs font-sans tracking-wide uppercase bg-[#7C4A2D] text-white rounded hover:bg-[#6A3D25] transition-colors"
      >
        + Add Review
      </button>
    )
  }

  const inputCls = 'mt-1 w-full border border-[#e4ddd4] rounded px-2 py-2 text-sm text-[#0a0a0a] bg-white'

  return (
    <div className="border border-[#e4ddd4] rounded-lg p-5 bg-white mb-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-lg text-[#0a0a0a]">Add a review</h3>
        <button onClick={() => setOpen(false)} className="text-xs text-[#6b6b6b] hover:text-[#0a0a0a]">Cancel</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="text-xs text-[#6b6b6b] block">
          Product
          <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputCls}>
            <option value="">Select a product…</option>
            {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </label>

        <label className="text-xs text-[#6b6b6b] block">
          Reviewer name
          <input value={guestName} onChange={(e) => setGuestName(e.target.value)} placeholder="e.g. Priya S." className={inputCls} />
        </label>

        <div className="text-xs text-[#6b6b6b]">
          Rating
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} type="button" onClick={() => setRating(i)} aria-label={`${i} star${i > 1 ? 's' : ''}`}>
                <Star size={20} fill={i <= rating ? '#C49070' : 'none'} stroke="#C49070" />
              </button>
            ))}
          </div>
        </div>

        <label className="text-xs text-[#6b6b6b] block">
          Date (optional)
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
        </label>

        <label className="text-xs text-[#6b6b6b] block sm:col-span-2">
          Title (optional)
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Beautiful fabric, great fit" className={inputCls} />
        </label>

        <label className="text-xs text-[#6b6b6b] block sm:col-span-2">
          Review text (optional)
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={3} className={inputCls} />
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={submit}
          disabled={saving}
          className="px-5 py-2 text-xs font-sans tracking-wide uppercase bg-[#7C4A2D] text-white rounded hover:bg-[#6A3D25] disabled:opacity-50 transition-colors"
        >
          {saving ? 'Adding…' : 'Add review'}
        </button>
      </div>
    </div>
  )
}
