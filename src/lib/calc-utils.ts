import { CalcLine, ComputedLine } from '@/hooks/use-calc'

export function formatNumStr(str: string): string {
  if (!str) return ''
  const parts = str.split('.')
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.length > 1 ? `${intPart}.${parts[1]}` : intPart
}

export function formatComputedNum(num: number): string {
  const isNegative = num < 0
  const absNum = Math.abs(num)
  const parts = absNum.toFixed(2).split('.')
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // We keep 2 decimals for subtotals, though we could make it dynamic based on input
  return `${isNegative ? '-' : ''}${intPart}.${parts[1]}`
}

export function evaluateTape(lines: CalcLine[]): ComputedLine[] {
  let acc = 0

  return lines.map((line) => {
    let currentAcc = acc

    if (line.type === 'subtotal') {
      return {
        ...line,
        computedValue: currentAcc,
        runningTotal: currentAcc,
      }
    }

    if (line.type === 'grandtotal') {
      const total = currentAcc
      acc = 0 // Reset accumulator for next block
      return {
        ...line,
        computedValue: total,
        runningTotal: total,
      }
    }

    // Standard input line
    const rawVal = parseFloat(line.value || '0')
    let val = rawVal

    if (line.isPercentage && (line.operator === '+' || line.operator === '-')) {
      val = (currentAcc * rawVal) / 100
    }

    if (line.operator === '+' || line.operator === '') acc += val
    else if (line.operator === '-') acc -= val
    else if (line.operator === '*') acc *= val
    else if (line.operator === '/') acc /= val

    return {
      ...line,
      computedValue: val,
      runningTotal: acc,
    }
  })
}

export function generateTapeText(lines: ComputedLine[]): string {
  return lines
    .map((l) => {
      let op = l.operator
      let valStr = l.value

      if (l.type === 'subtotal' || l.type === 'grandtotal') {
        op = l.computedValue < 0 ? '-' : '+'
        valStr = Math.abs(l.computedValue).toFixed(2)
      } else {
        if (l.value === '') valStr = '0'
      }

      const formattedVal = formatNumStr(valStr).padStart(12, ' ')
      const pct = l.isPercentage ? '%' : ' '
      const cmt = l.comment ? `  ${l.comment}` : ''

      const lineText = `${op} ${formattedVal} ${pct}${cmt}`

      if (l.type === 'subtotal' || l.type === 'grandtotal') {
        return `----------------\n${lineText}\n`
      }
      return lineText
    })
    .join('\n')
}
