import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-[11px] uppercase tracking-widest text-[#6b6b6b] font-sans">{label}</label>}
    <input
      ref={ref}
      className={`w-full border border-[#e8e4e0] bg-white px-4 py-3 text-base font-sans text-[#0a0a0a] outline-none focus:border-[#0a0a0a] transition-colors placeholder:text-[#6b6b6b] min-h-[44px] ${error ? 'border-red-400' : ''} ${className}`}
      {...props}
    />
    {error && <p className="text-[11px] text-red-500 font-sans">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input
