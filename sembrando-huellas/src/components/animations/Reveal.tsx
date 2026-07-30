import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'

type RevealDirection = 'up' | 'down' | 'left' | 'right'

interface RevealProps {
  children: ReactNode
  delay?: number
  direction?: RevealDirection
  threshold?: number
  once?: boolean
}

const offsetMap: Record<RevealDirection, Record<string, number>> = {
  up: { y: 40 },
  down: { y: -40 },
  left: { x: 40 },
  right: { x: -40 },
}

export function Reveal({ children, delay = 0, direction = 'up', threshold = 0.1, once = true }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const offset = offsetMap[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...offset }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...offset }}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
