interface BadgeProps {
  children: React.ReactNode
  variant?: 'sale' | 'new' | 'sold-out' | 'default'
  className?: string
}

export default function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    sale: 'bg-[#c8a4a5] text-white',
    new: 'bg-[#0a0a0a] text-white',
    'sold-out': 'bg-[#6b6b6b] text-white',
    default: 'bg-[#f4f2ef] text-[#0a0a0a]',
  }
  return (
    <span className={`inline-block px-2 py-0.5 text-[9px] font-sans tracking-widest uppercase ${variants[variant]} ${className}`}>
      {children}
    </span>
  )
}
