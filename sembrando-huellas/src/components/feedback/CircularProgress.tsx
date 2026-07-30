import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type CircularVariant = 'primary' | 'success' | 'warning' | 'error'

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  variant?: CircularVariant
  showLabel?: boolean
}

const variantColors: Record<CircularVariant, string> = {
  primary: 'stroke-blue-600 dark:stroke-blue-500',
  success: 'stroke-green-600 dark:stroke-green-500',
  warning: 'stroke-yellow-500 dark:stroke-yellow-400',
  error: 'stroke-red-600 dark:stroke-red-500',
}

const CircularProgress = forwardRef<HTMLDivElement, CircularProgressProps>(
  ({ value, size = 60, strokeWidth = 6, variant = 'primary', showLabel = true }, ref) => {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const clampedValue = Math.min(Math.max(value, 0), 100)
    const offset = circumference - (clampedValue / 100) * circumference

    return (
      <div
        ref={ref}
        className="relative inline-flex items-center justify-center"
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-gray-200 dark:stroke-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn(
              'transition-all duration-500 ease-out',
              variantColors[variant]
            )}
          />
        </svg>
        {showLabel && (
          <span className="absolute text-xs font-semibold text-gray-700 dark:text-gray-300">
            {Math.round(clampedValue)}%
          </span>
        )}
      </div>
    )
  }
)

CircularProgress.displayName = 'CircularProgress'

export default CircularProgress
