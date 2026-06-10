// Matches reference .testimonials exactly:
// — background:#1E1208 (var(--dark)); padding:80px 0
// — section header CENTERED: justify-content:center;text-align:center;flex-direction:column;gap:8px
// — section-label: color:#C49070 (var(--brown-lt)) — inline style overrides
// — section-title: color:#FFFFFF — inline style overrides
// — testi-grid: repeat(3,1fr) gap:24px
// — testi-card: background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
//               border-radius:6px; padding:32px 28px
// — testi-stars: display:flex; gap:3px; margin-bottom:16px
//               svg: 13px×13px; fill:#C49070; stroke:none
// — testi-text: serif 1rem weight:300 color:rgba(255,255,255,.75) lineHeight:1.7 italic margin-bottom:20px
// — testi-author: .78rem weight:600 tracking:.08em uppercase color:#C49070
// — testi-location: .72rem color:rgba(255,255,255,.3) margin-top:2px

const TESTIMONIALS = [
  {
    text: "The Aurelia Dress is everything I dreamed of. The fabric is unbelievably soft and the cut is absolutely perfect. Got so many compliments at my cousin's wedding!",
    author: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
  },
  {
    text: 'Ordered the linen co-ord and honestly it exceeded my expectations. The quality is on par with international brands at a fraction of the price. KALOKEA forever!',
    author: 'Ananya Reddy',
    location: 'Bengaluru, Karnataka',
    rating: 5,
  },
  {
    text: "I was hesitant to buy online but the return policy put my mind at ease. The Rhea Tote arrived beautifully packaged and it's gorgeous. Delivery was 2 days — incredibly fast!",
    author: 'Meera Nair',
    location: 'Delhi, NCR',
    rating: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          style={{ width: 13, height: 13, fill: i < count ? '#C49070' : 'none', stroke: 'none' }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section style={{ background: '#1E1208', padding: '80px 0' }}>
      <div className="k-container">

        {/* Header — CENTERED per reference inline style */}
        <div
          className="reveal"
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            marginBottom: 40,
          }}
        >
          <span
            style={{
              fontSize: '.72rem',
              fontWeight: 600,
              letterSpacing: '.2em',
              textTransform: 'uppercase',
              color: '#C49070',
              display: 'block',
            }}
          >
            Real Stories
          </span>
          <h2
            className="font-serif"
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              color: '#FFFFFF',
            }}
          >
            What She <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Says</em>
          </h2>
        </div>

        {/* Cards — testi-grid: repeat(3,1fr) gap:24px */}
        <div className="k-testi-grid">
          {TESTIMONIALS.map(({ text, author, location, rating }) => (
            <div
              key={author}
              className="reveal"
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.08)',
                borderRadius: 6,
                padding: '32px 28px',
              }}
            >
              <StarRow count={rating} />
              <p
                className="font-serif"
                style={{
                  fontSize: '1rem',
                  fontWeight: 300,
                  color: 'rgba(255,255,255,.75)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                  marginBottom: 20,
                }}
              >
                &ldquo;{text}&rdquo;
              </p>
              <div
                style={{
                  fontSize: '.78rem',
                  fontWeight: 600,
                  letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: '#C49070',
                }}
              >
                {author}
              </div>
              <div
                style={{
                  fontSize: '.72rem',
                  color: 'rgba(255,255,255,.3)',
                  marginTop: 2,
                }}
              >
                {location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
