import { forwardRef } from 'react'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SuccessStateAction {
  label: string
  onClick: () => void
}

interface SuccessStateProps {
  title: string
  message?: string
  action?: SuccessStateAction
}

const SuccessState = forwardRef<HTMLDivElement, SuccessStateProps>(
  ({ title, message, action }, ref) => {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center py-12 text-center"
        role="status"
      >
        <div className="mb-4 rounded-full bg-green-100 p-3 dark:bg-green-900/30">
          <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        {message && (
          <p className="mb-6 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
            {message}
          </p>
        )}
        {action && (
          <button
            onClick={action.onClick}
            className={cn(
              'rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white',
              'transition-colors hover:bg-primary-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
          >
            {action.label}
          </button>
        )}
      </div>
    )
  }
)

SuccessState.displayName = 'SuccessState'

export default SuccessState
