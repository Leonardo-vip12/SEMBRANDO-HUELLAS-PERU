import { forwardRef } from 'react'
import { XCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ErrorStateRetry {
  label: string
  onClick: () => void
}

interface ErrorStateProps {
  title?: string
  message?: string
  retry?: ErrorStateRetry
}

const ErrorState = forwardRef<HTMLDivElement, ErrorStateProps>(
  ({ title = 'Algo salió mal', message, retry }, ref) => {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center py-12 text-center"
        role="alert"
      >
        <div className="mb-4 rounded-full bg-red-100 p-3 dark:bg-red-900/30">
          <XCircle size={40} className="text-red-600 dark:text-red-400" />
        </div>
        <h3 className="mb-2 text-xl font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        {message && (
          <p className="mb-6 max-w-sm text-sm text-neutral-600 dark:text-neutral-400">
            {message}
          </p>
        )}
        {retry && (
          <button
            onClick={retry.onClick}
            className={cn(
              'rounded-lg bg-primary-600 px-6 py-2 text-sm font-medium text-white',
              'transition-colors hover:bg-primary-700',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500'
            )}
          >
            {retry.label}
          </button>
        )}
      </div>
    )
  }
)

ErrorState.displayName = 'ErrorState'

export default ErrorState
