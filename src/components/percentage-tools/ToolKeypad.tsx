import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ToolKeypadProps {
  onKeyPress: (key: string) => void
  onDelete: () => void
  className?: string
}

export function ToolKeypad({ onKeyPress, onDelete, className }: ToolKeypadProps) {
  const [layout, setLayout] = useState<'calc' | 'phone'>('calc')

  const keysCalc = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
  ]

  const keysPhone = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
  ]

  const activeKeys = layout === 'calc' ? keysCalc : keysPhone

  return (
    <div className="relative w-full">
      <div className="absolute -top-10 right-4 z-10 flex bg-[#115ebe] rounded-lg p-1 shadow-sm border border-white/10 gap-1">
        <button
          onClick={() => setLayout('calc')}
          className={cn(
            'px-3 py-1 text-[11px] font-semibold rounded-md transition-colors text-white',
            layout === 'calc' ? 'bg-white/20 shadow-sm' : 'opacity-50 hover:bg-white/10',
          )}
        >
          789
        </button>
        <button
          onClick={() => setLayout('phone')}
          className={cn(
            'px-3 py-1 text-[11px] font-semibold rounded-md transition-colors text-white',
            layout === 'phone' ? 'bg-white/20 shadow-sm' : 'opacity-50 hover:bg-white/10',
          )}
        >
          123
        </button>
      </div>
      <div
        className={cn(
          'grid grid-cols-3 grid-rows-4 gap-3 bg-[#115ebe] p-5 select-none shrink-0 h-[320px] w-full rounded-t-3xl',
          className,
        )}
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).tagName !== 'BUTTON') {
            e.preventDefault()
          }
        }}
      >
        {activeKeys.flat().map((key) => (
          <Key key={key} onClick={() => onKeyPress(key)}>
            {key}
          </Key>
        ))}
        <Key onClick={() => onKeyPress('.')}>.</Key>
        <Key onClick={() => onKeyPress('0')}>0</Key>
        <Key onClick={onDelete}>
          <ArrowLeft className="h-6 w-6" />
        </Key>
      </div>
    </div>
  )
}

function Key({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center text-[22px] font-semibold transition-colors active:scale-95 duration-75 origin-center focus:outline-none rounded-xl bg-[#174ea6] hover:bg-[#12408d] text-white shadow-sm',
        className,
      )}
    >
      {children}
    </button>
  )
}
