import { Keyboard, Copy } from 'lucide-react'
import { useCalc } from '@/hooks/use-calc'
import { cn } from '@/lib/utils'
import { formatNumStr, generateTapeText } from '@/lib/calc-utils'
import { useToast } from '@/hooks/use-toast'

export function ControlBar() {
  const { mode, setMode, computedLines } = useCalc()
  const { toast } = useToast()

  const handleCopy = () => {
    const text = generateTapeText(computedLines)
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied to clipboard',
      description: 'The tape contents have been copied as text.',
    })
  }

  // Find the last running total to display
  let displayTotal = 0
  if (computedLines.length > 0) {
    displayTotal = computedLines[computedLines.length - 1].runningTotal
  }

  return (
    <div className="h-12 bg-tape-control flex items-center px-1 shrink-0 border-b border-black/20">
      <div className="flex items-center gap-1">
        <ModeTab label="123" active={mode === '123'} onClick={() => setMode('123')} />
        <ModeTab label="321" active={mode === '321'} onClick={() => setMode('321')} />
        <ModeTab label="ABC" active={mode === 'ABC'} onClick={() => setMode('ABC')} />

        <button className="h-full px-3 text-tape-cyan hover:bg-white/5 transition-colors flex items-center justify-center">
          <Keyboard className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 text-right px-4 text-2xl font-bold text-white tracking-tight tabular-nums truncate">
        {formatNumStr(displayTotal.toFixed(2))}
      </div>

      <button
        onClick={handleCopy}
        className="h-full px-3 text-tape-cyan hover:bg-white/5 transition-colors flex items-center justify-center border-l border-white/10"
      >
        <Copy className="h-5 w-5" />
      </button>
    </div>
  )
}

function ModeTab({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'h-10 px-3 text-sm font-semibold rounded-sm transition-colors mx-0.5',
        active
          ? 'text-tape-cyan bg-white/10'
          : 'text-tape-cyan/60 hover:text-tape-cyan hover:bg-white/5',
      )}
    >
      {label}
    </button>
  )
}
