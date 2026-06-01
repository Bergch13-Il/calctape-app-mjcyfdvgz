import { ComputedLine, useCalc } from '@/hooks/use-calc'
import { formatNumStr, formatComputedNum } from '@/lib/calc-utils'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

export function TapeLineUI({ line }: { line: ComputedLine }) {
  const { activeLineId, setActiveLineId } = useCalc()
  const isActive = activeLineId === line.id
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [isActive])

  const isResult = line.type === 'subtotal' || line.type === 'grandtotal'

  // Display Operator
  let opDisplay = line.operator
  if (isResult) {
    opDisplay = line.computedValue < 0 ? '-' : '+'
  }

  // Display Value
  let valDisplay = line.value
  if (isResult) {
    valDisplay = formatComputedNum(Math.abs(line.computedValue))
  } else {
    // We only format if it's not currently being actively typed with a trailing dot
    valDisplay = formatNumStr(line.value)
  }

  return (
    <div
      ref={ref}
      onClick={() => setActiveLineId(line.id)}
      className={cn(
        'flex items-center min-h-[32px] px-2 font-mono text-[1.1rem] leading-[32px] cursor-pointer group',
        isActive ? 'bg-black/5' : 'hover:bg-black/5 transition-colors',
      )}
    >
      <div className={cn('flex w-full items-center relative', isResult && 'mt-1 pt-[1px]')}>
        {/* Overline for results */}
        {isResult && <div className="absolute top-0 left-0 w-full h-[1px] bg-black/60" />}

        {/* Operator */}
        <div
          className={cn(
            'w-6 text-left shrink-0',
            isResult && 'font-bold',
            opDisplay === '-' && 'text-red-500',
          )}
        >
          {opDisplay}
        </div>

        {/* Value */}
        <div
          className={cn(
            'w-36 text-right shrink-0 tabular-nums tracking-tight',
            isResult && 'font-bold',
            (isResult ? line.computedValue < 0 : line.operator === '-') && 'text-red-500',
          )}
        >
          {valDisplay || (isActive ? '' : '0')}
        </div>

        {/* Percentage Indicator */}
        {line.isPercentage && <div className="ml-1 shrink-0 text-blue-500/80">%</div>}

        {/* Double Equal Indicator */}
        {line.type === 'grandtotal' && (
          <div className="ml-2 shrink-0 text-xs font-sans text-gray-500 bg-gray-200 px-1 rounded">
            END
          </div>
        )}

        {/* Comment */}
        <div className="flex-1 ml-4 text-blue-500/80 whitespace-nowrap overflow-hidden text-ellipsis select-text">
          {line.comment}
        </div>
      </div>
    </div>
  )
}
