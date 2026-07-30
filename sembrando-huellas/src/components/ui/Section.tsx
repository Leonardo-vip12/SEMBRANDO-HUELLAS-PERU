import { cn } from '@/lib/cn'

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  as?: string
  id?: string
}

export default function Section({
  as: Component = 'section',
  className,
  id,
  children,
  ...props
}: SectionProps) {
  const El = Component as React.ElementType
  return (
    <El id={id} className={cn('py-16 md:py-24', className)} {...props}>
      {children}
    </El>
  )
}
