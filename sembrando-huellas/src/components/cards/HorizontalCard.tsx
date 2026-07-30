import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface HorizontalCardProps {
  image: {
    src: string
    alt: string
  }
  title: string
  description: string
  metadata?: string
  onClick?: () => void
  className?: string
}

const HorizontalCard = forwardRef<HTMLDivElement, HorizontalCardProps>(
  ({ image, title, description, metadata, onClick, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800 sm:flex-row',
          onClick && 'cursor-pointer hover:-translate-y-0.5 hover:shadow-md',
          className,
        )}
        onClick={onClick}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? title : undefined}
      >
        <div className="relative aspect-[16/9] overflow-hidden sm:w-2/5 sm:aspect-auto">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="flex flex-1 flex-col justify-center p-6">
          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <p className="mb-3 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
          {metadata && (
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {metadata}
            </p>
          )}
        </div>
      </div>
    )
  },
)

HorizontalCard.displayName = 'HorizontalCard'

export default HorizontalCard
