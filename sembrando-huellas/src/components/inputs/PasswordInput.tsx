import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import Input from './Input'
import type { InputHTMLAttributes } from 'react'
import type { InputSize } from '@/types/design-system'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string
  error?: string
  helperText?: string
  size?: InputSize
  fullWidth?: boolean
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, helperText, size, fullWidth, className, ...props }, ref) => {
    const [visible, setVisible] = useState(false)

    return (
      <Input
        ref={ref}
        type={visible ? 'text' : 'password'}
        label={label}
        error={error}
        helperText={helperText}
        size={size}
        fullWidth={fullWidth}
        className={className}
        rightIcon={
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="pointer-events-auto cursor-pointer text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
            aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            tabIndex={-1}
          >
            {visible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        }
        {...props}
      />
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
export default PasswordInput
