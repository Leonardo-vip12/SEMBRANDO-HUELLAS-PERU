import { cn } from '@/lib/cn'

interface GlassCardProps extends React.HTMLAttributes<HTMLElement> {
  as?: string
  hover?: boolean
}

export default function GlassCard({
  as: Component = 'div',
  className,
  children,
  hover = true,
  ...props
}: GlassCardProps) {
  const El = Component as React.ElementType
  return (
    <El
      className={cn(
        'rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg',
        hover && 'transition-shadow hover:shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </El>
  )
}
