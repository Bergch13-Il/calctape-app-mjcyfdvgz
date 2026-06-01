import { Delete } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolKeypadProps {
  onKeyPress: (key: string) => void
  onDelete: () => void
  className?: string
}

export function ToolKeypad({ onKeyPress, onDelete, className }: ToolKeypadProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-3 grid-rows-4 gap-[1px] bg-[#263238] p-[1px] select-none shrink-0 h-[280px] w-full',
        className,
      )}
      onPointerDown={(e) => e.preventDefault()}
    >
      <Key onClick={() => onKeyPress('7')}>7</Key>
      <Key onClick={() => onKeyPress('8')}>8</Key>
      <Key onClick={() => onKeyPress('9')}>9</Key>

      <Key onClick={() => onKeyPress('4')}>4</Key>
      <Key onClick={() => onKeyPress('5')}>5</Key>
      <Key onClick={() => onKeyPress('6')}>6</Key>

      <Key onClick={() => onKeyPress('1')}>1</Key>
      <Key onClick={() => onKeyPress('2')}>2</Key>
      <Key onClick={() => onKeyPress('3')}>3</Key>

      <Key onClick={() => onKeyPress('.')}>.</Key>
      <Key onClick={() => onKeyPress('0')}>0</Key>
      <Key variant="op" onClick={onDelete}>
        <Delete className="h-6 w-6" />
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
      type="button"
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
