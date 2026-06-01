import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from '@/components/ui/sheet'
import { Menu, Calculator, Percent, Tag, TrendingUp } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function MainMenu({ triggerClassName }: { triggerClassName?: string }) {
  const location = useLocation()

  const navItems = [
    { name: 'Scratchpad', path: '/', icon: Calculator },
    { name: 'Porcentagens simples', path: '/simple-percentage', icon: Percent },
    { name: 'Desconto', path: '/discount', icon: Tag },
    { name: 'Aumento/redução', path: '/percentage-variation', icon: TrendingUp },
  ]

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={triggerClassName}>
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle>Ferramentas</SheetTitle>
          <SheetDescription className="sr-only">
            Navegação principal das ferramentas de cálculo
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-2 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-md transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'hover:bg-accent text-foreground/80',
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}
