import { useState, useMemo, useCallback } from 'react'

export type Operator = '+' | '-' | '*' | '/' | '=' | ''

export interface Line {
  id: string
  operator: Operator
  value: string
  comment: string
  isResult: boolean
  isSeparator: boolean
  isPercentage: boolean
}

export interface ComputedLine extends Line {
  computedValue: number
  computedAbsValue: number
  displayValue: string
  displayOperator: string
}

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

export function useTape() {
  const createEmptyLine = (): Line => ({
    id: crypto.randomUUID(),
    operator: '+',
    value: '',
    comment: '',
    isResult: false,
    isSeparator: false,
    isPercentage: false,
  })

  const [lines, setLines] = useState<Line[]>([createEmptyLine()])
  const [activeLineId, setActiveLineId] = useState<string>(lines[0].id)
  const [history, setHistory] = useState<Line[][]>([lines])
  const [historyIndex, setHistoryIndex] = useState(0)

  const pushHistory = useCallback(
    (newLines: Line[]) => {
      const newHist = history.slice(0, historyIndex + 1)
      newHist.push(newLines)
      setHistory(newHist)
      setHistoryIndex(newHist.length - 1)
      setLines(newLines)
    },
    [history, historyIndex],
  )

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setLines(history[historyIndex - 1])
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setLines(history[historyIndex + 1])
    }
  }, [history, historyIndex])

  const computedLines = useMemo(() => {
    let acc = 0
    return lines.map((line) => {
      if (line.isSeparator) {
        acc = 0
        return {
          ...line,
          computedValue: 0,
          computedAbsValue: 0,
          displayValue: '',
          displayOperator: '',
        }
      }
      if (line.isResult) {
        return {
          ...line,
          computedValue: acc,
          computedAbsValue: Math.abs(acc),
          displayValue: formatNumber(Math.abs(acc)),
          displayOperator: acc < 0 ? '-' : '+',
        }
      }

      let val = parseFloat(line.value || '0')
      if (isNaN(val)) val = 0
      let absVal = val

      if (line.isPercentage) {
        if (line.operator === '+' || line.operator === '-') {
          val = acc * (val / 100)
        } else {
          val = val / 100
        }
        absVal = val
      }

      switch (line.operator) {
        case '+':
          acc += val
          break
        case '-':
          acc -= val
          break
        case '*':
          acc *= val
          break
        case '/':
          acc /= val
          break
        case '':
          acc = val
          break
      }

      return {
        ...line,
        computedValue: acc,
        computedAbsValue: absVal,
        displayValue: line.value ? formatNumber(parseFloat(line.value)) : '',
        displayOperator: line.operator,
      }
    })
  }, [lines])

  const handleKeyPress = useCallback(
    (key: string) => {
      const activeIdx = lines.findIndex((l) => l.id === activeLineId)
      if (activeIdx === -1) return
      const line = lines[activeIdx]

      let newLines = [...lines]

      const updateActive = (updates: Partial<Line>) => {
        newLines[activeIdx] = { ...line, ...updates }
        pushHistory(newLines)
      }

      const insertAfter = (newLine: Line) => {
        newLines.splice(activeIdx + 1, 0, newLine)
        pushHistory(newLines)
        setActiveLineId(newLine.id)
      }

      if (/[0-9]/.test(key)) {
        if (line.isResult || line.isSeparator) {
          const sep: Line = { ...createEmptyLine(), operator: '', isSeparator: true }
          const nextLine: Line = { ...createEmptyLine(), operator: '+', value: key }
          newLines.splice(activeIdx + 1, 0, sep, nextLine)
          pushHistory(newLines)
          setActiveLineId(nextLine.id)
        } else {
          updateActive({ value: line.value + key })
        }
      } else if (key === '.') {
        if (!line.isResult && !line.isSeparator && !line.value.includes('.')) {
          updateActive({ value: line.value + '.' })
        }
      } else if (['+', '-', '*', '/'].includes(key)) {
        if (line.isResult || line.isSeparator) {
          insertAfter({ ...createEmptyLine(), operator: key as Operator })
        } else if (line.value === '') {
          updateActive({ operator: key as Operator })
        } else {
          insertAfter({ ...createEmptyLine(), operator: key as Operator })
        }
      } else if (key === '=') {
        if (line.isResult) {
          const sep: Line = { ...createEmptyLine(), operator: '', isSeparator: true }
          const nextLine: Line = { ...createEmptyLine(), operator: '+' }
          newLines.splice(activeIdx + 1, 0, sep, nextLine)
          pushHistory(newLines)
          setActiveLineId(nextLine.id)
        } else {
          insertAfter({ ...createEmptyLine(), operator: '=', isResult: true })
        }
      } else if (key === 'BACKSPACE') {
        if (line.isResult || line.isSeparator) {
          newLines.splice(activeIdx, 1)
          if (newLines.length === 0) newLines = [createEmptyLine()]
          pushHistory(newLines)
          setActiveLineId(newLines[Math.max(0, activeIdx - 1)].id)
        } else if (line.value.length > 0) {
          updateActive({ value: line.value.slice(0, -1) })
        } else {
          if (newLines.length > 1) {
            newLines.splice(activeIdx, 1)
            pushHistory(newLines)
            setActiveLineId(newLines[Math.max(0, activeIdx - 1)].id)
          }
        }
      } else if (key === '%') {
        if (!line.isResult && !line.isSeparator && line.value !== '') {
          updateActive({ isPercentage: !line.isPercentage })
        }
      } else if (key === 'AC') {
        const fresh = [createEmptyLine()]
        pushHistory(fresh)
        setActiveLineId(fresh[0].id)
      }
    },
    [lines, activeLineId, pushHistory],
  )

  const updateComment = (id: string, comment: string) => {
    const idx = lines.findIndex((l) => l.id === id)
    if (idx !== -1) {
      const newLines = [...lines]
      newLines[idx] = { ...newLines[idx], comment }
      pushHistory(newLines)
    }
  }

  return {
    lines,
    computedLines,
    activeLineId,
    setActiveLineId,
    handleKeyPress,
    undo,
    redo,
    canUndo: historyIndex > 0,
    updateComment,
  }
}
