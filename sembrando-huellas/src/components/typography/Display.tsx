import { cn } from '@/lib/cn'

interface DisplayProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1'
}

export default function Display({
  as: Component = 'h1',
  className,
  children,
  ...props
}: DisplayProps) {
  return (
    <Component
      className={cn(
        'text-6xl font-heading md:text-7xl lg:text-8xl',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}