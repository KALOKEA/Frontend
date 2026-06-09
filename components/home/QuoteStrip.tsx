export default function QuoteStrip() {
  return (
    <section className="py-20 px-4 bg-[#FDFAF6] text-center">
      <div className="max-w-3xl mx-auto">
        {/* Ornament */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-12 h-px bg-[#E0D4C4]" />
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M7 0L8.57 5.18H14L9.71 8.38L11.28 13.56L7 10.36L2.72 13.56L4.29 8.38L0 5.18H5.43L7 0Z" fill="#C4A882" />
          </svg>
          <div className="w-12 h-px bg-[#E0D4C4]" />
        </div>

        <blockquote
          className="font-serif font-light leading-relaxed text-[#0A0908]"
          style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)' }}
        >
          &ldquo;Fashion is the armour to survive the reality of everyday life &mdash;{' '}
          <em className="italic" style={{ color: '#7C4A2D' }}>make it yours.</em>&rdquo;
        </blockquote>

        <p className="mt-6 text-[10px] font-sans tracking-[0.25em] uppercase text-[#9B8F87]">
          The KALOKEA Ethos
        </p>
      </div>
    </section>
  )
}
