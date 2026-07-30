import { cn } from '@/lib/cn'

interface CardProps extends React.HTMLAttributes<HTMLElement> {
  as?: string
  padding?: boolean
}

export default function Card({
  as: Component = 'div',
  className,
  children,
  padding = true,
  ...props
}: CardProps) {
  const El = Component as React.ElementType
  return (
    <El
      className={cn(
        'rounded-lg border border-gray-200 bg-white shadow-sm',
        padding && 'p-6',
        className
      )}
      {...props}
    >
      {children}
    </El>
  )
}
