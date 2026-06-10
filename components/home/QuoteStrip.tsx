// Matches reference .tagline-section exactly:
// — padding:80px var(--gutter)=52px; text-align:center; background:var(--ivory)=#F9F6F2
// — .tagline: serif clamp(1.6rem,3vw,2.8rem) weight:300 lineHeight:1.4 color:#0A0806 maxWidth:780 centered
// — em: color:var(--brown)=#7C4A2D; font-style:italic
// — NO ornament, NO author attribution — static hardcoded text matching reference HTML exactly

export default function QuoteStrip() {
  return (
    <div
      className="reveal"
      style={{
        padding: '80px 52px',
        textAlign: 'center',
        background: '#F9F6F2',
      }}
    >
      <p
        className="font-serif"
        style={{
          fontSize: 'clamp(1.6rem, 3vw, 2.8rem)',
          fontWeight: 300,
          lineHeight: 1.4,
          color: '#0A0806',
          maxWidth: 780,
          margin: '0 auto',
        }}
      >
        &ldquo;Fashion is the armor to survive the reality of everyday life &mdash;{' '}
        <em style={{ color: '#7C4A2D', fontStyle: 'italic' }}>make it yours.</em>&rdquo;
      </p>
    </div>
  )
}
