import { cn } from '@/lib/cn'

interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {}

export default function Caption({
  className,
  children,
  ...props
}: CaptionProps) {
  return (
    <span
      className={cn(
        'text-sm text-neutral-600 dark:text-neutral-200',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  )
}