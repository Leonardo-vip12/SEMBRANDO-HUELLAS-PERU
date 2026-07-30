import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RotateInProps {
  children: ReactNode
  degrees?: number
  delay?: number
  duration?: number
}

export function RotateIn({ children, degrees = 90, delay = 0, duration = 0.5 }: RotateInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: degrees }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
