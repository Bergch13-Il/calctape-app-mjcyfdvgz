import { cn } from '@/lib/utils'

interface ToolRowProps {
  label?: string
  value: string
  onChange?: (val: string) => void
  suffix?: string
  readOnly?: boolean
  className?: string
  onFocus?: () => void
  onBlur?: () => void
}

export function ToolRow({
  label,
  value,
  onChange,
  suffix,
  readOnly,
  className,
  onFocus,
  onBlur,
}: ToolRowProps) {
  return (
    <div className={cn('flex items-center min-h-[56px] w-full gap-4', className)}>
      {label && (
        <div className="text-white font-medium w-24 shrink-0 text-[15px] truncate select-none">
          {label}
        </div>
      )}
      <div
        className={cn(
          'relative flex-1 h-12 bg-white/20 rounded-xl overflow-hidden transition-all',
          !readOnly && 'focus-within:ring-2 focus-within:ring-white/50 focus-within:bg-white/30',
          readOnly && 'bg-white/10',
        )}
      >
        <input
          type="text"
          inputMode="none"
          value={value}
          onChange={(e) => {
            const val = e.target.value.replace(/,/g, '.')
            if (/^-?\d*\.?\d*$/.test(val)) {
              onChange?.(val)
            }
          }}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
          className={cn(
            'w-full h-full bg-transparent border-none text-white text-right outline-none text-[17px] font-medium placeholder:text-white/40 no-stepper',
            suffix ? 'pr-9 pl-4' : 'px-4',
            readOnly && 'cursor-default',
          )}
          placeholder="0"
        />
        {suffix && (
          <div className="absolute right-3 top-0 h-full flex items-center justify-end text-white/80 pointer-events-none text-[17px] font-medium select-none">
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}
