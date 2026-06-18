interface SkeletonProps {
  className?: string
  /** Height in Tailwind units, e.g. "h-48". Defaults to "h-4". */
  height?: string
  /** Width in Tailwind units, e.g. "w-full". Defaults to "w-full". */
  width?: string
}

/** Animated shimmer placeholder. Use while async data is loading. */
export default function Skeleton({ className = '', height = 'h-4', width = 'w-full' }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`${height} ${width} bg-[#e8e4e0] rounded animate-pulse overflow-hidden relative ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent" />
    </div>
  )
}

/** A product card skeleton — matches ProductCard aspect ratio. */
export function ProductCardSkeleton() {
  return (
    <div className="group relative">
      <Skeleton height="aspect-[3/4]" className="aspect-[3/4] h-auto" />
      <div className="pt-3 space-y-2">
        <Skeleton height="h-2.5" width="w-1/3" />
        <Skeleton height="h-4" width="w-4/5" />
        <Skeleton height="h-3.5" width="w-1/4" />
      </div>
    </div>
  )
}

/** Grid of product card skeletons for loading states. */
export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
