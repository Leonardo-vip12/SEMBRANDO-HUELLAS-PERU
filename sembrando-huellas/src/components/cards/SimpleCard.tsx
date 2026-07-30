import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface SimpleCardProps {
  title?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

const SimpleCard = forwardRef<HTMLDivElement, SimpleCardProps>(
  ({ title, description, children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800',
          className,
        )}
      >
        {title && (
          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
        )}
        {description && (
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        )}
        {children && <div className={title || description ? 'mt-4' : ''}>{children}</div>}
      </div>
    )
  },
)

SimpleCard.displayName = 'SimpleCard'

export default SimpleCard
