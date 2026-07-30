import type { Align } from '@/types/design-system'
import { cn } from '@/lib/cn'

interface SectionTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  subtitle?: string
  align?: Align
}

export default function SectionTitle({
  title,
  subtitle,
  align = 'left',
  className,
  ...props
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'mb-8',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        className,
      )}
      {...props}
    >
      <h2 className="text-3xl font-heading font-bold md:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-lg text-neutral-600 dark:text-neutral-400">
          {subtitle}
        </p>
      )}
    </div>
  )
}