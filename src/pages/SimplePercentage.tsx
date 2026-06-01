import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

export default function SimplePercentagePage() {
  const [percentage, setPercentage] = useState<string>('')
  const [baseValue, setBaseValue] = useState<string>('')
  const [activeField, setActiveField] = useState<'percentage' | 'base' | null>(null)

  const p = parseFloat(percentage) || 0
  const b = parseFloat(baseValue) || 0
  const result = (p / 100) * b

  const handleReset = () => {
    setPercentage('')
    setBaseValue('')
    setActiveField(null)
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

  const handleBlur = (field: 'percentage' | 'base') => {
    setTimeout(() => {
      setActiveField((current) => (current === field ? null : current))
    }, 100)
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
      keypad={
        activeField ? <ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} /> : null
      }
    >
      <div className="flex flex-col gap-5 pt-2">
        <ToolRow
          value={percentage}
          onChange={setPercentage}
          onFocus={() => setActiveField('percentage')}
          onBlur={() => handleBlur('percentage')}
          suffix="%"
        />
        <ToolRow
          label="de"
          value={baseValue}
          onChange={setBaseValue}
          onFocus={() => setActiveField('base')}
          onBlur={() => handleBlur('base')}
        />
        <ToolRow label="é" value={displayResult} readOnly />
      </div>
    </ToolLayout>
  )
}
