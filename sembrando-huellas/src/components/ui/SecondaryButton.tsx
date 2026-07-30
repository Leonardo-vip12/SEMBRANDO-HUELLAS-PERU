import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface SecondaryButtonProps {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
}

const SecondaryButton = forwardRef<HTMLButtonElement, SecondaryButtonProps>(
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
          'rounded-lg border-2 border-primary-600 px-6 py-3 font-medium text-primary-600 transition-colors hover:bg-primary-50',
          className
        )}
      >
        {children}
      </motion.button>
    )
  }
)

SecondaryButton.displayName = 'SecondaryButton'
export default SecondaryButton
