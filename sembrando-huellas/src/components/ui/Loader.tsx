import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Loader({ className, ...props }: LoaderProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-900',
        className
      )}
      {...props}
    >
      <motion.div
        className="h-12 w-12 rounded-full border-4 border-primary-200 border-t-primary-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}
