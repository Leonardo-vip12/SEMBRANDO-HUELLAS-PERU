import { cn } from '@/lib/cn'

interface SubtitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h3'
}

export default function Subtitle({
  as: Component = 'h3',
  className,
  children,
  ...props
}: SubtitleProps) {
  return (
    <Component
      className={cn('text-xl font-heading md:text-2xl', className)}
      {...props}
    >
      {children}
    </Component>
  )
}