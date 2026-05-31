import Link from 'next/link'

interface BreadcrumbItem { label: string; href?: string }

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-2 text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">
      <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span>/</span>
          {item.href ? (
            <Link href={item.href} className="hover:text-[#0a0a0a]">{item.label}</Link>
          ) : (
            <span className="text-[#0a0a0a]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
