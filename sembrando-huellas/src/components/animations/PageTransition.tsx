import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

type TransitionType = 'fade' | 'slide' | 'scale' | 'none'

interface PageTransitionProps {
  children: ReactNode
  className?: string
  type?: TransitionType
}

const variants: Record<TransitionType, Variants> = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  none: {
    initial: {},
    animate: {},
    exit: {},
  },
}

export function PageTransition({ children, className, type = 'fade' }: PageTransitionProps) {
  const v = variants[type]

  return (
    <motion.div
      variants={v}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
