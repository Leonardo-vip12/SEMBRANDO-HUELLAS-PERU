import { cn } from '@/lib/cn'

interface FormFieldProps {
  name: string
  label?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

const FormField = ({
  name,
  label,
  error,
  required = false,
  children,
  className,
}: FormFieldProps) => {
  const fieldId = name

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label
          htmlFor={fieldId}
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p id={`${fieldId}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

FormField.displayName = 'FormField'
export default FormField
