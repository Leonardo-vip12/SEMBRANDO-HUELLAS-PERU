import { forwardRef, useRef, useEffect, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  indeterminate?: boolean
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, indeterminate, className, id, ...props }, ref) => {
    const innerRef = useRef<HTMLInputElement>(null)
    const resolvedRef = (ref ||
      innerRef) as React.RefObject<HTMLInputElement | null>

    useEffect(() => {
      if (resolvedRef?.current) {
        resolvedRef.current.indeterminate = indeterminate ?? false
      }
    }, [indeterminate, resolvedRef])

    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = checkboxId ? `${checkboxId}-error` : undefined

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={cn(
            'flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700 dark:text-neutral-300',
            props.disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <div className="relative flex items-center justify-center">
            <input
              ref={resolvedRef}
              id={checkboxId}
              type="checkbox"
              aria-invalid={!!error}
              aria-describedby={error ? errorId : undefined}
              className={cn(
                'peer h-4 w-4 appearance-none rounded border transition-colors',
                'border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-800',
                'checked:border-primary-600 checked:bg-primary-600',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/20',
                'indeterminate:border-primary-600 indeterminate:bg-primary-600',
                error && 'border-red-500',
                props.disabled && 'cursor-not-allowed',
                className
              )}
              {...props}
            />
            <svg
              className="pointer-events-none absolute hidden peer-checked:block"
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 5L4.5 7.5L8 2.5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {indeterminate && (
              <svg
                className="pointer-events-none absolute"
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden="true"
              >
                <rect x="2" y="4" width="6" height="2" fill="white" rx="1" />
              </svg>
            )}
          </div>
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

Checkbox.displayName = 'Checkbox'
export default Checkbox
