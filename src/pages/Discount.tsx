import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'

export default function DiscountPage() {
  const [before, setBefore] = useState<string>('')
  const [discount, setDiscount] = useState<string>('')

  const b = parseFloat(before) || 0
  const d = parseFloat(discount) || 0

  const savings = b * (d / 100)
  const after = b - savings

  const handleReset = () => {
    setBefore('')
    setDiscount('')
  }

  const displayAfter =
    before !== '' && discount !== ''
      ? Number.isInteger(after)
        ? after.toString()
        : after.toFixed(2)
      : ''

  const displaySavings =
    before !== '' && discount !== ''
      ? Number.isInteger(savings)
        ? savings.toString()
        : savings.toFixed(2)
      : ''

  return (
    <ToolLayout title="Desconto" onReset={handleReset}>
      <div className="flex flex-col gap-5 pt-2">
        <ToolRow label="Antes" value={before} onChange={setBefore} suffix="€" />
        <ToolRow label="Desconto" value={discount} onChange={setDiscount} suffix="%" />
        <ToolRow label="Depois" value={displayAfter} readOnly suffix="€" />
        <ToolRow label="Economia" value={displaySavings} readOnly suffix="€" />
      </div>
    </ToolLayout>
  )
}
