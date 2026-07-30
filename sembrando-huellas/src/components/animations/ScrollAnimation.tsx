import { useRef } from 'react'
import { motion, useInView, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface ScrollAnimationProps {
  children: ReactNode
  animation: Variants
  threshold?: number
  once?: boolean
  className?: string
}

export function ScrollAnimation({ children, animation, threshold = 0.1, once = true, className }: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={animation}
      className={className}
    >
      {children}
    </motion.div>
  )
}
