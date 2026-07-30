import { type FormHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

const Form = ({ onSubmit, children, className, ...props }: FormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={cn('flex flex-col gap-6', className)}
      {...props}
    >
      {children}
    </form>
  )
}

Form.displayName = 'Form'
export default Form
