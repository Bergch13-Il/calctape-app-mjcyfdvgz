import { useCalc } from '@/hooks/use-calc'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef } from 'react'

export function TextMode() {
  const { lines, activeLineId, setComment } = useCalc()
  const activeLine = lines.find((l) => l.id === activeLineId)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    // Auto focus when entering text mode
    inputRef.current?.focus()
  }, [])

  if (!activeLine) return null

  return (
    <div className="bg-tape-control h-full p-4 flex flex-col gap-2 min-h-[40vh]">
      <div className="text-white/70 text-sm font-medium">Add comment to active line:</div>
      <Textarea
        ref={inputRef}
        value={activeLine.comment}
        onChange={(e) => setComment(e.target.value)}
        className="flex-1 text-lg bg-white border-0 resize-none focus-visible:ring-tape-cyan text-black"
        placeholder="Type notes here..."
      />
    </div>
  )
}
