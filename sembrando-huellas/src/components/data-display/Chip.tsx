import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ChipProps {
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  onRemove?: () => void
  onClick?: () => void
  avatar?: string
}

const variantClasses: Record<string, string> = {
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200',
  secondary: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export default function Chip({
  label,
  icon,
  variant = 'default',
  onRemove,
  onClick,
  avatar,
}: ChipProps) {
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium transition-colors',
        variantClasses[variant],
        onClick && 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary-500'
      )}
    >
      {avatar && (
        <img
          src={avatar}
          alt=""
          className="h-5 w-5 rounded-full object-cover"
          aria-hidden="true"
        />
      )}
      {icon && <span aria-hidden="true">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-0.5 inline-flex items-center rounded-full p-0.5 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label={`Remove ${label}`}
          type="button"
        >
          <X size={12} />
        </button>
      )}
    </Component>
  )
}
