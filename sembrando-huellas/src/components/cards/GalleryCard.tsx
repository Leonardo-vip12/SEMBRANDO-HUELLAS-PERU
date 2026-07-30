import { useState } from 'react'
import { cn } from '@/lib/cn'

interface GalleryCardProps {
  image: {
    src: string
    alt: string
    caption?: string
  }
  onClick?: () => void
  className?: string
}

export default function GalleryCard({
  image,
  onClick,
  className,
}: GalleryCardProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        onClick ? 'cursor-pointer' : 'cursor-default',
        className,
      )}
      aria-label={image.caption || image.alt}
    >
      <div
        className={cn(
          'relative aspect-[4/3] overflow-hidden bg-neutral-100 dark:bg-neutral-800',
          !isLoaded && 'animate-pulse',
        )}
      >
        <img
          src={image.src}
          alt={image.alt}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-all duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0',
            'group-hover:scale-110',
          )}
        />
      </div>
      {image.caption && (
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 transition-transform duration-300 group-hover:translate-y-0">
          <p className="text-sm text-white">{image.caption}</p>
        </div>
      )}
    </button>
  )
}
