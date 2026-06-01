import { Delete } from 'lucide-react'
import { useCalc } from '@/hooks/use-calc'
import { cn } from '@/lib/utils'

export function Keypad() {
  const { pressNumber, pressOperator, pressEqual, pressPercentage, pressBackspace, clearAll } =
    useCalc()

  return (
    <div className="grid grid-cols-4 grid-rows-5 gap-[1px] bg-tape-keypadBg p-[1px] h-full min-h-[40vh] select-none">
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
      <Key onClick={() => pressNumber('7')}>7</Key>
      <Key onClick={() => pressNumber('8')}>8</Key>
      <Key onClick={() => pressNumber('9')}>9</Key>
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
      <Key onClick={() => pressNumber('1')}>1</Key>
      <Key onClick={() => pressNumber('2')}>2</Key>
      <Key onClick={() => pressNumber('3')}>3</Key>
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
    num: 'bg-tape-keyNum hover:bg-[#B0BEC5]',
    op: 'bg-tape-keyOp hover:bg-[#78909C]',
    ac: 'bg-tape-keyAc hover:bg-[#BF360C]',
  }[variant]

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center justify-center text-3xl font-medium text-black transition-colors active:scale-95 duration-75 origin-center focus:outline-none',
        bgClass,
        className,
      )}
    >
      {children}
    </button>
  )
}
