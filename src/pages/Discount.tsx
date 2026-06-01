import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

export default function DiscountPage() {
  const [before, setBefore] = useState<string>('')
  const [discount, setDiscount] = useState<string>('')
  const [activeField, setActiveField] = useState<'before' | 'discount'>('before')

  const b = parseFloat(before) || 0
  const d = parseFloat(discount) || 0

  const savings = b * (d / 100)
  const after = b - savings

  const handleReset = () => {
    setBefore('')
    setDiscount('')
    setActiveField('before')
  }

  const handleKeyPress = (key: string) => {
    const update = (prev: string) => {
      if (key === '.' && prev.includes('.')) return prev
      return prev + key
    }
    if (activeField === 'before') setBefore(update)
    if (activeField === 'discount') setDiscount(update)
  }

  const handleDelete = () => {
    if (activeField === 'before') setBefore((prev) => prev.slice(0, -1))
    if (activeField === 'discount') setDiscount((prev) => prev.slice(0, -1))
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
    <ToolLayout
      title="Desconto"
      onReset={handleReset}
      keypad={<ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />}
    >
      <div className="flex flex-col gap-4 pt-4">
        <ToolRow
          label="Antes"
          value={before}
          isActive={activeField === 'before'}
          onClick={() => setActiveField('before')}
          suffix="€"
        />
        <ToolRow
          label="Desconto"
          value={discount}
          isActive={activeField === 'discount'}
          onClick={() => setActiveField('discount')}
          suffix="%"
        />
        <ToolRow label="Depois" value={displayAfter} readOnly suffix="€" />
        <ToolRow label="Economia" value={displaySavings} readOnly suffix="€" />
      </div>
    </ToolLayout>
  )
}
