import { useState, forwardRef, useRef, useEffect } from 'react'
import { cn } from '@/lib/cn'

type ObjectFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

const objectFitClasses: Record<ObjectFit, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill',
  none: 'object-none',
  'scale-down': 'object-scale-down',
}

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
    const imgRef = useRef<HTMLImageElement | null>(null)
    const loaded = useRef(false)

    useEffect(() => {
      const img = imgRef.current
      if (img && img.complete && !loaded.current) {
        loaded.current = true
        if (img.naturalWidth === 0) {
          setHasError(true)
        }
        setIsLoading(false)
      }
    }, [src])

    const setRef = (el: HTMLImageElement | null) => {
      imgRef.current = el
      if (typeof ref === 'function') ref(el)
      else if (ref) ref.current = el
    }

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
              ref={setRef}
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={lazy ? 'lazy' : 'eager'}
              onLoad={() => {
                loaded.current = true
                setIsLoading(false)
              }}
              onError={() => {
                loaded.current = true
                setIsLoading(false)
                setHasError(true)
              }}
              className={cn(
                'h-full w-full transition-opacity duration-300',
                isLoading ? 'opacity-0' : 'opacity-100',
                objectFitClasses[objectFit]
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
