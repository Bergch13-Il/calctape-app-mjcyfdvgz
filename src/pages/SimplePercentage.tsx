import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'

export default function SimplePercentagePage() {
  const [percentage, setPercentage] = useState<string>('')
  const [baseValue, setBaseValue] = useState<string>('')

  const p = parseFloat(percentage) || 0
  const b = parseFloat(baseValue) || 0
  const result = (p / 100) * b

  const handleReset = () => {
    setPercentage('')
    setBaseValue('')
  }

  const displayResult =
    percentage !== '' && baseValue !== ''
      ? Number.isInteger(result)
        ? result.toString()
        : result.toFixed(2)
      : ''

  return (
    <ToolLayout title="Porcentagens simples" onReset={handleReset}>
      <div className="flex flex-col gap-5 pt-2">
        <ToolRow value={percentage} onChange={setPercentage} suffix="%" />
        <ToolRow label="de" value={baseValue} onChange={setBaseValue} />
        <ToolRow label="é" value={displayResult} readOnly />
      </div>
    </ToolLayout>
  )
}
