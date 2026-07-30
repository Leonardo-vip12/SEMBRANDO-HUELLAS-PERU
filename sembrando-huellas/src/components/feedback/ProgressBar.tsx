import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type ProgressVariant = 'primary' | 'success' | 'warning' | 'error'
type ProgressSize = 'sm' | 'md' | 'lg'

interface ProgressBarProps {
  value: number
  max?: number
  variant?: ProgressVariant
  size?: ProgressSize
  showLabel?: boolean
  animated?: boolean
}

const variantStyles: Record<ProgressVariant, string> = {
  primary: 'bg-blue-600 dark:bg-blue-500',
  success: 'bg-green-600 dark:bg-green-500',
  warning: 'bg-yellow-500 dark:bg-yellow-400',
  error: 'bg-red-600 dark:bg-red-500',
}

const sizeStyles: Record<ProgressSize, { bar: string; text: string }> = {
  sm: { bar: 'h-1.5', text: 'text-xs' },
  md: { bar: 'h-2.5', text: 'text-sm' },
  lg: { bar: 'h-4', text: 'text-sm' },
}

const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ value, max = 100, variant = 'primary', size = 'md', showLabel = false, animated = true }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div ref={ref} className="flex items-center gap-3">
        <div
          className={cn(
            'flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
            sizeStyles[size].bar
          )}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all',
              variantStyles[variant],
              animated && 'transition-[width] duration-500 ease-out'
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <span
            className={cn(
              'font-medium text-gray-600 dark:text-gray-400',
              sizeStyles[size].text
            )}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'

export default ProgressBar
