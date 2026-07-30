import type { ParagraphSize } from '@/types/design-system'
import { cn } from '@/lib/cn'

interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: ParagraphSize
  lead?: boolean
}

const sizeClasses: Record<ParagraphSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
}

export default function Paragraph({
  size = 'md',
  lead = false,
  className,
  children,
  ...props
}: ParagraphProps) {
  return (
    <p
      className={cn(
        'text-neutral-700 leading-relaxed dark:text-neutral-300',
        sizeClasses[size],
        lead && 'text-xl text-neutral-600 dark:text-neutral-400',
        className,
      )}
      {...props}
    >
      {children}
    </p>
  )
}