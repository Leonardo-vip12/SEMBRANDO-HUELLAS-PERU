import { cn } from '@/lib/cn'

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2'
}

export default function Title({
  as: Component = 'h2',
  className,
  children,
  ...props
}: TitleProps) {
  return (
    <Component
      className={cn('text-3xl font-heading md:text-4xl', className)}
      {...props}
    >
      {children}
    </Component>
  )
}