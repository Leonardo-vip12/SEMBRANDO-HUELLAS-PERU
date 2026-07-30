import { useEffect, useCallback, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastVariant = 'info' | 'success' | 'warning' | 'error'

interface ToastProps {
  id: string
  message: string
  variant?: ToastVariant
  duration?: number
  onDismiss: (id: string) => void
}

const variantStyles: Record<ToastVariant, { container: string; icon: React.ReactNode }> = {
  info: {
    container: 'border-l-4 border-l-blue-500 bg-white dark:bg-gray-800',
    icon: <Info size={18} className="text-blue-500" />,
  },
  success: {
    container: 'border-l-4 border-l-green-500 bg-white dark:bg-gray-800',
    icon: <CheckCircle size={18} className="text-green-500" />,
  },
  warning: {
    container: 'border-l-4 border-l-yellow-500 bg-white dark:bg-gray-800',
    icon: <AlertTriangle size={18} className="text-yellow-500" />,
  },
  error: {
    container: 'border-l-4 border-l-red-500 bg-white dark:bg-gray-800',
    icon: <XCircle size={18} className="text-red-500" />,
  },
}

const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ id, message, variant = 'info', duration = 5000, onDismiss }, ref) => {
    const dismiss = useCallback(() => {
      onDismiss(id)
    }, [id, onDismiss])

    useEffect(() => {
      if (duration <= 0) return
      const timer = setTimeout(dismiss, duration)
      return () => clearTimeout(timer)
    }, [duration, dismiss])

    const styles = variantStyles[variant]

    return (
      <AnimatePresence>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={cn(
            'flex items-center gap-3 rounded-lg p-4 shadow-lg',
            'border border-gray-200 dark:border-gray-700',
            styles.container
          )}
          role="alert"
        >
          <span className="shrink-0">{styles.icon}</span>
          <p className="flex-1 text-sm text-gray-800 dark:text-gray-200">{message}</p>
          <button
            onClick={dismiss}
            className="shrink-0 rounded p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </motion.div>
      </AnimatePresence>
    )
  }
)

Toast.displayName = 'Toast'

export default Toast
