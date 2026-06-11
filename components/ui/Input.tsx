import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

// Generate a stable HTML id from a label string when no explicit id is given.
// WCAG 1.3.1 (Info and Relationships, Level A) requires labels to be
// programmatically associated with their inputs via htmlFor/id.
function labelToId(label: string): string {
  return 'input-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className = '', ...props }, ref) => {
  const inputId = id || (label ? labelToId(label) : undefined)
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-[11px] uppercase tracking-widest text-[#6b6b6b] font-sans">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`w-full border border-[#e8e4e0] bg-white px-4 py-3 text-base font-sans text-[#0a0a0a] outline-none focus:border-[#0a0a0a] transition-colors placeholder:text-[#6b6b6b] min-h-[44px] ${error ? 'border-red-400' : ''} ${className}`}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={error ? true : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} role="alert" className="text-[11px] text-red-500 font-sans">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
