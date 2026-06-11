import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'About Us | Kalokea',
  description: "Kalokea is a women's fashion brand celebrating confidence, elegance, and individuality.",
}

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
