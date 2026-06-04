'use client'
import { useEffect, useState } from 'react'
import { productsApi } from '@/lib/api/products'
import { adminApi } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

interface Row {
  variantId: string
  product: string
  size?: string
  colour?: string
  sku: string
  price: number
  stock: number
  active: boolean
}

const LOW = 5

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [lowOnly, setLowOnly] = useState(false)

  function load() {
    setLoading(true)
    productsApi.getAll({ limit: 200, include_inactive: 'true' } as any)
      .then((res) => {
        const flat: Row[] = []
        for (const p of res.data || []) {
          for (const v of p.product_variants || []) {
            flat.push({
              variantId: v.id, product: p.name, size: v.size, colour: v.colour,
              sku: v.sku, price: v.price, stock: v.stock, active: v.is_active,
            })
          }
        }
        setRows(flat)
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function saveStock(r: Row) {
    const raw = drafts[r.variantId]
    if (raw === undefined) return
    const stock = parseInt(raw, 10)
    if (isNaN(stock) || stock < 0) return
    setSavingId(r.variantId)
    try {
      await adminApi.updateVariant(r.variantId, { stock })
      setRows((prev) => prev.map((x) => x.variantId === r.variantId ? { ...x, stock } : x))
      setDrafts((d) => { const n = { ...d }; delete n[r.variantId]; return n })
    } catch { /* keep draft so the admin can retry */ } finally {
      setSavingId(null)
    }
  }

  const visible = lowOnly ? rows.filter((r) => r.stock <= LOW) : rows

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-8 gap-3">
        <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Inventory</h1>
        <label className="flex items-center gap-2 text-sm text-[#6b6b6b]">
          <input type="checkbox" checked={lowOnly} onChange={(e) => setLowOnly(e.target.checked)} /> Low stock only (≤{LOW})
        </label>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((r) => {
                const draft = drafts[r.variantId]
                const changed = draft !== undefined && draft !== String(r.stock)
                return (
                  <tr key={r.variantId} className={`border-b border-[#f0ece8] last:border-0 ${r.stock <= LOW ? 'bg-amber-50/60' : ''}`}>
                    <td className="px-4 py-3 font-medium text-[#0a0a0a]">{r.product}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{[r.size, r.colour].filter(Boolean).join(' / ') || '—'}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{r.sku}</td>
                    <td className="px-4 py-3">{formatPrice(r.price)}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={draft ?? String(r.stock)}
                        onChange={(e) => setDrafts((d) => ({ ...d, [r.variantId]: e.target.value }))}
                        className={`w-20 border px-2 py-1 ${r.stock <= LOW ? 'border-amber-400' : 'border-[#e8e4e0]'}`}
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => saveStock(r)}
                        disabled={!changed || savingId === r.variantId}
                        className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline disabled:opacity-30"
                      >
                        {savingId === r.variantId ? 'Saving…' : 'Save'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!visible.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">No variants</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
