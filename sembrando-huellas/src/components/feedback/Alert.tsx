import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  message: string
  onClose?: () => void
  icon?: React.ReactNode
}

const variantStyles: Record<AlertVariant, { container: string; icon: React.ReactNode }> = {
  info: {
    container: 'border-l-4 border-l-blue-500 bg-blue-50 dark:bg-blue-950/50',
    icon: <Info size={18} className="text-blue-500" />,
  },
  success: {
    container: 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-950/50',
    icon: <CheckCircle size={18} className="text-green-500" />,
  },
  warning: {
    container: 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/50',
    icon: <AlertTriangle size={18} className="text-yellow-500" />,
  },
  error: {
    container: 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-950/50',
    icon: <XCircle size={18} className="text-red-500" />,
  },
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = 'info', title, message, onClose, icon }, ref) => {
    const styles = variantStyles[variant]

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={cn('flex gap-3 rounded-lg p-4', styles.container)}
          role="alert"
        >
          <span className="mt-0.5 shrink-0">{icon ?? styles.icon}</span>
          <div className="flex-1">
            {title && (
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </p>
            )}
            <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="shrink-0 rounded p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Dismiss alert"
            >
              <X size={16} />
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    )
  }
)

Alert.displayName = 'Alert'

export default Alert
