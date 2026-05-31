import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center text-center px-4">
      <div>
        <p className="font-serif text-8xl text-[#e8e4e0] mb-4">404</p>
        <h1 className="font-serif text-3xl text-[#0a0a0a] mb-2">Page Not Found</h1>
        <p className="text-sm font-sans text-[#6b6b6b] mb-8">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="bg-[#0a0a0a] text-white text-[11px] font-sans tracking-widest uppercase px-6 py-3 hover:bg-[#2a2a2a]">
          Go Home
        </Link>
      </div>
    </div>
  )
}
