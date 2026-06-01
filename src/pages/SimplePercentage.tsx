import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

export default function SimplePercentagePage() {
  const [percentage, setPercentage] = useState<string>('')
  const [baseValue, setBaseValue] = useState<string>('')
  const [activeField, setActiveField] = useState<'percentage' | 'base'>('percentage')

  const p = parseFloat(percentage) || 0
  const b = parseFloat(baseValue) || 0
  const result = (p / 100) * b

  const handleReset = () => {
    setPercentage('')
    setBaseValue('')
    setActiveField('percentage')
  }

  const handleKeyPress = (key: string) => {
    const update = (prev: string) => {
      if (key === '.' && prev.includes('.')) return prev
      return prev + key
    }
    if (activeField === 'percentage') setPercentage(update)
    if (activeField === 'base') setBaseValue(update)
  }

  const handleDelete = () => {
    if (activeField === 'percentage') setPercentage((prev) => prev.slice(0, -1))
    if (activeField === 'base') setBaseValue((prev) => prev.slice(0, -1))
  }

  const displayResult =
    percentage !== '' && baseValue !== ''
      ? Number.isInteger(result)
        ? result.toString()
        : result.toFixed(2)
      : ''

  return (
    <ToolLayout
      title="Porcentagens simples"
      onReset={handleReset}
      keypad={<ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />}
    >
      <div className="flex flex-col gap-4 pt-4">
        <ToolRow
          value={percentage}
          isActive={activeField === 'percentage'}
          onClick={() => setActiveField('percentage')}
          suffix="%"
        />
        <ToolRow
          label="de"
          value={baseValue}
          isActive={activeField === 'base'}
          onClick={() => setActiveField('base')}
        />
        <ToolRow label="é" value={displayResult} readOnly />
      </div>
    </ToolLayout>
  )
}
