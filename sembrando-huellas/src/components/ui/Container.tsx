import { cn } from '@/lib/cn'

interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: string
}

export default function Container({
  as: Component = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  const El = Component as React.ElementType
  return (
    <El className={cn('mx-auto max-w-7xl px-4', className)} {...props}>
      {children}
    </El>
  )
}
