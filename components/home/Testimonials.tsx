const TESTIMONIALS = [
  {
    text: 'The Aurelia Dress is everything I dreamed of. The fabric is unbelievably soft and the cut is absolutely perfect. Got so many compliments at my cousin\'s wedding!',
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
    text: 'I was hesitant to buy online but the return policy put my mind at ease. The Rhea Tote arrived beautifully packaged and is gorgeous. Delivery was 2 days — incredibly fast!',
    author: 'Meera Nair',
    location: 'Delhi, NCR',
    rating: 5,
  },
]

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12" height="12" viewBox="0 0 24 24"
          fill={i < count ? '#C4A882' : 'none'}
          stroke="#C4A882"
          strokeWidth="1.5"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#1A1612]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#7C4A2D] mb-4">
            Real Stories
          </p>
          <h2
            className="font-serif font-light text-white"
            style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
          >
            What She <em className="italic" style={{ color: '#C4A882' }}>Says</em>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ text, author, location, rating }) => (
            <div
              key={author}
              className="bg-white/[0.04] border border-white/[0.08] px-7 py-8"
            >
              <StarRow count={rating} />
              <p className="font-serif font-light italic text-white/75 text-[1rem] leading-[1.75] mb-6">
                &ldquo;{text}&rdquo;
              </p>
              <p className="text-[10px] font-sans tracking-[0.12em] uppercase text-[#C4A882] font-semibold">
                {author}
              </p>
              <p className="text-[11px] font-sans text-white/30 mt-1">
                {location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
