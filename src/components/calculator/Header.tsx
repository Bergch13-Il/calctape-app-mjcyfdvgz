import { Undo2, Redo2, MoreVertical } from 'lucide-react'
import { useCalc } from '@/hooks/use-calc'
import { Button } from '@/components/ui/button'
import { MainMenu } from '@/components/navigation/MainMenu'

export function Header() {
  const { undo, redo, canUndo, canRedo } = useCalc()

  return (
    <div className="h-14 bg-tape-header flex items-center justify-between px-2 shadow-md z-10 shrink-0">
      <div className="flex items-center gap-2">
        <MainMenu triggerClassName="text-white hover:bg-white/10 shrink-0" />
        <div className="text-white text-xl font-medium truncate select-none">
          Calc com anotações
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={undo}
          disabled={!canUndo}
          className="text-tape-cyan hover:bg-tape-cyan/10 hover:text-tape-cyan disabled:text-tape-cyan/30"
        >
          <Undo2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={redo}
          disabled={!canRedo}
          className="text-tape-cyan hover:bg-tape-cyan/10 hover:text-tape-cyan disabled:text-tape-cyan/30"
        >
          <Redo2 className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-tape-cyan hover:bg-tape-cyan/10 hover:text-tape-cyan ml-1"
        >
          <MoreVertical className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
