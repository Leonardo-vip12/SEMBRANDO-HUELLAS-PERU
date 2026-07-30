import { forwardRef } from 'react'
import { cn } from '@/lib/cn'
import type { CardVariant } from '@/types/design-system'

interface CardBaseProps {
  variant?: CardVariant
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hover?: boolean
  as?: string
  className?: string
  children: React.ReactNode
  onMouseEnter?: React.MouseEventHandler
  onMouseLeave?: React.MouseEventHandler
  onClick?: React.MouseEventHandler
  onKeyDown?: React.KeyboardEventHandler
  role?: string
  tabIndex?: number
  'aria-label'?: string
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm',
  glass:
    'bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/10',
  elevated:
    'bg-white dark:bg-neutral-800 shadow-lg shadow-primary-500/10',
  outlined:
    'bg-transparent border-2 border-primary-100 dark:border-primary-900',
  flat: 'bg-neutral-50 dark:bg-neutral-800/50',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

const CardBase = forwardRef<HTMLElement, CardBaseProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      hover = false,
      as: Component = 'div',
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const El = Component as React.ElementType
    return (
      <El
        ref={ref}
        className={cn(
          'rounded-xl transition-all duration-300',
          variantClasses[variant],
          paddingClasses[padding],
          hover &&
            'cursor-pointer hover:-translate-y-1 hover:shadow-xl',
          className,
        )}
        {...props}
      >
        {children}
      </El>
    )
  },
)

CardBase.displayName = 'CardBase'

export default CardBase
