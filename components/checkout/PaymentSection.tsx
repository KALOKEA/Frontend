'use client'

interface PaymentSectionProps {
  selected: string
  onSelect: (method: string) => void
  /** COD surcharge in rupees (int). Displayed next to the COD option. Defaults to 49. */
  codFeeRupees?: number
}

// UPI, Card, Net Banking and Wallet all open Razorpay's hosted checkout modal —
// Razorpay presents the appropriate payment UI based on the method selected.
// COD is handled entirely by Kalokea (no Razorpay involved).
const ONLINE_METHODS = [
  { value: 'upi', label: 'UPI / QR Code', icon: '📱' },
  { value: 'card', label: 'Debit / Credit Card', icon: '💳' },
  { value: 'netbanking', label: 'Net Banking', icon: '🏦' },
  { value: 'wallet', label: 'Wallets (Paytm, PhonePe…)', icon: '👛' },
]

const isOnline = (v: string) => ONLINE_METHODS.some((m) => m.value === v)

export default function PaymentSection({ selected, onSelect, codFeeRupees = 49 }: PaymentSectionProps) {
  const onlineSelected = isOnline(selected)

  return (
    <div className="space-y-3">

      {/* ── Online payment block ───────────────────────────────────────── */}
      <div className={`border transition-colors ${onlineSelected ? 'border-[#0a0a0a]' : 'border-[#e8e4e0]'}`}>
        {/* Header — clicking selects the last-used or first online method */}
        <button
          type="button"
          onClick={() => { if (!onlineSelected) onSelect('upi') }}
          className="w-full flex items-center gap-3 px-4 py-3 text-left"
        >
          <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
            onlineSelected ? 'border-[#0a0a0a]' : 'border-[#d0ccc8]'
          }`}>
            {onlineSelected && <span className="w-2 h-2 rounded-full bg-[#0a0a0a]" />}
          </span>
          <span className="text-xs font-medium font-sans text-[#0a0a0a] tracking-wide">
            Pay Online via Razorpay
          </span>
          <span className="ml-auto">
            <img
              src="https://razorpay.com/assets/razorpay-glyph.svg"
              alt="Razorpay"
              className="h-4 w-auto opacity-50"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          </span>
        </button>

        {/* Method sub-options — shown when online is selected */}
        {onlineSelected && (
          <div className="border-t border-[#f0ece8] px-4 pb-3 pt-2 space-y-1">
            {ONLINE_METHODS.map((m) => (
              <label
                key={m.value}
                className={`flex items-center gap-3 px-3 py-2 cursor-pointer rounded transition-colors ${
                  selected === m.value ? 'bg-[#faf8f5]' : 'hover:bg-[#faf8f5]'
                }`}
              >
                <input
                  type="radio"
                  name="payment_sub"
                  value={m.value}
                  checked={selected === m.value}
                  onChange={() => onSelect(m.value)}
                  className="accent-[#7C4A2D]"
                />
                <span className="text-sm">{m.icon}</span>
                <span className="text-xs font-sans text-[#0a0a0a]">{m.label}</span>
              </label>
            ))}
            <p className="text-[10px] font-sans text-[#9b9b9b] pt-1 leading-relaxed">
              You will be taken to Razorpay&apos;s secure payment page.
              Your card or bank details are handled directly by Razorpay — Kalokea never sees them.
            </p>
          </div>
        )}
      </div>

      {/* ── COD ───────────────────────────────────────────────────────── */}
      <label className={`flex items-center gap-3 border p-4 cursor-pointer transition-colors ${
        selected === 'cod' ? 'border-[#0a0a0a]' : 'border-[#e8e4e0] hover:border-[#0a0a0a]'
      }`}>
        <input
          type="radio"
          name="payment"
          value="cod"
          checked={selected === 'cod'}
          onChange={() => onSelect('cod')}
          className="accent-[#7C4A2D]"
        />
        <span className="text-sm">📦</span>
        <span className="text-xs font-sans text-[#0a0a0a]">Cash on Delivery</span>
        <span className="ml-auto text-[10px] font-sans text-[#9b9b9b]">+₹{codFeeRupees} fee</span>
      </label>

    </div>
  )
}
