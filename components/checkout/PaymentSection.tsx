'use client'

interface PaymentSectionProps {
  selected: string
  onSelect: (method: string) => void
}

const METHODS = [
  { value: 'upi', label: 'UPI / QR Code', icon: '📱' },
  { value: 'card', label: 'Debit / Credit Card', icon: '💳' },
  { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { value: 'wallet', label: 'Wallet', icon: '👛' },
  { value: 'cod', label: 'Cash on Delivery (+₹49)', icon: '📦' },
]

export default function PaymentSection({ selected, onSelect }: PaymentSectionProps) {
  return (
    <div className="space-y-2">
      {METHODS.map((m) => (
        <label key={m.value} className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${selected === m.value ? 'border-[#0a0a0a]' : 'border-[#e8e4e0] hover:border-[#0a0a0a]'}`}>
          <input
            type="radio"
            name="payment"
            value={m.value}
            checked={selected === m.value}
            onChange={() => onSelect(m.value)}
            className="accent-[#c8a4a5]"
          />
          <span className="text-sm">{m.icon}</span>
          <span className="text-xs font-sans text-[#0a0a0a]">{m.label}</span>
        </label>
      ))}
      {selected !== 'cod' && (
        <p className="text-[10px] font-sans text-[#6b6b6b] mt-2">
          You will be redirected to Razorpay&apos;s secure payment gateway.
        </p>
      )}
    </div>
  )
}
