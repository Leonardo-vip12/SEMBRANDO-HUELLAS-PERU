import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ThemeToggleProps {
  mode: 'light' | 'dark'
  onToggle: () => void
}

const iconVariants = {
  initial: { rotate: -90, opacity: 0, scale: 0.5 },
  animate: { rotate: 0, opacity: 1, scale: 1 },
  exit: { rotate: 90, opacity: 0, scale: 0.5 },
}

const ThemeToggle = forwardRef<HTMLButtonElement, ThemeToggleProps>(
  ({ mode, onToggle }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onToggle}
        className={cn(
          'relative flex items-center justify-center rounded-lg p-2 transition-colors',
          'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
        )}
        aria-label={`Switch to ${mode === 'light' ? 'dark' : 'light'} mode`}
      >
        <motion.div
          key={mode}
          variants={iconVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
        >
          {mode === 'light' ? <Sun size={20} /> : <Moon size={20} />}
        </motion.div>
      </button>
    )
  }
)

ThemeToggle.displayName = 'ThemeToggle'

export default ThemeToggle
