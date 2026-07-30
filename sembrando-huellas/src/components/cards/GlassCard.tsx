import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  as?: string
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const GlassCard = forwardRef<HTMLElement, GlassCardProps>(
  (
    {
      children,
      className,
      as: Component = 'div',
      hover = true,
      padding = 'md',
    },
    ref,
  ) => {
    const El = Component as React.ElementType
    return (
      <El
        ref={ref}
        className={cn(
          'rounded-xl border border-white/20 bg-white/10 backdrop-blur-xl transition-all duration-300 dark:border-white/10',
          paddingClasses[padding],
          hover &&
            'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/10',
          className,
        )}
      >
        {children}
      </El>
    )
  },
)

GlassCard.displayName = 'GlassCard'

export default GlassCard
