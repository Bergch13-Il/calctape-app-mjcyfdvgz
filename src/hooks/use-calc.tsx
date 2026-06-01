import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'
import { evaluateTape } from '@/lib/calc-utils'

export type Operator = '+' | '-' | '*' | '/' | ''

export type LineType = 'input' | 'subtotal' | 'grandtotal'

export interface CalcLine {
  id: string
  type: LineType
  operator: Operator
  value: string
  comment: string
  isPercentage?: boolean
}

export interface ComputedLine extends CalcLine {
  computedValue: number
  runningTotal: number
}

interface HistoryState {
  lines: CalcLine[]
  activeLineId: string
}

const generateId = () => Math.random().toString(36).substr(2, 9)

const createInitialLine = (): CalcLine => ({
  id: generateId(),
  type: 'input',
  operator: '+',
  value: '',
  comment: '',
})

interface CalcContextType {
  lines: CalcLine[]
  computedLines: ComputedLine[]
  activeLineId: string
  mode: '123' | '321' | 'ABC'
  setMode: (mode: '123' | '321' | 'ABC') => void
  setActiveLineId: (id: string) => void

  // Actions
  pressNumber: (char: string) => void
  pressOperator: (op: Operator) => void
  pressEqual: () => void
  pressPercentage: () => void
  pressBackspace: () => void
  clearAll: () => void
  setComment: (text: string) => void

  // History
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
}

const CalcContext = createContext<CalcContextType | null>(null)

export function CalcProvider({ children }: { children: React.ReactNode }) {
  const [history, setHistory] = useState<HistoryState[]>([
    {
      lines: [createInitialLine()],
      activeLineId: '',
    },
  ])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [mode, setMode] = useState<'123' | '321' | 'ABC'>('123')

  // We keep current transient state in these variables to allow fast typing without pushing history for EVERY keystroke.
  // We commit to history on structural changes (operators, equals, explicit line changes).
  const [lines, setLines] = useState<CalcLine[]>([createInitialLine()])
  const [activeLineId, setActiveLineIdState] = useState<string>(lines[0].id)

  const commitToHistory = useCallback(
    (newLines: CalcLine[], newActiveId: string) => {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndex + 1)
        return [...trimmed, { lines: newLines, activeLineId: newActiveId }]
      })
      setHistoryIndex((prev) => prev + 1)
    },
    [historyIndex],
  )

  const updateActiveLine = useCallback(
    (updates: Partial<CalcLine>) => {
      setLines((prev) => prev.map((l) => (l.id === activeLineId ? { ...l, ...updates } : l)))
    },
    [activeLineId],
  )

  const appendNewLine = useCallback(
    (newLine: CalcLine) => {
      setLines((prev) => {
        // Insert after active line
        const activeIdx = prev.findIndex((l) => l.id === activeLineId)
        const next = [...prev]
        next.splice(activeIdx !== -1 ? activeIdx + 1 : next.length, 0, newLine)
        return next
      })
      setActiveLineIdState(newLine.id)
    },
    [activeLineId],
  )

  const pressNumber = useCallback(
    (char: string) => {
      const activeLine = lines.find((l) => l.id === activeLineId)
      if (!activeLine) return

      if (activeLine.type !== 'input') {
        // If we are on a result line and type a number, start a new implicit block
        const newLine = { ...createInitialLine(), value: char === '.' ? '0.' : char }
        appendNewLine(newLine)
        commitToHistory([...lines, newLine], newLine.id)
        return
      }

      if (char === '.' && activeLine.value.includes('.')) return

      const newValue = activeLine.value + char
      updateActiveLine({ value: newValue })
    },
    [lines, activeLineId, appendNewLine, commitToHistory, updateActiveLine],
  )

  const pressOperator = useCallback(
    (op: Operator) => {
      const activeLine = lines.find((l) => l.id === activeLineId)
      if (!activeLine) return

      if (activeLine.type === 'input' && activeLine.value === '') {
        // Just change operator
        updateActiveLine({ operator: op })
        commitToHistory(
          lines.map((l) => (l.id === activeLineId ? { ...l, operator: op } : l)),
          activeLineId,
        )
      } else {
        // New line with this operator
        const newLine = { ...createInitialLine(), operator: op }
        appendNewLine(newLine)
        // Commit the state with the newly added line
        const activeIdx = lines.findIndex((l) => l.id === activeLineId)
        const newLines = [...lines]
        newLines.splice(activeIdx !== -1 ? activeIdx + 1 : newLines.length, 0, newLine)
        commitToHistory(newLines, newLine.id)
      }
    },
    [lines, activeLineId, appendNewLine, commitToHistory, updateActiveLine],
  )

  const pressEqual = useCallback(() => {
    const activeLine = lines.find((l) => l.id === activeLineId)
    if (!activeLine) return

    let newLines = [...lines]
    let newActiveId = activeLineId

    if (activeLine.type === 'subtotal') {
      // Double equal -> convert to grandtotal
      newLines = newLines.map((l) =>
        l.id === activeLineId ? { ...l, type: 'grandtotal' as LineType } : l,
      )
    } else if (activeLine.type === 'grandtotal') {
      // Do nothing
      return
    } else {
      // Add a subtotal line
      const newLine: CalcLine = {
        id: generateId(),
        type: 'subtotal',
        operator: '',
        value: '',
        comment: '',
      }
      const activeIdx = newLines.findIndex((l) => l.id === activeLineId)
      newLines.splice(activeIdx !== -1 ? activeIdx + 1 : newLines.length, 0, newLine)
      newActiveId = newLine.id
    }

    setLines(newLines)
    setActiveLineIdState(newActiveId)
    commitToHistory(newLines, newActiveId)
  }, [lines, activeLineId, commitToHistory])

  const pressPercentage = useCallback(() => {
    const activeLine = lines.find((l) => l.id === activeLineId)
    if (!activeLine || activeLine.type !== 'input') return

    updateActiveLine({ isPercentage: !activeLine.isPercentage })
    commitToHistory(
      lines.map((l) => (l.id === activeLineId ? { ...l, isPercentage: !l.isPercentage } : l)),
      activeLineId,
    )
  }, [lines, activeLineId, commitToHistory, updateActiveLine])

  const pressBackspace = useCallback(() => {
    const activeLine = lines.find((l) => l.id === activeLineId)
    if (!activeLine) return

    if (activeLine.type !== 'input') {
      // Remove result line entirely
      const activeIdx = lines.findIndex((l) => l.id === activeLineId)
      const newLines = lines.filter((l) => l.id !== activeLineId)
      if (newLines.length === 0) newLines.push(createInitialLine())
      const prevId = newLines[Math.max(0, activeIdx - 1)].id

      setLines(newLines)
      setActiveLineIdState(prevId)
      commitToHistory(newLines, prevId)
      return
    }

    if (activeLine.value.length > 0) {
      updateActiveLine({ value: activeLine.value.slice(0, -1) })
    } else {
      // Remove empty line if it's not the only one
      if (lines.length > 1) {
        const activeIdx = lines.findIndex((l) => l.id === activeLineId)
        const newLines = lines.filter((l) => l.id !== activeLineId)
        const prevId = newLines[Math.max(0, activeIdx - 1)].id

        setLines(newLines)
        setActiveLineIdState(prevId)
        commitToHistory(newLines, prevId)
      }
    }
  }, [lines, activeLineId, commitToHistory, updateActiveLine])

  const clearAll = useCallback(() => {
    const initial = createInitialLine()
    setLines([initial])
    setActiveLineIdState(initial.id)
    commitToHistory([initial], initial.id)
  }, [commitToHistory])

  const setComment = useCallback(
    (text: string) => {
      updateActiveLine({ comment: text })
    },
    [updateActiveLine],
  )

  const setActiveLineId = useCallback((id: string) => {
    setActiveLineIdState(id)
  }, [])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1]
      setLines(prev.lines)
      setActiveLineIdState(prev.activeLineId)
      setHistoryIndex(historyIndex - 1)
    }
  }, [history, historyIndex])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1]
      setLines(next.lines)
      setActiveLineIdState(next.activeLineId)
      setHistoryIndex(historyIndex + 1)
    }
  }, [history, historyIndex])

  const computedLines = useMemo(() => evaluateTape(lines), [lines])

  return (
    <CalcContext.Provider
      value={{
        lines,
        computedLines,
        activeLineId,
        mode,
        setMode,
        setActiveLineId,
        pressNumber,
        pressOperator,
        pressEqual,
        pressPercentage,
        pressBackspace,
        clearAll,
        setComment,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
      }}
    >
      {children}
    </CalcContext.Provider>
  )
}

export function useCalc() {
  const context = useContext(CalcContext)
  if (!context) throw new Error('useCalc must be used within CalcProvider')
  return context
}
