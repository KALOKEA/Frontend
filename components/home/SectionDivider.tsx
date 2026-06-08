import React from 'react'

interface SectionDividerProps {
  symbol?: string
  className?: string
}

export default function SectionDivider({ symbol = '✦', className = '' }: SectionDividerProps) {
  return (
    <div className={`ornament-divider my-2 text-[#c8a4a5] text-[10px] tracking-[0.3em] select-none ${className}`}>
      {symbol}
    </div>
  )
}
