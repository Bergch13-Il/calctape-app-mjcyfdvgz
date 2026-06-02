import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

type Field = 'before' | 'discount' | 'after'

export default function DiscountPage() {
  const [values, setValues] = useState<Record<Field, string>>({
    before: '',
    discount: '',
    after: '',
  })
  const [activeField, setActiveField] = useState<Field>('before')
  const [fixedField, setFixedField] = useState<Field>('discount')

  const handleFocus = (field: Field) => {
    if (field !== activeField) {
      setFixedField(activeField)
      setActiveField(field)
    }
  }

  const handleReset = () => {
    setValues({ before: '', discount: '', after: '' })
    setActiveField('before')
    setFixedField('discount')
  }

  const handleChange = (newVal: string) => {
    const newValues = { ...values, [activeField]: newVal }

    let currentFixed = fixedField
    if (newValues[currentFixed] === '') {
      const other = (['before', 'discount', 'after'] as Field[]).find(
        (f) => f !== activeField && f !== currentFixed,
      )!
      if (newValues[other] !== '') currentFixed = other
    }

    const calcField = (['before', 'discount', 'after'] as Field[]).find(
      (f) => f !== activeField && f !== currentFixed,
    )!

    const aNum = parseFloat(newVal)
    const fNum = parseFloat(newValues[currentFixed])

    if (!isNaN(aNum) && !isNaN(fNum)) {
      let calcNum = 0
      const b = activeField === 'before' ? aNum : currentFixed === 'before' ? fNum : 0
      const d = activeField === 'discount' ? aNum : currentFixed === 'discount' ? fNum : 0
      const a = activeField === 'after' ? aNum : currentFixed === 'after' ? fNum : 0

      if (calcField === 'after') calcNum = b * (1 - d / 100)
      else if (calcField === 'before') calcNum = d === 100 ? 0 : a / (1 - d / 100)
      else if (calcField === 'discount') calcNum = b === 0 ? 0 : (1 - a / b) * 100

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

  let displaySavings = ''
  const bVal = parseFloat(values.before)
  const aVal = parseFloat(values.after)
  if (!isNaN(bVal) && !isNaN(aVal)) {
    const s = bVal - aVal
    const rounded = Math.round(s * 100) / 100
    displaySavings = Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(2)
  }

  return (
    <ToolLayout
      title="Desconto"
      onReset={handleReset}
      keypad={<ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />}
    >
      <div className="flex flex-col gap-4 pt-4">
        <ToolRow
          label="Antes"
          value={values.before}
          isActive={activeField === 'before'}
          onClick={() => handleFocus('before')}
          suffix="€"
        />
        <ToolRow
          label="Desconto"
          value={values.discount}
          isActive={activeField === 'discount'}
          onClick={() => handleFocus('discount')}
          suffix="%"
        />
        <ToolRow
          label="Depois"
          value={values.after}
          isActive={activeField === 'after'}
          onClick={() => handleFocus('after')}
          suffix="€"
        />
        <ToolRow label="Economia" value={displaySavings} readOnly suffix="€" />
      </div>
    </ToolLayout>
  )
}
