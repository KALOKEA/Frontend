'use client'
import { useRouter, useSearchParams } from 'next/navigation'

interface PaginationProps {
  total: number
  page: number
  limit: number
}

export default function Pagination({ total, page, limit }: PaginationProps) {
  const router = useRouter()
  const params = useSearchParams()
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  const goTo = (p: number) => {
    const sp = new URLSearchParams(params.toString())
    sp.set('page', String(p))
    router.push(`/shop?${sp.toString()}`)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12">
      {page > 1 && (
        <button onClick={() => goTo(page - 1)} className="w-9 h-9 border border-[#e8e4e0] text-xs font-sans text-[#0a0a0a] hover:border-[#0a0a0a]">←</button>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`w-9 h-9 border text-xs font-sans transition-colors ${p === page ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : 'border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a]'}`}
        >
          {p}
        </button>
      ))}
      {page < totalPages && (
        <button onClick={() => goTo(page + 1)} className="w-9 h-9 border border-[#e8e4e0] text-xs font-sans text-[#0a0a0a] hover:border-[#0a0a0a]">→</button>
      )}
    </div>
  )
}
