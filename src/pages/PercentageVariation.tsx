import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

export default function PercentageVariationPage() {
  const [initial, setInitial] = useState<string>('')
  const [final, setFinal] = useState<string>('')
  const [activeField, setActiveField] = useState<'initial' | 'final' | null>(null)

  const i = parseFloat(initial) || 0
  const f = parseFloat(final) || 0

  let variation = 0
  if (i !== 0) {
    variation = ((f - i) / i) * 100
  }

  const handleReset = () => {
    setInitial('')
    setFinal('')
    setActiveField(null)
  }

  const handleKeyPress = (key: string) => {
    const update = (prev: string) => {
      if (key === '.' && prev.includes('.')) return prev
      return prev + key
    }
    if (activeField === 'initial') setInitial(update)
    if (activeField === 'final') setFinal(update)
  }

  const handleDelete = () => {
    if (activeField === 'initial') setInitial((prev) => prev.slice(0, -1))
    if (activeField === 'final') setFinal((prev) => prev.slice(0, -1))
  }

  const handleBlur = (field: 'initial' | 'final') => {
    setTimeout(() => {
      setActiveField((current) => (current === field ? null : current))
    }, 100)
  }

  const displayVariation =
    initial !== '' && final !== ''
      ? Number.isInteger(variation)
        ? variation.toString()
        : variation.toFixed(2)
      : ''

  return (
    <ToolLayout
      title="Aumento/redução de porcentagem"
      onReset={handleReset}
      keypad={
        activeField ? <ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} /> : null
      }
    >
      <div className="flex flex-col gap-5 pt-2">
        <ToolRow
          label="Valor Inic..."
          value={initial}
          onChange={setInitial}
          onFocus={() => setActiveField('initial')}
          onBlur={() => handleBlur('initial')}
          suffix="€"
        />
        <ToolRow
          label="Valor Final"
          value={final}
          onChange={setFinal}
          onFocus={() => setActiveField('final')}
          onBlur={() => handleBlur('final')}
          suffix="€"
        />
        <ToolRow label="Variação %" value={displayVariation} readOnly suffix="%" />
      </div>
    </ToolLayout>
  )
}
