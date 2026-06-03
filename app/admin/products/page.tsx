'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { productsApi, type Product, type ProductImageRow, type ProductVariant } from '@/lib/api/products'
import { variantsApi } from '@/lib/api/variants'
import { uploadImage } from '@/lib/api/upload'
import Spinner from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils/formatPrice'

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

interface FormState {
  id?: string
  name: string
  slug: string
  description: string
  base_price: string
  compare_price: string
  hsn_code: string
  gst_rate: string
  is_featured: boolean
  is_active: boolean
}

const empty: FormState = { name: '', slug: '', description: '', base_price: '', compare_price: '', hsn_code: '', gst_rate: '', is_featured: false, is_active: true }

interface VariantDraft { size: string; colour: string; price: string; stock: string; sku: string }
const emptyVariant: VariantDraft = { size: '', colour: '', price: '', stock: '', sku: '' }

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<FormState | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // Media + variants (only meaningful once the product exists / form.id is set)
  const [images, setImages] = useState<ProductImageRow[]>([])
  const [variants, setVariants] = useState<ProductVariant[]>([])
  const [uploading, setUploading] = useState(false)
  const [vDraft, setVDraft] = useState<VariantDraft>(emptyVariant)
  const [vSaving, setVSaving] = useState(false)

  function load() {
    setLoading(true)
    productsApi.getAll({ limit: 100 })
      .then((res) => setProducts(res.data || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }
  useEffect(load, [])

  function openCreate() { setForm({ ...empty }); setImages([]); setVariants([]); setMsg(null) }
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
    loadMedia(p.id)
  }

  async function loadMedia(productId: string) {
    const [imgs, vars] = await Promise.all([
      productsApi.listImages(productId).catch(() => []),
      variantsApi.listByProduct(productId).catch(() => []),
    ])
    setImages(imgs)
    setVariants(vars)
  }

  async function save() {
    if (!form) return
    setSaving(true); setMsg(null)
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
      if (form.id) {
        await productsApi.update(form.id, payload)
        setMsg('Saved')
        load()
      } else {
        const created = await productsApi.create(payload)
        // Switch into edit mode so photos + variants can be added now.
        setForm((f) => f ? { ...f, id: created.id } : f)
        setImages([]); setVariants([])
        setMsg('Product created — now add photos and variants below, then close.')
        load()
      }
    } catch (e: any) {
      setMsg(e?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  async function onUpload(files: FileList | null) {
    if (!files || !form?.id) return
    setUploading(true); setMsg(null)
    try {
      for (const file of Array.from(files)) {
        const { url, public_id } = await uploadImage(file, 'products')
        await productsApi.addImage(form.id, { url, public_id })
      }
      await loadMedia(form.id)
    } catch (e: any) {
      setMsg(e?.message || 'Image upload failed (is Cloudinary configured on the server?)')
    } finally {
      setUploading(false)
    }
  }

  async function makePrimary(imageId: string) {
    await productsApi.setPrimaryImage(imageId).catch(() => {})
    if (form?.id) loadMedia(form.id)
  }
  async function removeImage(imageId: string) {
    await productsApi.deleteImage(imageId).catch(() => {})
    if (form?.id) loadMedia(form.id)
  }

  async function addVariant() {
    if (!form?.id) return
    if (vDraft.price === '' || vDraft.stock === '') { setMsg('Variant needs a price and stock'); return }
    setVSaving(true); setMsg(null)
    try {
      await variantsApi.create({
        product_id: form.id,
        size: vDraft.size || undefined,
        colour: vDraft.colour || undefined,
        price: Math.round(parseFloat(vDraft.price) * 100),
        stock: parseInt(vDraft.stock, 10),
        sku: vDraft.sku || undefined,
      })
      setVDraft(emptyVariant)
      await loadMedia(form.id)
    } catch (e: any) {
      setMsg(e?.message || 'Could not add variant')
    } finally {
      setVSaving(false)
    }
  }

  async function saveVariant(v: ProductVariant, stock: string, price: string) {
    await variantsApi.update(v.id, {
      stock: parseInt(stock, 10),
      price: Math.round(parseFloat(price) * 100),
    }).catch(() => {})
    if (form?.id) loadMedia(form.id)
  }
  async function removeVariant(id: string) {
    await variantsApi.remove(id).catch(() => {})
    if (form?.id) loadMedia(form.id)
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
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Variants</th>
                <th className="px-4 py-3">Photos</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const primary = p.product_images?.find((i) => i.is_primary)?.url || p.product_images?.[0]?.url
                return (
                  <tr key={p.id} className="border-b border-[#f0ece8] last:border-0">
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-12 bg-[#f0ece8] overflow-hidden">
                        {primary && <Image src={primary} alt={p.name} fill className="object-cover" sizes="40px" />}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-[#0a0a0a]">{p.name}</td>
                    <td className="px-4 py-3">{formatPrice(p.base_price)}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{p.categories?.name || '—'}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{p.product_variants?.length || 0}</td>
                    <td className="px-4 py-3 text-[#6b6b6b]">{p.product_images?.length || 0}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => openEdit(p)} className="text-[11px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-4">Edit</button>
                      <button onClick={() => remove(p)} className="text-[11px] uppercase tracking-widest text-red-600 hover:underline">Deactivate</button>
                    </td>
                  </tr>
                )
              })}
              {!products.length && <tr><td colSpan={7} className="px-4 py-8 text-center text-[#6b6b6b]">No products</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setForm(null)}>
          <div className="bg-white w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
            <div className="flex gap-6 my-3 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            </div>

            {msg && <p className="text-sm text-[#0a0a0a] bg-[#faf8f5] border border-[#e8e4e0] px-3 py-2 mb-3">{msg}</p>}

            <div className="flex gap-2 justify-end mb-2">
              <button onClick={() => { setForm(null); load() }} className="px-4 py-2 text-sm border border-[#e8e4e0]">Close</button>
              <button onClick={save} disabled={saving || !form.name || !form.base_price} className="px-4 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{saving ? 'Saving…' : form.id ? 'Save details' : 'Create & add media'}</button>
            </div>

            {!form.id && <p className="text-[11px] text-[#6b6b6b]">Save the product first, then photo &amp; variant tools appear.</p>}

            {form.id && (
              <>
                {/* ---- Photos ---- */}
                <div className="border-t border-[#e8e4e0] mt-4 pt-4">
                  <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Product photos</h3>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {images.map((img) => (
                      <div key={img.id} className="relative w-20 h-24 bg-[#f0ece8] overflow-hidden border border-[#e8e4e0] group">
                        <Image src={img.url} alt={img.alt_text || ''} fill className="object-cover" sizes="80px" />
                        {img.is_primary && <span className="absolute top-0 left-0 bg-[#0a0a0a] text-white text-[8px] px-1">PRIMARY</span>}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity">
                          {!img.is_primary && <button onClick={() => makePrimary(img.id)} className="text-white text-[9px] uppercase tracking-wide hover:underline">Set primary</button>}
                          <button onClick={() => removeImage(img.id)} className="text-red-300 text-[9px] uppercase tracking-wide hover:underline">Delete</button>
                        </div>
                      </div>
                    ))}
                    {!images.length && <p className="text-xs text-[#6b6b6b]">No photos yet.</p>}
                  </div>
                  <label className="inline-block px-4 py-2 text-sm border border-[#0a0a0a] cursor-pointer hover:bg-[#faf8f5]">
                    {uploading ? 'Uploading…' : '+ Upload photos'}
                    <input type="file" accept="image/jpeg,image/png,image/webp" multiple hidden disabled={uploading} onChange={(e) => onUpload(e.target.files)} />
                  </label>
                  <p className="text-[11px] text-[#6b6b6b] mt-2">JPEG/PNG/WebP, max 5MB each. First photo becomes the primary automatically.</p>
                </div>

                {/* ---- Variants ---- */}
                <div className="border-t border-[#e8e4e0] mt-4 pt-4">
                  <h3 className="text-[11px] uppercase tracking-widest text-[#6b6b6b] mb-3">Variants (size / colour / stock)</h3>
                  {variants.length > 0 && (
                    <table className="w-full text-sm mb-3">
                      <thead>
                        <tr className="text-left text-[10px] uppercase tracking-widest text-[#6b6b6b] border-b border-[#e8e4e0]">
                          <th className="py-2">Colour</th><th className="py-2">Size</th><th className="py-2">Price (₹)</th><th className="py-2">Stock</th><th className="py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {variants.map((v) => <VariantRow key={v.id} v={v} onSave={saveVariant} onDelete={removeVariant} />)}
                      </tbody>
                    </table>
                  )}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end">
                    <input value={vDraft.colour} onChange={(e) => setVDraft({ ...vDraft, colour: e.target.value })} placeholder="Colour" className="inp" />
                    <input value={vDraft.size} onChange={(e) => setVDraft({ ...vDraft, size: e.target.value })} placeholder="Size" className="inp" />
                    <input type="number" value={vDraft.price} onChange={(e) => setVDraft({ ...vDraft, price: e.target.value })} placeholder="Price ₹" className="inp" />
                    <input type="number" value={vDraft.stock} onChange={(e) => setVDraft({ ...vDraft, stock: e.target.value })} placeholder="Stock" className="inp" />
                    <button onClick={addVariant} disabled={vSaving} className="px-3 py-2 text-sm bg-[#0a0a0a] text-white disabled:opacity-50">{vSaving ? '…' : '+ Add'}</button>
                  </div>
                  <p className="text-[11px] text-[#6b6b6b] mt-2">A product needs at least one variant to be purchasable. Price is excl. GST.</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`:global(.inp){width:100%;border:1px solid #e8e4e0;padding:0.5rem 0.75rem;font-size:0.875rem;}`}</style>
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

function VariantRow({ v, onSave, onDelete }: { v: ProductVariant; onSave: (v: ProductVariant, stock: string, price: string) => void; onDelete: (id: string) => void }) {
  const [stock, setStock] = useState(String(v.stock))
  const [price, setPrice] = useState(String(Math.round(v.price / 100)))
  return (
    <tr className="border-b border-[#f0ece8] last:border-0">
      <td className="py-2 text-[#0a0a0a]">{v.colour || '—'}</td>
      <td className="py-2 text-[#0a0a0a]">{v.size || '—'}</td>
      <td className="py-2"><input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-20 border border-[#e8e4e0] px-2 py-1 text-sm" /></td>
      <td className="py-2"><input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-16 border border-[#e8e4e0] px-2 py-1 text-sm" /></td>
      <td className="py-2 text-right whitespace-nowrap">
        <button onClick={() => onSave(v, stock, price)} className="text-[10px] uppercase tracking-widest text-[#c8a4a5] hover:underline mr-3">Save</button>
        <button onClick={() => onDelete(v.id)} className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">Delete</button>
      </td>
    </tr>
  )
}
