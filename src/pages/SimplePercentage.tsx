import { useState } from 'react'
import { ToolLayout } from '@/components/percentage-tools/ToolLayout'
import { ToolRow } from '@/components/percentage-tools/ToolRow'
import { ToolKeypad } from '@/components/percentage-tools/ToolKeypad'

type Field = 'percentage' | 'base' | 'result'

export default function SimplePercentagePage() {
  const [values, setValues] = useState<Record<Field, string>>({
    percentage: '',
    base: '',
    result: '',
  })
  const [activeField, setActiveField] = useState<Field>('percentage')
  const [fixedField, setFixedField] = useState<Field>('base')
  const [calculatedField, setCalculatedField] = useState<Field | null>(null)

  const handleFocus = (field: Field) => {
    if (field !== activeField) {
      setFixedField(activeField)
      setActiveField(field)
      setCalculatedField(null)
    }
  }

  const handleReset = () => {
    setValues({ percentage: '', base: '', result: '' })
    setActiveField('percentage')
    setFixedField('base')
    setCalculatedField(null)
  }

  const handleChange = (newVal: string) => {
    const newValues = { ...values, [activeField]: newVal }

    let currentFixed = fixedField
    if (newValues[currentFixed] === '') {
      const other = (['percentage', 'base', 'result'] as Field[]).find(
        (f) => f !== activeField && f !== currentFixed,
      )!
      if (newValues[other] !== '') currentFixed = other
    }

    const calcField = (['percentage', 'base', 'result'] as Field[]).find(
      (f) => f !== activeField && f !== currentFixed,
    )!

    const aNum = parseFloat(newVal)
    const fNum = parseFloat(newValues[currentFixed])

    if (!isNaN(aNum) && !isNaN(fNum)) {
      let calcNum = 0
      const p = activeField === 'percentage' ? aNum : currentFixed === 'percentage' ? fNum : 0
      const b = activeField === 'base' ? aNum : currentFixed === 'base' ? fNum : 0
      const r = activeField === 'result' ? aNum : currentFixed === 'result' ? fNum : 0

      if (calcField === 'result') calcNum = (p / 100) * b
      else if (calcField === 'base') calcNum = p === 0 ? 0 : r / (p / 100)
      else if (calcField === 'percentage') calcNum = b === 0 ? 0 : (r / b) * 100

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
    setCalculatedField(newVal === '' ? null : calcField)
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
      title="Porcentagens simples"
      onReset={handleReset}
      keypad={<ToolKeypad onKeyPress={handleKeyPress} onDelete={handleDelete} />}
    >
      <div className="flex flex-col gap-4 pt-4">
        <ToolRow
          value={values.percentage}
          isActive={activeField === 'percentage'}
          isCalculated={calculatedField === 'percentage'}
          onClick={() => handleFocus('percentage')}
          suffix="%"
        />
        <ToolRow
          label="de"
          value={values.base}
          isActive={activeField === 'base'}
          isCalculated={calculatedField === 'base'}
          onClick={() => handleFocus('base')}
        />
        <ToolRow
          label="é"
          value={values.result}
          isActive={activeField === 'result'}
          isCalculated={calculatedField === 'result'}
          onClick={() => handleFocus('result')}
        />
      </div>
    </ToolLayout>
  )
}
