import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Kalokea',
  description: 'Kalokea is a women\'s fashion brand celebrating confidence, elegance, and individuality.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#c8a4a5] mb-3">Our Story</p>
      <h1 className="font-serif text-4xl md:text-5xl text-[#0a0a0a] mb-8">Made for Women Who Choose Themselves</h1>

      <div className="space-y-6 text-sm font-sans text-[#6b6b6b] leading-loose">
        <p>
          Kalokea was born from a simple belief: every woman deserves to wear something that makes her feel seen,
          celebrated, and entirely herself. We design fashion that speaks before you do — bold without being loud,
          elegant without being out of reach.
        </p>
        <p>
          Founded in India, Kalokea works with skilled artisans and ethical manufacturers to bring you quality
          that lasts and styles that transcend trends. We believe fashion should be both beautiful and responsible.
        </p>
        <p>
          From our dresses to our accessories, every piece is designed with one question in mind: does this make
          her feel unstoppable? If the answer is yes, it earns its place in our collection.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-[#e8e4e0]">
        {[
          ['2024', 'Founded'],
          ['10,000+', 'Happy Customers'],
          ['100%', 'Made in India'],
        ].map(([val, label]) => (
          <div key={label} className="text-center">
            <p className="font-serif text-3xl text-[#0a0a0a] mb-1">{val}</p>
            <p className="text-[10px] font-sans tracking-widest uppercase text-[#6b6b6b]">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
