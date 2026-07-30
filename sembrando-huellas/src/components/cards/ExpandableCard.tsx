import { cn } from '@/lib/cn'
import { motion, AnimatePresence } from 'framer-motion'
import CardBase from './CardBase'

interface ExpandableCardProps {
  title: string
  preview: string
  expanded: boolean
  onToggle: () => void
  children: React.ReactNode
  className?: string
}

export default function ExpandableCard({
  title,
  preview,
  expanded,
  onToggle,
  children,
  className,
}: ExpandableCardProps) {
  return (
    <CardBase
      hover
      className={cn('', className)}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={expanded}
        aria-controls={`expandable-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {title}
          </h3>
          {!expanded && (
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {preview}
            </p>
          )}
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="ml-4 shrink-0 text-neutral-400 dark:text-neutral-500"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={`expandable-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pt-4 text-sm text-neutral-600 dark:text-neutral-400">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </CardBase>
  )
}
