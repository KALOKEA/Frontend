import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Size Guide | Kalokea',
  description: 'Find your perfect fit with Kalokea\'s size guide.',
}

const CHART = [
  { size: 'XS', bust: '80–84', waist: '62–66', hips: '86–90', us: '0–2', uk: '4–6' },
  { size: 'S',  bust: '84–88', waist: '66–70', hips: '90–94', us: '4–6', uk: '8–10' },
  { size: 'M',  bust: '88–92', waist: '70–74', hips: '94–98', us: '8–10', uk: '12–14' },
  { size: 'L',  bust: '92–96', waist: '74–78', hips: '98–102', us: '12–14', uk: '16–18' },
  { size: 'XL', bust: '96–100', waist: '78–82', hips: '102–106', us: '16–18', uk: '20–22' },
  { size: 'XXL',bust: '100–104',waist: '82–86', hips: '106–110', us: '20–22', uk: '24–26' },
]

export default function SizeGuidePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-[10px] font-sans tracking-[0.3em] uppercase text-[#7C4A2D] mb-3">Fit Guide</p>
      <h1 className="font-serif text-4xl text-[#0a0a0a] mb-4">Size Guide</h1>
      <p className="text-sm font-sans text-[#6b6b6b] mb-10">
        All measurements in centimetres (cm). If between sizes, we recommend sizing up for a relaxed fit.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-sans">
          <thead>
            <tr className="border-b border-[#e8e4e0]">
              {['Size', 'Bust', 'Waist', 'Hips', 'US', 'UK'].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-[10px] tracking-widest uppercase text-[#6b6b6b] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CHART.map((row) => (
              <tr key={row.size} className="border-b border-[#f4f2ef] hover:bg-[#faf8f5]">
                <td className="py-3 px-4 font-medium text-[#0a0a0a]">{row.size}</td>
                <td className="py-3 px-4 text-[#6b6b6b]">{row.bust}</td>
                <td className="py-3 px-4 text-[#6b6b6b]">{row.waist}</td>
                <td className="py-3 px-4 text-[#6b6b6b]">{row.hips}</td>
                <td className="py-3 px-4 text-[#6b6b6b]">{row.us}</td>
                <td className="py-3 px-4 text-[#6b6b6b]">{row.uk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-10 p-6 bg-[#faf8f5] border-l-2 border-[#7C4A2D]">
        <h3 className="text-[10px] font-sans tracking-widest uppercase text-[#0a0a0a] mb-3">How to Measure</h3>
        <ul className="space-y-2 text-xs font-sans text-[#6b6b6b]">
          <li><strong className="text-[#0a0a0a]">Bust:</strong> Measure around the fullest part of your chest, keeping the tape parallel to the ground.</li>
          <li><strong className="text-[#0a0a0a]">Waist:</strong> Measure around the narrowest part of your torso, usually just above the belly button.</li>
          <li><strong className="text-[#0a0a0a]">Hips:</strong> Measure around the fullest part of your hips, about 20cm below your waist.</li>
        </ul>
      </div>
    </div>
  )
}
