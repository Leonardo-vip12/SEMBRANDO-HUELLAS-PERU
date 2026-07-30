import { forwardRef } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { InputSize } from '@/types/design-system'

interface DatePickerInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  error?: string
  min?: string
  max?: string
  size?: InputSize
  fullWidth?: boolean
  id?: string
  disabled?: boolean
  required?: boolean
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-4 py-3 text-base',
}

const DatePickerInput = forwardRef<HTMLInputElement, DatePickerInputProps>(
  (
    {
      value,
      onChange,
      label,
      error,
      min,
      max,
      size = 'md',
      fullWidth = false,
      id,
      disabled,
      required,
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const errorId = inputId ? `${inputId}-error` : undefined

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type="date"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            min={min}
            max={max}
            disabled={disabled}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={cn(
              'w-full rounded-lg border bg-white transition-colors',
              'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
              'focus:outline-none focus:ring-2',
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500/20 dark:border-neutral-600',
              'pr-10',
              sizeClasses[size],
              '[color-scheme:light] dark:[color-scheme:dark]'
            )}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 dark:text-neutral-500">
            <Calendar size={18} />
          </div>
        </div>
        {error && (
          <p id={errorId} className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

DatePickerInput.displayName = 'DatePickerInput'
export default DatePickerInput
