'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import type { Product } from '@/lib/api/products'
import { productsApi } from '@/lib/api/products'
import { useToast } from '@/components/ui/Toast'
import { generateSlug } from '@/lib/utils/generateSlug'

interface ProductFormProps {
  product?: Product
  onSaved?: (p: Product) => void
}

export default function ProductForm({ product, onSaved }: ProductFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    base_price: product?.base_price ? String(product.base_price / 100) : '',
    compare_price: product?.compare_price ? String(product.compare_price / 100) : '',
    is_featured: product?.is_featured ?? false,
    is_active: product?.is_active ?? true,
  })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
    setForm((f) => ({
      ...f,
      [k]: value,
      ...(k === 'name' && !product ? { slug: generateSlug(e.target.value) } : {}),
    }))
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        ...form,
        base_price: Math.round(parseFloat(form.base_price) * 100),
        compare_price: form.compare_price ? Math.round(parseFloat(form.compare_price) * 100) : undefined,
      }
      const saved = product ? await productsApi.update(product.id, data) : await productsApi.create(data)
      toast(product ? 'Product updated' : 'Product created')
      onSaved?.(saved)
    } catch (err) {
      toast((err as Error).message || 'Failed to save', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      <Input label="Product Name" value={form.name} onChange={set('name')} required />
      <Input label="Slug (URL)" value={form.slug} onChange={set('slug')} required />
      <div>
        <label className="text-[11px] uppercase tracking-widest text-[#6b6b6b] font-sans block mb-1">Description</label>
        <textarea value={form.description} onChange={set('description')} rows={4} className="w-full border border-[#e8e4e0] px-4 py-3 text-sm font-sans outline-none focus:border-[#0a0a0a] resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price (₹)" value={form.base_price} onChange={set('base_price')} type="number" step="0.01" required />
        <Input label="Compare Price (₹)" value={form.compare_price} onChange={set('compare_price')} type="number" step="0.01" />
      </div>
      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-xs font-sans text-[#0a0a0a]">
          <input type="checkbox" checked={form.is_featured} onChange={set('is_featured')} className="accent-[#c8a4a5]" />
          Featured
        </label>
        <label className="flex items-center gap-2 text-xs font-sans text-[#0a0a0a]">
          <input type="checkbox" checked={form.is_active} onChange={set('is_active')} className="accent-[#c8a4a5]" />
          Active
        </label>
      </div>
      <Button type="submit" loading={loading}>{product ? 'Update Product' : 'Create Product'}</Button>
    </form>
  )
}
