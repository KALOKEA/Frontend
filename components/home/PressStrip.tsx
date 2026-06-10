// Matches reference .press exactly:
// — padding:40px var(--gutter)=52px; border-top & border-bottom:1px solid #F0EAE1; bg:#FFFFFF
// — press-inner: display:flex; justify-content:space-between; gap:32px; flex-wrap:wrap; max-width:1380; margin:0 auto
// — press-label: .68rem; weight:700; tracking:.2em; uppercase; color:#B5A89E (var(--muted-lt)); white-space:nowrap
// — press-logos: display:flex; align-items:center; gap:40px; flex-wrap:wrap
// — press-logo: serif 1.15rem weight:600 color:#B5A89E tracking:.06em; hover:color:#7C4A2D (var(--brown))
// — ALL logos UNIFORM — no per-logo size/style variation

const LOGOS = ['Vogue India', 'Elle', "Harper's Bazaar", 'Femina', 'Grazia']

export default function PressStrip() {
  return (
    <div className="k-press-wrap">
      <div className="k-press-inner">
        {/* Label */}
        <span
          style={{
            fontSize: '.68rem',
            fontWeight: 700,
            letterSpacing: '.2em',
            textTransform: 'uppercase',
            color: '#B5A89E',
            whiteSpace: 'nowrap',
          }}
        >
          As Seen In
        </span>

        {/* Logos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          {LOGOS.map(name => (
            <span
              key={name}
              className="font-serif"
              style={{
                fontSize: '1.15rem',
                fontWeight: 600,
                color: '#B5A89E',
                letterSpacing: '.06em',
                transition: 'color .2s',
                cursor: 'pointer',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#7C4A2D' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#B5A89E' }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
