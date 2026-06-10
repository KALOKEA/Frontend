'use client'
import { useState } from 'react'

const TOPS_DRESSES = [
  { size: 'XS',  bust: '80–83',   waist: '62–65',  hip: '86–89',   uk: '6',  eu: '34', us: '2'  },
  { size: 'S',   bust: '84–87',   waist: '66–69',  hip: '90–93',   uk: '8',  eu: '36', us: '4'  },
  { size: 'M',   bust: '88–91',   waist: '70–73',  hip: '94–97',   uk: '10', eu: '38', us: '6'  },
  { size: 'L',   bust: '92–96',   waist: '74–78',  hip: '98–102',  uk: '12', eu: '40', us: '8'  },
  { size: 'XL',  bust: '97–102',  waist: '79–84',  hip: '103–108', uk: '14', eu: '42', us: '10' },
  { size: 'XXL', bust: '103–109', waist: '85–91',  hip: '109–115', uk: '16', eu: '44', us: '12' },
]

const BOTTOMS = [
  { size: 'XS',  waist: '62–65', hips: '86–89',   inseam: '74', us: '0–2',   uk: '4–6'   },
  { size: 'S',   waist: '66–69', hips: '90–93',   inseam: '74', us: '4–6',   uk: '8–10'  },
  { size: 'M',   waist: '70–73', hips: '94–97',   inseam: '76', us: '8–10',  uk: '12–14' },
  { size: 'L',   waist: '74–78', hips: '98–102',  inseam: '76', us: '12–14', uk: '16–18' },
  { size: 'XL',  waist: '79–84', hips: '103–108', inseam: '78', us: '16–18', uk: '20–22' },
  { size: 'XXL', waist: '85–91', hips: '109–115', inseam: '78', us: '20–22', uk: '24–26' },
]

const SHOES = [
  { size: '5',  eu: '36', us: '5',  uk: '3', cm: '22.5' },
  { size: '6',  eu: '37', us: '6',  uk: '4', cm: '23.0' },
  { size: '7',  eu: '38', us: '7',  uk: '5', cm: '23.5' },
  { size: '8',  eu: '39', us: '8',  uk: '6', cm: '24.5' },
  { size: '9',  eu: '40', us: '9',  uk: '7', cm: '25.0' },
  { size: '10', eu: '41', us: '10', uk: '8', cm: '25.5' },
]

const HOW_TO_MEASURE = [
  {
    title: 'How to Measure: Bust',
    desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the floor. Make sure you\'re not pulling the tape too tight.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/>
      </svg>
    ),
  },
  {
    title: 'How to Measure: Waist',
    desc: 'Measure around the narrowest part of your waist, typically about 2–3 cm above your belly button. Breathe out naturally.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 12h18M3 6h18M3 18h18"/>
      </svg>
    ),
  },
  {
    title: 'How to Measure: Hip',
    desc: 'Stand with your feet together and measure around the fullest part of your hips and bottom, about 20 cm below your natural waist.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <ellipse cx="12" cy="12" rx="10" ry="6"/>
      </svg>
    ),
  },
  {
    title: 'Between Sizes?',
    desc: 'If your measurements fall between two sizes, we recommend choosing the larger size for a more comfortable fit. You can also check product-specific notes.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
]

const TABS = ['Tops & Dresses', 'Bottoms', 'Shoes'] as const
type Tab = typeof TABS[number]

const thCls = 'text-left py-3 px-4 text-[10px] tracking-widest uppercase text-[#9B8F87] font-normal'
const tdCls = 'py-3 px-4 text-[#6B5E55] text-[13px]'
const tdFirstCls = 'py-3 px-4 font-medium text-[#0A0908] text-[13px]'

export default function SizeGuidePage() {
  const [tab, setTab] = useState<Tab>('Tops & Dresses')

  return (
    <main className="bg-[#FDFAF6]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">

        {/* Header */}
        <p className="text-[9.5px] font-sans tracking-[0.35em] uppercase text-[#7C4A2D] mb-3">Fit Guide</p>
        <h1 className="font-serif font-light text-[#0A0908] mb-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>
          Size <em className="italic" style={{ color: '#7C4A2D' }}>Guide</em>
        </h1>
        <p className="text-[13px] font-sans text-[#6B5E55] mb-10">
          All measurements in centimetres (cm). If between sizes, we recommend sizing up for a relaxed fit.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-[#E0D4C4] mb-8 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-[10px] font-sans tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-200 border-b-2 -mb-px ${
                tab === t
                  ? 'border-[#7C4A2D] text-[#7C4A2D]'
                  : 'border-transparent text-[#9B8F87] hover:text-[#0A0908]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-x-auto mb-14">
          {tab === 'Tops & Dresses' && (
            <table className="w-full">
              <thead><tr className="border-b border-[#E0D4C4]">
                {['KALOKEA Size', 'Bust (cm)', 'Waist (cm)', 'Hip (cm)', 'UK Size', 'EU Size', 'US Size'].map(h => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {TOPS_DRESSES.map(r => (
                  <tr key={r.size} className="border-b border-[#F0EAE1] hover:bg-[#FAF6F2]">
                    <td className={tdFirstCls}>{r.size}</td>
                    <td className={tdCls}>{r.bust}</td>
                    <td className={tdCls}>{r.waist}</td>
                    <td className={tdCls}>{r.hip}</td>
                    <td className={tdCls}>{r.uk}</td>
                    <td className={tdCls}>{r.eu}</td>
                    <td className={tdCls}>{r.us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'Bottoms' && (
            <table className="w-full">
              <thead><tr className="border-b border-[#E0D4C4]">
                {['KALOKEA Size', 'Waist (cm)', 'Hip (cm)', 'Inseam (cm)', 'US', 'UK'].map(h => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {BOTTOMS.map(r => (
                  <tr key={r.size} className="border-b border-[#F0EAE1] hover:bg-[#FAF6F2]">
                    <td className={tdFirstCls}>{r.size}</td>
                    <td className={tdCls}>{r.waist}</td>
                    <td className={tdCls}>{r.hips}</td>
                    <td className={tdCls}>{r.inseam}</td>
                    <td className={tdCls}>{r.us}</td>
                    <td className={tdCls}>{r.uk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {tab === 'Shoes' && (
            <table className="w-full">
              <thead><tr className="border-b border-[#E0D4C4]">
                {['IN Size', 'EU', 'US', 'UK', 'Length (cm)'].map(h => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr></thead>
              <tbody>
                {SHOES.map(r => (
                  <tr key={r.size} className="border-b border-[#F0EAE1] hover:bg-[#FAF6F2]">
                    <td className={tdFirstCls}>{r.size}</td>
                    <td className={tdCls}>{r.eu}</td>
                    <td className={tdCls}>{r.us}</td>
                    <td className={tdCls}>{r.uk}</td>
                    <td className={tdCls}>{r.cm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* How to Measure — 2×2 grid */}
        <div className="mb-12">
          <p className="text-[9.5px] font-sans tracking-[0.3em] uppercase text-[#7C4A2D] mb-6">How to Measure</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {HOW_TO_MEASURE.map(({ title, desc, icon }) => (
              <div key={title} className="flex items-start gap-4 bg-white border border-[#E0D4C4] p-5">
                <div className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-[#F2EAE0] text-[#7C4A2D]">
                  {icon}
                </div>
                <div>
                  <p className="font-sans font-medium text-[#0A0908] text-[13px] mb-1">{title}</p>
                  <p className="font-sans text-[12px] text-[#6B5E55] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info alert */}
        <div className="border-l-2 border-[#7C4A2D] bg-[#FDF6EE] px-5 py-4">
          <p className="text-[12px] font-sans text-[#6B5E55] leading-relaxed">
            <span className="font-medium text-[#0A0908]">Still unsure?</span>{' '}
            Chat with us via our{' '}
            <a href="/contact/" className="text-[#7C4A2D] underline underline-offset-2">Contact page</a>{' '}
            or email <a href="mailto:support@kalokea.in" className="text-[#7C4A2D] underline underline-offset-2">support@kalokea.in</a> — our stylists are happy to help you find the right fit.
          </p>
        </div>

      </div>
    </main>
  )
}
