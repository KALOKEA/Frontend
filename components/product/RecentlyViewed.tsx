'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useRecentlyViewed } from '@/lib/hooks/useRecentlyViewed'
import { formatPrice } from '@/lib/utils/formatPrice'

interface Props {
  excludeId?: string
}

export default function RecentlyViewed({ excludeId }: Props) {
  const items = useRecentlyViewed(excludeId)

  if (!items.length) return null

  return (
    <section className="py-12 border-t border-[#e8e4e0]">
      <h3 className="font-serif text-2xl text-[#0a0a0a] mb-8 text-center">Recently Viewed</h3>
      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-none">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/product/${item.slug}/`}
            className="flex-shrink-0 w-36 md:w-44 snap-start group"
          >
            <div className="aspect-[3/4] bg-[#f4f2ef] overflow-hidden mb-2 relative">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 144px, 176px"
                />
              ) : (
                <div className="w-full h-full bg-[#f0ece8]" />
              )}
            </div>
            <p className="text-xs font-sans text-[#0a0a0a] truncate">{item.name}</p>
            <p className="text-xs font-sans text-[#6b6b6b] mt-0.5">{formatPrice(item.base_price)}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
