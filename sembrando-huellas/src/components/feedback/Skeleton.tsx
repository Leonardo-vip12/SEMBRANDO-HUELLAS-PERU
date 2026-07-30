import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

type SkeletonVariant = 'text' | 'circular' | 'rectangular'

interface SkeletonProps {
  variant?: SkeletonVariant
  width?: string | number
  height?: string | number
  count?: number
  className?: string
}

const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ variant = 'text', width, height, count = 1, className }, ref) => {
    const baseClass = cn(
      'animate-pulse bg-gray-200 dark:bg-gray-700',
      variant === 'circular' && 'rounded-full',
      variant === 'rectangular' && 'rounded-lg',
      variant === 'text' && 'h-4 w-full rounded'
    )

    const items = Array.from({ length: count }, (_, i) => i)

    return (
      <div ref={ref} className={cn('flex flex-col gap-2', className)} role="status" aria-label="Loading">
        {items.map((i) => (
          <div
            key={i}
            className={baseClass}
            style={{
              width: typeof width === 'number' ? `${width}px` : width,
              height: typeof height === 'number' ? `${height}px` : height,
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton
