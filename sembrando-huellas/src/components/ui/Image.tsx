import { useState } from 'react'
import { cn } from '@/lib/cn'

interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  fallback?: string
  aspectRatio?: string
}

export default function Image({
  src,
  alt,
  width,
  height,
  className,
  fallback,
  aspectRatio,
  ...props
}: ImageProps) {
  const [error, setError] = useState(false)

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: aspectRatio || (width && height ? `${width}/${height}` : undefined) }}
    >
      <img
        src={error && fallback ? fallback : src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        onError={() => setError(true)}
        className="h-full w-full object-cover"
        {...props}
      />
    </div>
  )
}
