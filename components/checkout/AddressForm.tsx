'use client'
import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { addressesApi, type Address } from '@/lib/api/addresses'
import { useToast } from '@/components/ui/Toast'

interface AddressFormProps {
  onSaved: (address: Address) => void
  onCancel?: () => void
}

export default function AddressForm({ onSaved, onCancel }: AddressFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', line1: '', line2: '', city: '', state: '', pincode: '' })

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const addr = await addressesApi.create(form)
      onSaved(addr)
      toast('Address saved')
    } catch {
      toast('Failed to save address', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" value={form.name} onChange={set('name')} required />
        <Input label="Phone" value={form.phone} onChange={set('phone')} type="tel" required />
      </div>
      <Input label="Address Line 1" value={form.line1} onChange={set('line1')} required />
      <Input label="Address Line 2 (Optional)" value={form.line2} onChange={set('line2')} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input label="City" value={form.city} onChange={set('city')} required />
        <Input label="State" value={form.state} onChange={set('state')} required />
        <Input label="Pincode" value={form.pincode} onChange={set('pincode')} inputMode="numeric" required />
      </div>
      <div className="flex gap-3">
        <Button type="submit" loading={loading}>Save Address</Button>
        {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>}
 