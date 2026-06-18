'use client'
import { useState } from 'react'
import type { Address } from '@/lib/api/addresses'
import AddressForm from './AddressForm'

interface AddressSelectorProps {
  addresses: Address[]
  selected: string | null
  onSelect: (id: string) => void
  onNewAddress: (address: Address) => void
}

export default function AddressSelector({ addresses, selected, onSelect, onNewAddress }: AddressSelectorProps) {
  const [addingNew, setAddingNew] = useState(false)

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <label
          key={addr.id}
          className={`flex items-start gap-3 border p-4 cursor-pointer transition-colors ${selected === addr.id ? 'border-[#0a0a0a]' : 'border-[#e8e4e0] hover:border-[#0a0a0a]'}`}
        >
          <input
            type="radio"
            name="address"
            checked={selected === addr.id}
            onChange={() => onSelect(addr.id)}
            className="mt-1 accent-[#7C4A2D]"
          />
          <div>
            <p className="text-xs font-sans font-medium text-[#0a0a0a]">{addr.name} · {addr.phone}</p>
            <p className="text-xs font-sans text-[#6b6b6b] mt-0.5">
              {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} – {addr.pincode}
            </p>
            {addr.is_default && (
              <span className="text-[9px] font-sans tracking-widest uppercase text-[#7C4A2D]">Default</span>
            )}
          </div>
        </label>
      ))}

      {addingNew ? (
        <div className="border border-[#e8e4e0] p-4">
          <AddressForm
            onSaved={(addr) => { onNewAddress(addr); setAddingNew(false) }}
            onCancel={() => setAddingNew(false)}
          />
        </div>
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] underline hover:text-[#7C4A2D] py-3 inline-block"
        >
          + Add New Address
        </button>
      )}
    </div>
  )
}
