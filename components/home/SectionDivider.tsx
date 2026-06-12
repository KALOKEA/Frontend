import React from 'react'

interface SectionDividerProps {
  className?: string
}

export default function SectionDivider({ className = '' }: SectionDividerProps) {
  return (
    <div className={`ornament-divider my-2 flex items-center justify-center gap-2 select-none ${className}`}>
      <svg width="5" height="5" viewBox="0 0 5 5" fill="#7C4A2D"><circle cx="2.5" cy="2.5" r="2.5"/></svg>
      <svg width="5" height="5" viewBox="0 0 5 5" fill="#7C4A2D"><circle cx="2.5" cy="2.5" r="2.5"/></svg>
      <svg width="5" height="5" viewBox="0 0 5 5" fill="#7C4A2D"><circle cx="2.5" cy="2.5" r="2.5"/></svg>
    </div>
  )
}
