import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface VerticalCardProps {
  image: {
    src: string
    alt: string
  }
  title: string
  description: string
  badge?: string
  onClick?: () => void
  className?: string
}

const VerticalCard = forwardRef<HTMLDivElement, VerticalCardProps>(
  ({ image, title, description, badge, onClick, className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 dark:border-neutral-700 dark:bg-neutral-800',
          onClick && 'cursor-pointer hover:-translate-y-1 hover:shadow-lg',
          className,
        )}
        onClick={onClick}
        onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={onClick ? title : undefined}
      >
        <div className="relative aspect-[16/9] overflow-hidden">
          <img
            src={image.src}
            alt={image.alt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-neutral-800 shadow-sm backdrop-blur-sm dark:bg-neutral-900/90 dark:text-neutral-200">
              {badge}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    )
  },
)

VerticalCard.displayName = 'VerticalCard'

export default VerticalCard
