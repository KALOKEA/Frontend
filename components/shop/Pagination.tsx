'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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
    router.push(`/shop/?${sp.toString()}`)
  }

  // Build truncated page list: always show first, last, current±2, and ellipsis
  const pageNums: (number | '…')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || (p >= page - 2 && p <= page + 2)) {
      pageNums.push(p)
    } else if (pageNums[pageNums.length - 1] !== '…') {
      pageNums.push('…')
    }
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-12" role="navigation" aria-label="Pagination">
      {page > 1 && (
        <button onClick={() => goTo(page - 1)} aria-label="Previous page" className="w-11 h-11 border border-[#e8e4e0] flex items-center justify-center text-[#0a0a0a] hover:border-[#0a0a0a]"><ChevronLeft size={16} /></button>
      )}
      {pageNums.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-11 h-11 flex items-center justify-center text-xs text-[#6b6b6b]">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={`w-11 h-11 border text-xs font-sans transition-colors ${p === page ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white' : 'border-[#e8e4e0] text-[#0a0a0a] hover:border-[#0a0a0a]'}`}
          >
            {p}
          </button>
        )
      )}
      {page < totalPages && (
        <button onClick={() => goTo(page + 1)} aria-label="Next page" className="w-11 h-11 border border-[#e8e4e0] flex items-center justify-center text-[#0a0a0a] hover:border-[#0a0a0a]"><ChevronRight size={16} /></button>
      )}
    </div>
  )
}
