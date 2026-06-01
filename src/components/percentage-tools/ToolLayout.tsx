import { MainMenu } from '@/components/navigation/MainMenu'
import { RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ReactNode } from 'react'

interface ToolLayoutProps {
  title: string
  onReset: () => void
  children: ReactNode
}

export function ToolLayout({ title, onReset, children }: ToolLayoutProps) {
  return (
    <div className="bg-black min-h-screen w-full flex items-center justify-center font-sans">
      <div className="w-full max-w-md h-screen md:h-[850px] md:max-h-[95vh] md:rounded-3xl overflow-hidden shadow-2xl relative flex flex-col bg-[#41a0f5] border border-white/10">
        {/* Header */}
        <div className="h-14 flex items-center justify-between px-2 border-b border-white/20 shrink-0 relative z-10 shadow-sm">
          <MainMenu triggerClassName="text-white hover:bg-white/20 shrink-0" />
          <div className="text-white text-[17px] font-semibold truncate select-none absolute left-1/2 -translate-x-1/2 max-w-[60%] text-center">
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
        <div className="flex-1 p-5 flex flex-col gap-6 overflow-y-auto hide-scrollbar">
          {children}

          <div className="mt-auto pt-8 pb-4 text-center text-white/70 text-sm px-4 font-medium">
            Nota: Os dados inseridos não são salvos e serão perdidos ao recarregar a página.
          </div>
        </div>
      </div>
    </div>
  )
}
