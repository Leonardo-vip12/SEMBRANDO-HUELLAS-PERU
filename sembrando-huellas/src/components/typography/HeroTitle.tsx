import { cn } from '@/lib/cn'

interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1'
}

export default function HeroTitle({
  as: Component = 'h1',
  className,
  children,
  ...props
}: HeroTitleProps) {
  return (
    <Component
      className={cn(
        'text-4xl font-heading font-bold md:text-5xl lg:text-6xl',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}