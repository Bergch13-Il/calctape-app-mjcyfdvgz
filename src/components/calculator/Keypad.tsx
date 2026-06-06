import { useEffect } from 'react'
import { Delete } from 'lucide-react'
import { useCalc } from '@/hooks/use-calc'
import { cn } from '@/lib/utils'

export function Keypad() {
  const {
    pressNumber,
    pressOperator,
    pressEqual,
    pressPercentage,
    pressBackspace,
    clearAll,
    mode,
    lines,
    activeLineId,
    setComment,
  } = useCalc()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in a textarea or input (like ABC mode)
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement) {
        return
      }

      const key = e.key
      if (/[0-9]/.test(key)) pressNumber(key)
      else if (key === '.' || key === ',') pressNumber('.')
      else if (key === '+' || key === '-' || key === '*' || key === '/') pressOperator(key as any)
      else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        pressEqual()
      } else if (key === 'Backspace') pressBackspace()
      else if (key === 'Escape') clearAll()
      else if (key === '%') pressPercentage()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pressNumber, pressOperator, pressEqual, pressPercentage, pressBackspace, clearAll])

  if (mode === 'ABC') {
    const activeLine = lines.find((l) => l.id === activeLineId)
    return (
      <div className="bg-[#263238] p-4 h-full min-h-[40vh] flex flex-col gap-2">
        <label className="text-white/70 text-sm font-medium uppercase tracking-wider">
          Line Note / Comment
        </label>
        <textarea
          className="w-full flex-1 bg-black/20 text-white p-4 text-lg rounded-md outline-none resize-none placeholder:text-white/30 border border-white/10 focus:border-[#4dd0e1]/50 transition-colors"
          placeholder="Type a note for this calculation..."
          value={activeLine?.comment || ''}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
    )
  }

  const is123 = mode === '123'

  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-[1px] bg-[#263238] p-[1px] h-full min-h-[40vh] select-none">
      {/* Row 1 */}
      <Key variant="ac" onClick={clearAll} className="text-xl font-bold text-white">
        AC
      </Key>
      <Key variant="op" onClick={pressBackspace}>
        <Delete className="h-6 w-6" />
      </Key>
      <Key variant="op" onClick={() => pressOperator('/')} className="text-2xl font-medium">
        ÷
      </Key>
      <Key variant="op" onClick={() => pressOperator('*')} className="text-2xl font-medium">
        ×
      </Key>

      {/* Row 2 */}
      <Key onClick={() => pressNumber(is123 ? '1' : '7')}>{is123 ? '1' : '7'}</Key>
      <Key onClick={() => pressNumber(is123 ? '2' : '8')}>{is123 ? '2' : '8'}</Key>
      <Key onClick={() => pressNumber(is123 ? '3' : '9')}>{is123 ? '3' : '9'}</Key>
      <Key variant="op" onClick={() => pressOperator('-')} className="text-3xl font-medium">
        -
      </Key>

      {/* Row 3 */}
      <Key onClick={() => pressNumber('4')}>4</Key>
      <Key onClick={() => pressNumber('5')}>5</Key>
      <Key onClick={() => pressNumber('6')}>6</Key>
      <Key variant="op" onClick={() => pressOperator('+')} className="text-3xl font-medium">
        +
      </Key>

      {/* Row 4 */}
      <Key onClick={() => pressNumber(is123 ? '7' : '1')}>{is123 ? '7' : '1'}</Key>
      <Key onClick={() => pressNumber(is123 ? '8' : '2')}>{is123 ? '8' : '2'}</Key>
      <Key onClick={() => pressNumber(is123 ? '9' : '3')}>{is123 ? '9' : '3'}</Key>
      <Key variant="op" onClick={() => pressEqual()} className="row-span-2 text-3xl font-medium">
        =
      </Key>

      {/* Row 5 */}
      <Key onClick={() => pressNumber('0')}>0</Key>
      <Key onClick={() => pressNumber('.')} className="text-3xl font-medium pb-2">
        ,
      </Key>
      <Key variant="op" onClick={() => pressPercentage()} className="text-2xl font-medium">
        %
      </Key>
    </div>
  )
}

function Key({
  children,
  variant = 'num',
  className,
  onClick,
}: {
  children: React.ReactNode
  variant?: 'num' | 'op' | 'ac'
  className?: string
  onClick?: () => void
}) {
  const bgClass = {
    num: 'bg-[#cfd8dc] hover:bg-[#b0bec5] text-black',
    op: 'bg-[#90a4ae] hover:bg-[#78909c] text-black',
    ac: 'bg-[#e64a19] hover:bg-[#bf360c] text-white',
  }[variant]

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center text-3xl font-medium transition-colors active:scale-95 duration-75 origin-center focus:outline-none',
        bgClass,
        className,
      )}
    >
      {children}
    </button>
  )
}
