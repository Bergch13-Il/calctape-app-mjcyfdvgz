import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'

export default function PercentageVariationPage() {
  const [initial, setInitial] = useState<string>('')
  const [final, setFinal] = useState<string>('')

  const i = parseFloat(initial) || 0
  const f = parseFloat(final) || 0

  let variation = 0
  if (i !== 0) {
    variation = ((f - i) / i) * 100
  }

  const handleReset = () => {
    setInitial('')
    setFinal('')
  }

  const displayVariation =
    initial !== '' && final !== ''
      ? Number.isInteger(variation)
        ? variation.toString()
        : variation.toFixed(2)
      : ''

  return (
    <ToolLayout title="Aumento/redução de porcentagem" onReset={handleReset}>
      <div className="flex flex-col gap-5 pt-2">
        <ToolRow label="Valor Inic..." value={initial} onChange={setInitial} suffix="€" />
        <ToolRow label="Valor Final" value={final} onChange={setFinal} suffix="€" />
        <ToolRow label="Variação %" value={displayVariation} readOnly suffix="%" />
      </div>
    </ToolLayout>
  )
}
