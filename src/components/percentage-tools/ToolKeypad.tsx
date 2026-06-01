import { ArrowLeft } from 'lucide-react'
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
        'grid grid-cols-3 grid-rows-4 gap-3 bg-[#115ebe] p-5 select-none shrink-0 h-[320px] w-full rounded-t-3xl',
        className,
      )}
      onPointerDown={(e) => e.preventDefault()}
    >
      <Key onClick={() => onKeyPress('1')}>1</Key>
      <Key onClick={() => onKeyPress('2')}>2</Key>
      <Key onClick={() => onKeyPress('3')}>3</Key>

      <Key onClick={() => onKeyPress('4')}>4</Key>
      <Key onClick={() => onKeyPress('5')}>5</Key>
      <Key onClick={() => onKeyPress('6')}>6</Key>

      <Key onClick={() => onKeyPress('7')}>7</Key>
      <Key onClick={() => onKeyPress('8')}>8</Key>
      <Key onClick={() => onKeyPress('9')}>9</Key>

      <Key onClick={() => onKeyPress('.')}>.</Key>
      <Key onClick={() => onKeyPress('0')}>0</Key>
      <Key onClick={onDelete}>
        <ArrowLeft className="h-6 w-6" />
      </Key>
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
