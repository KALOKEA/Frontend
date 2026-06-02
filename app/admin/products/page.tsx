'use client'
import { useEffect, useState } from 'react'
import { productsApi, type Product } from '@/lib/api/products'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

interface FormState {
  id?: string
  name: string
  slug: string
  description: string
  base_price: string // rupees in the input; converted to paise on save
  compare_price: string
  hsn_code: string
  gst_rate: string // percent; blank = use store default
  is_featured: boolean
  is_active: boolean
}

const empty: FormState = { name: '', slug: '', description: '', base_price: '', compare_price: '', hsn_code: '', gst_rate: '', is_featured: false, is_active: true }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  function load() {
    setLoading(true)
    productsApi.getAll({ limit: 100 })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openCreate() { setForm({ ...empty }); setMsg(null) }
  function openEdit(p: Product) {
    setForm({
      id: p.id, name: p.name, slug: p.slug, description: p.description || '',
      base_price: String(Math.round(p.base_price / 100)),
      compare_price: p.compare_price ? String(Math.round(p.compare_price / 100)) : '',
      hsn_code: p.hsn_code || '',
      gst_rate: p.gst_rate != null ? String(p.gst_rate) : '',
      is_featured: p.is_featured, is_active: p.is_active,
    })
    setMsg(null)
  }

  async function save() {
    if (!form) return
    setSaving(true); setMsg(null)
    // Money stored in paise everywhere (matches backend + Razorpay).
    const payload: Partial<Product> = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || undefined,
      base_price: Math.round(parseFloat(form.base_price || '0') * 100),
      compare_price: form.compare_price ? Math.round(parseFloat(form.compare_price) * 100) : undefined,
      hsn_code: form.hsn_code || undefined,
      gst_rate: form.gst_rate !== '' ? Number(form.gst_rate) : undefined,
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    try {
      if (form.id) await productsApi.update(form.id, payload)
      else await productsApi.create(payload)
      setForm(null)
      load()
    } catch (e: any) {
      setMsg(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function remove(p: Product) {
    if (!confirm(`Deactivate "${p.name}"? It will be hidden from the storefront.`)) return
    await productsApi.remove(p.id).catch(() => {})
    load()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-serif text-3xl text-[#0a0a0a]">Products</h1>
        <button onClick={openCreate} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white">+ New product</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <div className="bg-white border border-[#e8e4e0]">
          <table className="w-full text-sm font-sans">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-[#f0ece8] last:border-0">
                  <td className="px-4 py-3 font-medium text-[#0a0a0a]">{p.name}</td>
                  <td className="px-4 py-3">{formatPrice(p.base_price)}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{p.categories?.name || '—'}</td>
                  <td className="px-4 py-3 text-[#6b6b6b]">{p.product_variants?.length || 0}</td>
                  <td className="px-4 py-3">{p.is_featured ? '★' : '—'}</td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    <button onClick={() => openEdit(p)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-4">Edit</button>
                    <button onClick={() => remove(p)} className="text-[11px] uppercase tracking-widest text-red-600 hover:underline">Deactivate</button>
                  </td>
                </tr>
              ))}
              {!products.length && <tr><td colSpan={6} className="px-4 py-8 text-center text-[#6b6b6b]">No products</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-[11px] text-[#6b6b6b] mt-3">Variants (size/colour/stock) and images are managed per product — use the Inventory page for stock edits.</p>

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setForm(null)}>
          <div className="bg-white w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl mb-4">{form.id ? 'Edit product' : 'New product'}</h2>
            <Field label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="inp" /></Field>
            <Field label="Slug (auto from name if blank)"><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder={slugify(form.name)} className="inp" /></Field>
            <Field label="Description"><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="inp" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Price (₹, excl. GST)"><input type="number" value={form.base_price} onChange={(e) => setForm({ ...form, base_price: e.target.value })} className="inp" /></Field>
              <Field label="Compare price (₹)"><input type="number" value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} className="inp" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="HSN code"><input value={form.hsn_code} onChange={(e) => setForm({ ...form, hsn_code: e.target.value })} placeholder="e.g. 6109" className="inp" /></Field>
              <Field label="GST rate (%, blank = store default)"><input type="number" step="0.5" value={form.gst_rate} onChange={(e) => setForm({ ...form, gst_rate: e.target.value })} placeholder="5 / 12 / 18" className="inp" /></Field>
            </div>
            <p className="text-[11px] text-[#6b6b6b] -mt-1 mb-2">GST is added on top of the price at checkout. Apparel is usually 5% up to ₹1000 and 12% above — confirm HSN/rates with your CA.</p>
            <div className="flex gap-6 my-3 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>
            {msg && <p className="text-sm text-red-600 mb-3">{msg}</p>}
            <div className="flex gap-2 justify-end">
              <button onClick={() => setForm(null)} className="px-4 py-2 text-sm border border-[#e8e4e0]">Cancel</button>
              <button onClick={save} disabled={saving || !form.name || !form.base_price} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        :global(.inp) { width: 100%; border: 1px solid #e8e4e0; padding: 0.5rem 0.75rem; font-size: 0.875rem; }
      `}</style>
    </>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="block text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-1">{label}</label>
      {children}
    </div>
  )
}
