import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface IconProps extends React.HTMLAttributes<SVGSVGElement> {
  name: LucideIcon
  size?: number
}

export default function Icon({
  name: IconComponent,
  size = 24,
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      size={size}
      className={cn('', className)}
      {...props}
    />
  )
}
