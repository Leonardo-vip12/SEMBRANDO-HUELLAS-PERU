import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface PrimaryButtonProps {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

const PrimaryButton = forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ className, children, disabled, type = 'button', onClick }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        onClick={onClick}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'rounded-lg bg-primary-600 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-700',
          className
        )}
      >
        {children}
      </motion.button>
    )
  }
)

PrimaryButton.displayName = 'PrimaryButton'
export default PrimaryButton
