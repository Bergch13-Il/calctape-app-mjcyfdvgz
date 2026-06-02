import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

type Field = 'initial' | 'final' | 'variation'

export default function PercentageVariationPage() {
  const [values, setValues] = useState<Record<Field, string>>({
    initial: '',
    final: '',
    variation: '',
  })
  const [activeField, setActiveField] = useState<Field>('initial')
  const [fixedField, setFixedField] = useState<Field>('final')

  const handleFocus = (field: Field) => {
    if (field !== activeField) {
      setFixedField(activeField)
      setActiveField(field)
    }
  }

  const handleReset = () => {
    setValues({ initial: '', final: '', variation: '' })
    setActiveField('initial')
    setFixedField('final')
  }

  const handleChange = (newVal: string) => {
    const newValues = { ...values, [activeField]: newVal }

    let currentFixed = fixedField
    if (newValues[currentFixed] === '') {
      const other = (['initial', 'final', 'variation'] as Field[]).find(
        (f) => f !== activeField && f !== currentFixed,
      )!
      if (newValues[other] !== '') currentFixed = other
    }

    const calcField = (['initial', 'final', 'variation'] as Field[]).find(
      (f) => f !== activeField && f !== currentFixed,
    )!

    const aNum = parseFloat(newVal)
    const fNum = parseFloat(newValues[currentFixed])

    if (!isNaN(aNum) && !isNaN(fNum)) {
      let calcNum = 0
      const i = activeField === 'initial' ? aNum : currentFixed === 'initial' ? fNum : 0
      const v = activeField === 'variation' ? aNum : currentFixed === 'variation' ? fNum : 0
      const f = activeField === 'final' ? aNum : currentFixed === 'final' ? fNum : 0

      if (calcField === 'variation') calcNum = i === 0 ? 0 : ((f - i) / i) * 100
      else if (calcField === 'final') calcNum = i * (1 + v / 100)
      else if (calcField === 'initial') calcNum = v === -100 ? 0 : f / (1 + v / 100)

      if (isFinite(calcNum)) {
        const rounded = Math.round(calcNum * 100) / 100
        newValues[calcField] = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2)
      } else {
        newValues[calcField] = ''
      }
    } else if (newVal === '') {
      newValues[calcField] = ''
    }

    setValues(newValues)
  }

  const handleKeyPress = (key: string) => {
    const prev = values[activeField]
    if (key === '.' && prev.includes('.')) return
    handleChange(prev + key)
  }

  const handleDelete = () => {
    const prev = values[activeField]
    handleChange(prev.slice(0, -1))
  }

  return (
    <ToolLayout
      title="Aumento/redução de porcentagem"
      onReset={handleReset}
      keypad={<ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />}
    >
      <div className="flex flex-col gap-4 pt-4">
        <ToolRow
          label="Valor Inic..."
          value={values.initial}
          isActive={activeField === 'initial'}
          onClick={() => handleFocus('initial')}
          suffix="€"
        />
        <ToolRow
          label="Valor Final"
          value={values.final}
          isActive={activeField === 'final'}
          onClick={() => handleFocus('final')}
          suffix="€"
        />
        <ToolRow
          label="Variação %"
          value={values.variation}
          isActive={activeField === 'variation'}
          onClick={() => handleFocus('variation')}
          suffix="%"
        />
      </div>
    </ToolLayout>
  )
}
