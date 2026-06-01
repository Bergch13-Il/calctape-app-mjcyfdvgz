import { CalcProvider } from '@/hooks/use-calc'
import { CalculatorLayout } from '@/components/calculator/Layout'

const Index = () => {
  return (
    <CalcProvider>
      <div className="bg-black min-h-screen w-full flex items-center justify-center">
        {/* Responsive wrapper to limit width on desktop, full screen on mobile */}
        <div className="w-full max-w-md h-screen md:h-[850px] md:max-h-[95vh] md:rounded-3xl overflow-hidden shadow-2xl relative border border-white/10">
          <CalculatorLayout />
        </div>
      </div>
    </CalcProvider>
  )
}

export default Index
