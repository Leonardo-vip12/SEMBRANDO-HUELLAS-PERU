import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface ZoomInProps {
  children: ReactNode
  delay?: number
  duration?: number
  scale?: number
}

export function ZoomIn({ children, delay = 0, duration = 0.5, scale = 0.8 }: ZoomInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
