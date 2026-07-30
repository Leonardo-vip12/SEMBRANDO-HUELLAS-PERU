import { cn } from '@/lib/cn'

interface FormSectionProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
}

const FormSection = ({ title, description, children, className }: FormSectionProps) => {
  return (
    <fieldset className={cn('space-y-4', className)}>
      <div className="space-y-1">
        <legend className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </legend>
        {description && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </fieldset>
  )
}

FormSection.displayName = 'FormSection'
export default FormSection
