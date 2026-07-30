import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(
  ({ isVisible, message }, ref) => {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-black/80"
            role="status"
            aria-label={message ?? 'Loading'}
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={40} className="animate-spin text-blue-600 dark:text-blue-400" />
              {message && (
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {message}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

LoadingOverlay.displayName = 'LoadingOverlay'

export default LoadingOverlay
