import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const radioId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = radioId ? `${radioId}-error` : undefined

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={radioId}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <span className="relative flex h-4 w-4 items-center justify-center">
            <input
              ref={ref}
              id={radioId}
              type="radio"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className="peer sr-only"
              {...props}
            />
            <span
              className={cn(
                'flex h-4 w-4 items-center justify-center rounded-full border-2 transition-colors',
                'border-neutral-300 dark:border-neutral-600',
                'peer-checked:border-primary-600',
                'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500/20',
                error && 'border-red-500',
                props.disabled && 'cursor-not-allowed',
                className
              )}
            >
              <span className="h-2 w-2 rounded-full bg-primary-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
            </span>
          </span>
          {label}
        </label>
        {error && (
          <p id={errorId} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'
export default Radio
