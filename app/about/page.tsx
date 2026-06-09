import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'About Us | Kalokea',
  description: "Kalokea is a women's fashion brand celebrating confidence, elegance, and individuality.",
}

const VALUES = [
  {
    title: 'Inclusive Beauty',
    desc: 'We design for every body, every skin tone, every occasion. Fashion has no one-size-fits-all formula.',
  },
  {
    title: 'Ethical Sourcing',
    desc: 'Our fabrics are sourced from certified mills. Our artisans are paid fair wages. We believe fashion can be both beautiful and responsible.',
  },
  {
    title: 'Sustainable Future',
    desc: 'Packaging made from recycled materials. Carbon-neutral shipping by 2026. Fashion that respects the planet.',
  },
]

const STATS = [
  { num: '50K+',  label: 'Happy Customers' },
  { num: '500+',  label: 'Styles Available' },
  { num: '4.8★',  label: 'Average Rating' },
  { num: '28',    label: 'States Delivered' },
]

const TEAM = [
  {
    name: 'Anjali Mehta',
    role: 'Founder & Creative Director',
    bio: 'A fashion entrepreneur with 10+ years in the industry, Anjali founded Kalokea to bring accessible luxury to every Indian woman.',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=400&q=80',
  },
  {
    name: 'Riya Patel',
    role: 'Head of Design',
    bio: 'NIFT graduate and former designer at multiple premium labels, Riya brings a keen eye for silhouette, fabric, and wearability.',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  },
  {
    name: 'Sneha Rao',
    role: 'Head of Operations',
    bio: 'Sneha ensures every order reaches its destination flawlessly — managing logistics, quality control, and customer satisfaction.',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&q=80',
  },
  {
    name: 'Kavya Nair',
    role: 'Brand & Marketing',
    bio: 'With a background in storytelling and digital strategy, Kavya shapes how Kalokea speaks to the world.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-[#FDFAF6]">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex flex-col md:flex-row overflow-hidden"
        style={{ minHeight: 520, background: '#1E1208' }}
      >
        {/* Text side */}
        <div
          className="flex flex-col justify-center px-10 py-16 md:py-24 md:px-16 lg:px-24 relative z-10"
          style={{ flex: '0 0 50%' }}
        >
          <div className="w-10 h-px bg-[#7C4A2D] mb-8" />
          <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#C4A882] mb-5">Our Story</p>
          <h1
            className="font-serif font-light text-[#FDFAF6] leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)' }}
          >
            Fashion That<br />
            <em className="italic" style={{ color: '#C4A882' }}>Tells Your Story</em>
          </h1>
          <p className="font-sans text-[14px] leading-relaxed max-w-[360px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
            KALOKEA was born from a simple belief: every Indian woman deserves fashion that is both
            beautiful and accessible. We blend global trends with local sensibilities to create pieces
            that feel both timeless and distinctly yours.
          </p>
        </div>

        {/* Image side */}
        <div className="relative overflow-hidden" style={{ flex: '1 1 0', minHeight: 320 }}>
          <Image
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80"
            alt="Kalokea — Our Story"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
            priority
          />
          <div
            className="absolute inset-y-0 left-0 w-24 pointer-events-none hidden md:block"
            style={{ background: 'linear-gradient(to right, #1E1208, transparent)' }}
          />
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-4">What We Stand For</p>
            <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Our <em className="italic" style={{ color: '#7C4A2D' }}>Values</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map(({ title, desc }) => (
              <div
                key={title}
                className="bg-white p-8"
                style={{ borderTop: '3px solid #7C4A2D' }}
              >
                <h3 className="font-serif text-[1.2rem] text-[#0A0908] mb-3">{title}</h3>
                <p className="font-sans text-[13px] text-[#6B5E55] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="py-16 px-4 sm:px-6" style={{ background: '#7C4A2D' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(({ num, label }) => (
            <div key={label}>
              <p className="font-serif text-[2.4rem] font-light text-[#FDFAF6] leading-none mb-2">{num}</p>
              <p className="text-[9.5px] font-sans tracking-[0.25em] uppercase text-[#F0EAE1]/70">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-4">The Team</p>
            <h2 className="font-serif font-light text-[#0A0908]" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
              Meet the <em className="italic" style={{ color: '#7C4A2D' }}>Faces</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM.map(({ name, role, bio, image }) => (
              <div key={name} className="text-center">
                <div className="relative w-full aspect-square overflow-hidden mb-5 bg-[#E0D4C4] rounded-full">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    unoptimized
                  />
                </div>
                <p className="font-serif text-[1.05rem] text-[#0A0908] mb-1">{name}</p>
                <p className="text-[9.5px] font-sans tracking-[0.22em] uppercase text-[#7C4A2D] mb-3">{role}</p>
                <p className="text-[12px] font-sans text-[#6B5E55] leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
