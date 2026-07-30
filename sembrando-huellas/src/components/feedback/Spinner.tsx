import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/cn'

type SpinnerSize = 'sm' | 'md' | 'lg'
type SpinnerColor = 'primary' | 'white' | 'neutral'

interface SpinnerProps {
  size?: SpinnerSize
  color?: SpinnerColor
  className?: string
}

const sizeMap: Record<SpinnerSize, number> = {
  sm: 16,
  md: 24,
  lg: 36,
}

const colorMap: Record<SpinnerColor, string> = {
  primary: 'text-blue-600 dark:text-blue-400',
  white: 'text-white',
  neutral: 'text-gray-400 dark:text-gray-500',
}

const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size = 'md', color = 'primary', className }, ref) => {
    const dimension = sizeMap[size]

    return (
      <motion.svg
        ref={ref}
        className={cn(colorMap[color], className)}
        width={dimension}
        height={dimension}
        viewBox="0 0 24 24"
        fill="none"
        aria-label="Loading"
        role="status"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="3"
          className="opacity-20"
        />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </motion.svg>
    )
  }
)

Spinner.displayName = 'Spinner'

export default Spinner
