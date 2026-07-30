import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface ResponsiveImageProps {
  src: string
  alt: string
  mobileSrc?: string
  tabletSrc?: string
  desktopSrc?: string
  className?: string
}

const ResponsiveImage = forwardRef<HTMLPictureElement, ResponsiveImageProps>(
  ({ src, alt, mobileSrc, tabletSrc, desktopSrc, className }, ref) => {
    return (
      <picture ref={ref} className={cn('block', className)}>
        {desktopSrc && (
          <source media="(min-width: 1024px)" srcSet={desktopSrc} />
        )}
        {tabletSrc && (
          <source media="(min-width: 768px)" srcSet={tabletSrc} />
        )}
        {mobileSrc && (
          <source media="(max-width: 767px)" srcSet={mobileSrc} />
        )}
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </picture>
    )
  }
)

ResponsiveImage.displayName = 'ResponsiveImage'

export default ResponsiveImage
