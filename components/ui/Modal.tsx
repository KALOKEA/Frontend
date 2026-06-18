'use client'
import { X } from 'lucide-react'
import { useEffect, useRef, ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function Modal({ open, onClose, children, title }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Scroll lock + focus management + Escape key
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    // Focus the dialog so screen readers announce it
    dialogRef.current?.focus()
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handler)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div aria-hidden="true" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className="relative bg-white max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto outline-none"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#e8e4e0]">
          {title && <h3 className="font-serif text-xl text-[#0a0a0a]">{title}</h3>}
          <button onClick={onClose} className="ml-auto text-[#6b6b6b] hover:text-[#0a0a0a] flex items-center justify-center" aria-label="Close"><X size={20} aria-hidden={true} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
