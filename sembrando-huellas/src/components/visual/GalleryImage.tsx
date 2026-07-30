import { forwardRef } from 'react'
import { ZoomIn } from 'lucide-react'
import { cn } from '@/lib/cn'

interface GalleryImageProps {
  src: string
  alt: string
  caption?: string
  onClick?: () => void
}

const GalleryImage = forwardRef<HTMLDivElement, GalleryImageProps>(
  ({ src, alt, caption, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'group relative aspect-4/3 cursor-pointer overflow-hidden rounded-lg',
          'bg-gray-100 dark:bg-gray-800'
        )}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
        role="button"
        tabIndex={onClick ? 0 : undefined}
        aria-label={caption ? `View ${caption}` : `View image: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {onClick && (
            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-lg">
              <ZoomIn size={16} />
            </div>
          )}
          {caption && (
            <p className="px-4 pb-3 text-sm font-medium text-white">
              {caption}
            </p>
          )}
        </div>
      </div>
    )
  }
)

GalleryImage.displayName = 'GalleryImage'

export default GalleryImage
