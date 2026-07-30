import { useState, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'
type StatusType = 'online' | 'offline' | 'away'

interface AvatarProps {
  src?: string
  alt: string
  size?: AvatarSize
  fallback?: string
  status?: StatusType
  className?: string
}

const sizeClasses: Record<AvatarSize, { container: string; text: string; indicator: string }> = {
  sm: { container: 'w-8 h-8', text: 'text-xs', indicator: 'w-2.5 h-2.5 ring-1' },
  md: { container: 'w-10 h-10', text: 'text-sm', indicator: 'w-3 h-3 ring-2' },
  lg: { container: 'w-14 h-14', text: 'text-lg', indicator: 'w-3.5 h-3.5 ring-2' },
  xl: { container: 'w-20 h-20', text: 'text-2xl', indicator: 'w-4 h-4 ring-2' },
}

const statusColors: Record<StatusType, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt, size = 'md', fallback, status, className }, ref) => {
    const [imgError, setImgError] = useState(false)
    const showFallback = !src || imgError

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', className)}
      >
        <div
          className={cn(
            'flex items-center justify-center overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700',
            sizeClasses[size].container
          )}
        >
          {showFallback && fallback ? (
            <span
              className={cn(
                'font-medium text-gray-600 dark:text-gray-300',
                sizeClasses[size].text
              )}
              aria-hidden="true"
            >
              {fallback}
            </span>
          ) : (
            <img
              src={src}
              alt={alt}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          )}
        </div>
        {status && (
          <span
            className={cn(
              'absolute bottom-0 right-0 rounded-full border-white dark:border-gray-900',
              statusColors[status],
              sizeClasses[size].indicator
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

export default Avatar
