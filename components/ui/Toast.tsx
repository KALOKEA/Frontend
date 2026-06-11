'use client'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'

interface Toast { id: string; message: string; type: 'success' | 'error' | 'info' }
interface ToastCtx { toast: (msg: string, type?: Toast['type']) => void }

const ToastContext = createContext<ToastCtx>({ toast: () => {} })

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* aria-live="polite" announces toasts to screen readers when they appear.
          role="status" marks this as a status region (WCAG 4.1.3, Level AA).
          Using "assertive" only for errors so they interrupt immediately. */}
      <div
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role={t.type === 'error' ? 'alert' : 'status'}
            aria-live={t.type === 'error' ? 'assertive' : 'polite'}
            aria-atomic="true"
            className={`px-4 py-3 rounded text-sm text-white shadow-lg transition-all ${
              t.type === 'error' ? 'bg-red-600' : t.type === 'info' ? 'bg-[#6b6b6b]' : 'bg-[#0a0a0a]'
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
