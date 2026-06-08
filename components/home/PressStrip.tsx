const PRESS = [
  { name: 'Vogue',         style: { fontStyle: 'italic', letterSpacing: '0.04em', fontSize: '1.4rem' } },
  { name: 'Elle',          style: { fontStyle: 'normal', letterSpacing: '0.3em',  fontSize: '1.2rem' } },
  { name: "Harper's Bazaar", style: { fontStyle: 'normal', letterSpacing: '0.08em', fontSize: '0.95rem' } },
  { name: 'Grazia',        style: { fontStyle: 'italic', letterSpacing: '0.06em', fontSize: '1.25rem' } },
  { name: 'Femina',        style: { fontStyle: 'normal', letterSpacing: '0.18em', fontSize: '1.1rem' } },
]

export default function PressStrip() {
  return (
    <section className="bg-[#1A1612] py-14 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Eyebrow */}
        <p className="text-center text-[9px] font-sans tracking-[0.3em] uppercase text-[#4A4040] mb-10">
          As Seen In
        </p>

        {/* Logos row */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {PRESS.map(({ name, style }) => (
            <span
              key={name}
              className="font-serif font-light text-[#6B5E55] hover:text-[#C4A882] transition-colors duration-300 cursor-default select-none"
              style={style}
              aria-label={name}
            >
              {name}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-12">
          <div className="flex-1 h-px bg-[#2A2220]" />
          <span className="text-[#3A3230] text-[10px] font-sans tracking-widest uppercase">Featured Coverage</span>
          <div className="flex-1 h-px bg-[#2A2220]" />
        </div>
      </div>
    </section>
  )
}
