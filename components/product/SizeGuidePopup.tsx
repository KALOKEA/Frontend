'use client'
import { useState } from 'react'
import Modal from '@/components/ui/Modal'

const SIZE_CHART = [
  { size: 'XS', bust: '80-84', waist: '62-66', hips: '86-90' },
  { size: 'S', bust: '84-88', waist: '66-70', hips: '90-94' },
  { size: 'M', bust: '88-92', waist: '70-74', hips: '94-98' },
  { size: 'L', bust: '92-96', waist: '74-78', hips: '98-102' },
  { size: 'XL', bust: '96-100', waist: '78-82', hips: '102-106' },
  { size: 'XXL', bust: '100-104', waist: '82-86', hips: '106-110' },
]

export default function SizeGuidePopup() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-[10px] font-sans tracking-widest uppercase underline text-[#6b6b6b] hover:text-[#0a0a0a]"
      >
        Size Guide
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title="Size Guide">
        <p className="text-xs font-sans text-[#6b6b6b] mb-4">All measurements in centimetres (cm).</p>
        <table className="w-full text-xs font-sans">
          <thead>
            <tr className="border-b border-[#e8e4e0]">
              {['Size', 'Bust', 'Waist', 'Hips'].map((h) => (
                <th key={h} className="text-left py-2 text-[10px] tracking-widest uppercase text-[#6b6b6b] font-normal">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIZE_CHART.map((row) => (
              <tr key={row.size} className="border-b border-[#f4f2ef]">
                <td className="py-2 font-medium text-[#0a0a0a]">{row.size}</td>
                <td className="py-2 text-[#6b6b6b]">{row.bust}</td>
                <td className="py-2 text-[#6b6b6b]">{row.waist}</td>
                <td className="py-2 text-[#6b6b6b]">{row.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11px] font-sans text-[#6b6b6b] mt-4">
          If you are between sizes, we recommend sizing up for a more comfortable fit.
        </p>
      </Modal>
    </>
  )
}
