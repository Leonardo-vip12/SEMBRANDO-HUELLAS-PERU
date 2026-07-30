import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface TagProps {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  size?: 'sm' | 'md'
  onRemove?: () => void
  className?: string
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
}

export default function Tag({
  children,
  variant = 'default',
  size = 'sm',
  onRemove,
  className,
}: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 inline-flex items-center rounded-full p-0.5 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Remove"
          type="button"
        >
          <X size={size === 'sm' ? 10 : 12} />
        </button>
      )}
    </span>
  )
}
