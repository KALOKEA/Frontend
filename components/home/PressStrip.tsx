const PRESS = [
  { name: 'Vogue India',      style: { fontStyle: 'italic', letterSpacing: '0.04em', fontSize: '1.4rem' } },
  { name: 'Elle',             style: { fontStyle: 'normal', letterSpacing: '0.3em',  fontSize: '1.2rem' } },
  { name: "Harper's Bazaar",  style: { fontStyle: 'normal', letterSpacing: '0.08em', fontSize: '0.95rem' } },
  { name: 'Femina',           style: { fontStyle: 'normal', letterSpacing: '0.18em', fontSize: '1.1rem' } },
  { name: 'Grazia',           style: { fontStyle: 'italic', letterSpacing: '0.06em', fontSize: '1.25rem' } },
]

export default function PressStrip() {
  return (
    <section
      className="py-10 px-4 sm:px-6 overflow-hidden"
      style={{ background: '#FFFFFF', borderTop: '1px solid #F0EAE1', borderBottom: '1px solid #F0EAE1' }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-8 flex-wrap">

        {/* Label — left */}
        <p className="text-[9px] font-sans tracking-[0.3em] uppercase text-[#9B8F87] shrink-0">
          As Seen In
        </p>

        {/* Logos — right */}
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4 sm:gap-x-14">
          {PRESS.map(({ name, style }) => (
            <span
              key={name}
              className="font-serif font-light text-[#9B8F87] hover:text-[#7C4A2D] transition-colors duration-300 cursor-default select-none"
              style={style}
              aria-label={name}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
