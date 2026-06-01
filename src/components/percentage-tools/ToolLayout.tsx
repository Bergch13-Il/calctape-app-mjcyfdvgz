import { MainMenu } from '@/components/navigation/MainMenu'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface ToolLayoutProps {
  title: string
  onReset: () => void
  children: ReactNode
  keypad?: ReactNode
}

export function ToolLayout({ title, onReset, children, keypad }: ToolLayoutProps) {
  return (
    <div className="bg-black min-h-screen w-full flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-screen md:h-[850px] md:max-h-[95vh] md:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col bg-[#3491e3] border border-white/10">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-2 border-b border-white/20 shrink-0 relative z-10 shadow-sm">
          <MainMenu triggerClassName="text-white hover:bg-white/20 shrink-0" />
          <div className="text-white text-[18px] font-bold truncate select-none absolute left-1/2 -translate-x-1/2 max-w-[60%] text-center">
            {title}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="text-white hover:bg-white/20 shrink-0"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col overflow-y-auto hide-scrollbar">{children}</div>

        {keypad && (
          <div className="shrink-0 w-full animate-in slide-in-from-bottom-8 fade-in duration-200">
            {keypad}
          </div>
        )}
      </div>
    </div>
  )
}
