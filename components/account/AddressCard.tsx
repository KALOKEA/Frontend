import type { Address } from '@/lib/api/addresses'

export default function AddressCard({ address, onDelete, onSetDefault }: {
  address: Address
  onDelete?: () => void
  onSetDefault?: () => void
}) {
  return (
    <div className="border border-[#e8e4e0] p-4">
      {address.is_default && (
        <span className="text-[9px] font-sans tracking-widest uppercase text-[#7C4A2D] mb-2 block">Default</span>
      )}
      <p className="text-sm font-sans font-medium text-[#0a0a0a]">{address.name}</p>
      <p className="text-xs font-sans text-[#6b6b6b] mt-1 leading-relaxed">
        {address.line1}{address.line2 ? `, ${address.line2}` : ''}<br/>
        {address.city}, {address.state} – {address.pincode}<br/>
        {address.phone}
      </p>
      <div className="flex gap-3 mt-3">
        {!address.is_default && onSetDefault && (
          <button onClick={onSetDefault} className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-[#0a0a0a] underline">
            Set Default
          </button>
        )}
        {onDelete && (
          <button onClick={onDelete} className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b] hover:text-red-500 underline">
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
