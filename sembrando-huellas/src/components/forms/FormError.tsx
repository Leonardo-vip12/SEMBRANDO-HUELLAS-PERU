import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FormErrorProps {
  message?: string
  className?: string
}

const FormError = ({ message, className }: FormErrorProps) => {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      role="alert"
      className={cn(
        'flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400',
        className
      )}
    >
      <AlertCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </motion.div>
  )
}

FormError.displayName = 'FormError'
export default FormError
