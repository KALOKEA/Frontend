'use client'
import { useEffect, useState } from 'react'
import { addressesApi, type Address } from '@/lib/api/addresses'
import { useToast } from '@/components/ui/Toast'
import AddressForm from '@/components/checkout/AddressForm'
import Spinner from '@/components/ui/Spinner'

export default function AddressesPage() {
  const { toast } = useToast()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)

  useEffect(() => {
    addressesApi.getAll().then(setAddresses).finally(() => setLoading(false))
  }, [])

  const remove = async (id: string) => {
    try {
      await addressesApi.remove(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
      toast('Address removed')
    } catch {
      toast('Failed to delete address', 'error')
    }
  }

  if (loading) return <div className="flex justify-center py-16"><Spinner /></div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl text-[#0a0a0a]">My Addresses</h2>
        <button onClick={() => setAdding(true)} className="text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] underline hover:text-[#7C4A2D]">
          + Add New
        </button>
      </div>

      {adding && (
        <div className="border border-[#e8e4e0] p-6 mb-6">
          <AddressForm
            onSaved={(addr) => { setAddresses((prev) => [...prev, addr]); setAdding(false) }}
            onCancel={() => setAdding(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div key={addr.id} className="border border-[#e8e4e0] p-4 relative">
            {addr.is_default && (
              <span className="text-[9px] font-sans tracking-widest uppercase text-[#7C4A2D] mb-2 block">Default</span>
            )}
            <p className="text-sm font-sans font-medium text-[#0a0a0a]">{addr.name}</p>
            <p className="text-xs font-sans text-[#6b6b6b] mt-1">
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}<br />
              {addr.city}, {addr.state} – {addr.pincode}<br />
              {addr.phone}
            </p>
            <div className="flex gap-3 mt-3">
              {!addr.is_default && (
                <button onClick={() => addressesApi.setDefault(addr.id).then(() => setAddresses((prev) => prev.map((a) => ({ ...a, is_default: a.id === addr.id })))).catch(() => toast('Failed to set default', 'error'))} className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#0a0a0a] underline">
                  Set Default
                </button>
              )}
              <button onClick={() => remove(addr.id)} className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-red-500 underline">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
