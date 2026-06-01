import { Header } from './Header'
import { ControlBar } from './ControlBar'
import { Keypad } from './Keypad'
import { TextMode } from './TextMode'
import { TapeLineUI } from './TapeLineUI'
import { useCalc } from '@/hooks/use-calc'
import { useEffect, useRef } from 'react'

export function CalculatorLayout() {
  const { computedLines, mode } = useCalc()
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new lines are added at the end
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [computedLines.length])

  return (
    <div className="flex flex-col h-full w-full bg-[#3c3c3c] overflow-hidden">
      <Header />

      {/* Tape Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto tape-paper hide-scrollbar shadow-inner"
      >
        <div className="max-w-2xl mx-auto w-full min-h-full pb-8 pt-4">
          {computedLines.map((line) => (
            <TapeLineUI key={line.id} line={line} />
          ))}
        </div>
      </div>

      {/* Bottom Controls Area */}
      <div className="flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.2)] z-20 shrink-0">
        <ControlBar />
        {mode === 'ABC' ? <TextMode /> : <Keypad />}
      </div>
    </div>
  )
}
