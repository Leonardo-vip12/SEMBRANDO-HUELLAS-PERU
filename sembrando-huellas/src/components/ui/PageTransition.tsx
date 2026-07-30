import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export default function PageTransition({
  children,
  className,
}: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn('', className)}
    >
      {children}
    </motion.div>
  )
}
