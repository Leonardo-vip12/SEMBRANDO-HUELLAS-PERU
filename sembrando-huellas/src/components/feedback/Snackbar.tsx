import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SnackbarAction {
  label: string
  onClick: () => void
}

interface SnackbarProps {
  message: string
  action?: SnackbarAction
  isOpen: boolean
  onClose: () => void
}

const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
  ({ message, action, isOpen, onClose }, ref) => {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
          >
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg bg-gray-900 px-4 py-3 shadow-lg',
                'dark:bg-gray-800'
              )}
              role="alert"
            >
              <p className="text-sm text-white">{message}</p>
              {action && (
                <button
                  onClick={action.onClick}
                  className="shrink-0 text-sm font-semibold text-blue-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {action.label}
                </button>
              )}
              <button
                onClick={onClose}
                className="shrink-0 rounded p-0.5 text-gray-400 transition-colors hover:text-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

Snackbar.displayName = 'Snackbar'

export default Snackbar
