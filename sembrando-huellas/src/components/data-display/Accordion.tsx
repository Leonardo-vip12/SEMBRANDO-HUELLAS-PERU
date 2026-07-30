import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/cn'

interface AccordionItem {
  id: string
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  defaultExpanded?: string[]
  className?: string
}

export default function Accordion({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className,
}: AccordionProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpanded)
  )

  const toggleItem = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (!allowMultiple) {
          next.clear()
        }
        next.add(id)
      }
      return next
    })
  }

  return (
    <div className={cn('divide-y divide-gray-200 dark:divide-gray-700', className)}>
      {items.map((item) => {
        const isExpanded = expandedIds.has(item.id)
        return (
          <div key={item.id}>
            <button
              onClick={() => toggleItem(item.id)}
              className="flex w-full items-center justify-between px-4 py-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              aria-expanded={isExpanded}
              aria-controls={`accordion-panel-${item.id}`}
            >
              <span className="text-base font-medium">{item.title}</span>
              <ChevronDown
                size={20}
                className={cn(
                  'shrink-0 text-gray-500 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )}
              />
            </button>
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  id={`accordion-panel-${item.id}`}
                  key={`panel-${item.id}`}
                  role="region"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-400">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
