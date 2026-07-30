import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type SlideDirection = 'left' | 'right' | 'up' | 'down'

interface SlideInProps {
  children: ReactNode
  direction?: SlideDirection
  distance?: number
  delay?: number
  duration?: number
}

const axisMap: Record<SlideDirection, { axis: 'x' | 'y'; sign: number }> = {
  left: { axis: 'x', sign: -1 },
  right: { axis: 'x', sign: 1 },
  up: { axis: 'y', sign: -1 },
  down: { axis: 'y', sign: 1 },
}

export function SlideIn({ children, direction = 'left', distance = 50, delay = 0, duration = 0.5 }: SlideInProps) {
  const { axis, sign } = axisMap[direction]

  return (
    <motion.div
      initial={{ [axis]: sign * distance, opacity: 0 }}
      animate={{ [axis]: 0, opacity: 1 }}
      transition={{ duration, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
