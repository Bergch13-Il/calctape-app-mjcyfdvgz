import { cn } from '@/lib/utils'

interface ToolRowProps {
  label?: string
  value: string
  suffix?: string
  readOnly?: boolean
  className?: string
  isActive?: boolean
  isCalculated?: boolean
  onClick?: () => void
}

export function ToolRow({
  label,
  value,
  suffix,
  readOnly,
  className,
  isActive,
  isCalculated,
  onClick,
}: ToolRowProps) {
  return (
    <div className={cn('flex items-center min-h-[56px] w-full gap-4', className)}>
      {label && (
        <div className="text-white font-medium w-20 shrink-0 text-[16px] truncate select-none pl-1">
          {label}
        </div>
      )}
      <div
        onClick={!readOnly ? onClick : undefined}
        className={cn(
          'relative flex-1 h-[52px] rounded-lg overflow-hidden transition-all border',
          isActive && 'ring-2 ring-white/50 bg-white/20 border-transparent',
          isCalculated &&
            !isActive &&
            'bg-[#4ade80]/20 border-[#4ade80]/50 shadow-[0_0_10px_rgba(74,222,128,0.2)]',
          !isActive && !isCalculated && 'bg-white/10 border-white/10',
          !isActive && !readOnly && !isCalculated && 'hover:bg-white/20 cursor-pointer',
          readOnly && 'bg-white/5 border-white/5 opacity-80 cursor-default',
        )}
      >
        <input
          type="text"
          readOnly
          value={value}
          className={cn(
            'w-full h-full bg-transparent border-none text-white text-right outline-none text-[18px] font-medium placeholder:text-white/60 no-stepper cursor-pointer pointer-events-none transition-colors duration-300',
            isCalculated && !isActive && 'text-[#bbf7d0]',
            suffix ? 'pr-10 pl-4' : 'px-4',
          )}
          placeholder="0"
        />
        {suffix && (
          <div className="absolute right-4 top-0 h-full flex items-center justify-end text-white font-medium pointer-events-none text-[16px] select-none">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}
