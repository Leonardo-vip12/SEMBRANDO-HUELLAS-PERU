import { forwardRef } from 'react'
import { Inbox } from 'lucide-react'
import { cn } from '@/lib/cn'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeStyles = {
  sm: { icon: 32, title: 'text-base', desc: 'text-sm', padding: 'py-8' },
  md: { icon: 48, title: 'text-xl', desc: 'text-sm', padding: 'py-12' },
  lg: { icon: 64, title: 'text-2xl', desc: 'text-base', padding: 'py-16' },
}

const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, size = 'md' }, ref) => {
    const styles = sizeStyles[size]

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center text-center',
          styles.padding
        )}
      >
        <div className="mb-4 text-gray-300 dark:text-gray-600">
          {icon ?? <Inbox size={styles.icon} />}
        </div>
        <h3
          className={cn(
            'mb-2 font-semibold text-gray-900 dark:text-gray-100',
            styles.title
          )}
        >
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'mb-6 max-w-sm text-gray-500 dark:text-gray-400',
              styles.desc
            )}
          >
            {description}
          </p>
        )}
        {action && <div>{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'

export default EmptyState
