import { cn } from '@/lib/cn'

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export default function Label({
  className,
  children,
  htmlFor,
  ...props
}: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        'text-sm font-medium text-neutral-700 dark:text-neutral-300',
        className,
      )}
      {...props}
    >
      {children}
    </label>
  )
}