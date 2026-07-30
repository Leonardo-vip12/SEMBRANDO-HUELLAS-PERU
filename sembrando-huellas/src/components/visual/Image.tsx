import { useState, forwardRef } from 'react'
import { cn } from '@/lib/cn'

type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  objectFit?: ObjectFit
  lazy?: boolean
  fallback?: React.ReactNode
  aspectRatio?: string
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      src,
      alt,
      width,
      height,
      className,
      objectFit = 'cover',
      lazy = true,
      fallback,
      aspectRatio,
      style,
      ...props
    },
    ref
  ) => {
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    return (
      <div
        className={cn('relative overflow-hidden', className)}
        style={{
          width: width ? `${width}px` : undefined,
          height: height ? `${height}px` : undefined,
          aspectRatio,
          ...style,
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-700" />
        )}
        {hasError && fallback ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            {fallback}
          </div>
        ) : (
          !hasError && (
            <img
              ref={ref}
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={lazy ? 'lazy' : 'eager'}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setHasError(true)
              }}
              className={cn(
                'h-full w-full transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100',
                `object-${objectFit}`
              )}
              {...props}
            />
          )
        )}
      </div>
    )
  }
)

Image.displayName = 'Image'

export default Image
