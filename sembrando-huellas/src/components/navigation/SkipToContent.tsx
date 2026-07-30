import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

interface SkipToContentProps {
  contentId?: string
  className?: string
}

const SkipToContent = forwardRef<HTMLAnchorElement, SkipToContentProps>(
  ({ contentId = 'main-content', className }, ref) => {
    return (
      <a
        ref={ref}
        href={`#${contentId}`}
        className={cn(
          'sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary-600 focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400',
          className
        )}
      >
        Ir al contenido principal
      </a>
    )
  }
)

SkipToContent.displayName = 'SkipToContent'

export default SkipToContent
