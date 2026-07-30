import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { cn } from '@/lib/cn'

interface FormSuccessProps {
  message?: string
  className?: string
}

const FormSuccess = ({ message, className }: FormSuccessProps) => {
  if (!message) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      role="status"
      className={cn(
        'flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400',
        className
      )}
    >
      <CheckCircle size={16} className="shrink-0" />
      <span>{message}</span>
    </motion.div>
  )
}

FormSuccess.displayName = 'FormSuccess'
export default FormSuccess
