'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { productsApi } from '@/lib/api/products'
import { adminApi } from '@/lib/api/admin'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

interface Row {
  variantId: string
  productId: string
  product: string
  imageUrl?: string
  size?: string
  colour?: string
  sku: string
  price: number
  stock: number
  active: boolean
}

const LOW = 5

function stockBadge(stock: number) {
  if (stock === 0) return <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium whitespace-nowrap">Out of Stock</span>
  if (stock <= LOW) return <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium whitespace-nowrap">Low Stock</span>
  return <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-green-100 text-green-800 font-medium whitespace-nowrap">In Stock</span>
}

export default function AdminInventoryPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [savingId, setSavingId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'low' | 'out'>('all')

  function load() {
    setLoading(true)
    productsApi.getAll({ limit: 200, include_inactive: 'true' } as any)
      .then((res) => {
        const flat: Row[] = []
        for (const p of (res as any).data || []) {
          const primaryImg = (p.product_images || []).find((img: any) => img.is_primary)?.url
            || (p.product_images || [])[0]?.url
          for (const v of p.product_variants || []) {
            flat.push({
              variantId: v.id, productId: p.id, product: p.name,
              imageUrl: primaryImg,
              size: v.size, colour: v.colour,
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
    } catch { /* keep draft */ } finally { setSavingId(null) }
  }

  const filtered = rows.filter(r => {
    const matchSearch = !search || r.product.toLowerCase().includes(search.toLowerCase()) || r.sku.toLowerCase().includes(search.toLowerCase())
    const matchStock = stockFilter === 'all' ||
      (stockFilter === 'out' && r.stock === 0) ||
      (stockFilter === 'low' && r.stock > 0 && r.stock <= LOW) ||
      (stockFilter === 'in' && r.stock > LOW)
    return matchSearch && matchStock
  })

  const totalProducts = new Set(rows.map(r => r.productId)).size
  const outOfStock = rows.filter(r => r.stock === 0).length
  const lowStock = rows.filter(r => r.stock > 0 && r.stock <= LOW).length
  const totalSKU = rows.length

  return (
    <>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div>
          <h1 className="font-serif text-2xl md:text-3xl text-[#0a0a0a]">Inventory Management</h1>
          <p className="text-sm text-[#6b6b6b] mt-1">{totalSKU} SKUs across {totalProducts} products</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Products in Stock', value: totalProducts, icon: '📦', color: 'bg-blue-50 text-blue-700' },
          { label: 'Low Stock Alert', value: lowStock, icon: '⚠️', color: 'bg-amber-50 text-amber-700' },
          { label: 'Out of Stock', value: outOfStock, icon: '🚫', color: 'bg-red-50 text-red-700' },
          { label: 'Total SKUs', value: totalSKU, icon: '🏷️', color: 'bg-green-50 text-green-700' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className={`${color} rounded-lg p-4 border border-current/10`}>
            <p className="text-xs font-sans opacity-70 mb-1">{label}</p>
            <div className="flex items-center gap-2">
              <span className="text-lg">{icon}</span>
              <span className="text-2xl font-serif font-semibold">{value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          type="text"
          placeholder="Search product or SKU…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a] min-w-[220px]"
        />
        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value as any)}
          className="text-sm border border-[#e8e4e0] px-3 py-2 bg-white text-[#0a0a0a] focus:outline-none focus:border-[#0a0a0a]"
        >
          <option value="all">All Stock Levels</option>
          <option value="in">In Stock</option>
          <option value="low">Low Stock (≤{LOW})</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0] overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0] bg-[#faf8f5]">
                <th className="px-4 py-3">Product Image</th>
                <th className="px-4 py-3">Product Name</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Stock Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => {
                const draft = drafts[r.variantId]
                const changed = draft !== undefined && draft !== String(r.stock)
                return (
                  <tr key={r.variantId} className="border-b border-[#f0ece8] last:border-0 hover:bg-[#faf8f5] transition-colors">
                    <td className="px-4 py-3">
                      {r.imageUrl ? (
                        <div className="w-12 h-12 relative border border-[#f0ece8] overflow-hidden rounded">
                          <Image src={r.imageUrl} alt={r.product} fill className="object-cover" sizes="48px" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-[#f0ece8] rounded flex items-center justify-center text-[#9a9a9a] text-xs">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0a0a0a] max-w-[180px] truncate">{r.product}</td>
                    <td className="px-4 py-3 text-[#6b6b6b] font-mono text-xs">{r.sku}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{[r.size, r.colour].filter(Boolean).join(' / ') || '—'}</td>
                    <td className="px-4 py-3 text-[#0a0a0a]">{formatPrice(r.price)}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="0"
                        value={draft ?? String(r.stock)}
                        onChange={(e) => setDrafts((d) => ({ ...d, [r.variantId]: e.target.value }))}
                        className={`w-20 border px-2 py-1 text-sm focus:outline-none ${r.stock <= LOW ? 'border-amber-400 bg-amber-50' : 'border-[#e8e4e0]'}`}
                      />
                    </td>
                    <td className="px-4 py-3">{stockBadge(r.stock)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => saveStock(r)}
                        disabled={!changed || savingId === r.variantId}
                        className="text-[11px] uppercase tracking-widest px-3 py-1.5 bg-[#0a0a0a] text-white hover:bg-[#333] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        {savingId === r.variantId ? 'Saving…' : 'Update'}
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!filtered.length && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-[#6b6b6b]">No variants match your filters</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
