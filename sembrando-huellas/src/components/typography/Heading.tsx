import type { HeadingLevel } from '@/types/design-system'
import { cn } from '@/lib/cn'

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  level?: HeadingLevel
}

const levelSizeMap: Record<HeadingLevel, string> = {
  1: 'text-4xl',
  2: 'text-3xl',
  3: 'text-2xl',
  4: 'text-xl',
  5: 'text-lg',
  6: 'text-base',
}

export default function Heading({
  as,
  level,
  className,
  children,
  ...props
}: HeadingProps) {
  const resolvedLevel = level ?? 2
  const Component = as ?? (`h${resolvedLevel}` as React.ElementType)

  return (
    <Component
      className={cn(
        'font-heading font-bold',
        levelSizeMap[resolvedLevel],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}