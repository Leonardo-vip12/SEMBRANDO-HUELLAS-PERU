import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface TimelineItem {
  date: string
  title: string
  description: string
  icon?: LucideIcon
  active?: boolean
}

interface TimelineProps {
  items: TimelineItem[]
  layout?: 'left' | 'alternating'
}

function TimelineDot({ icon, active }: { icon?: LucideIcon; active?: boolean }) {
  return (
    <div
      className={cn(
        'z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2',
        active
          ? 'border-primary-600 bg-primary-600 text-white'
          : 'border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800'
      )}
    >
      {icon ? (
        <Icon name={icon} size={16} />
      ) : (
        <div className={cn('h-2.5 w-2.5 rounded-full', active ? 'bg-white' : 'bg-gray-400 dark:bg-gray-500')} />
      )}
    </div>
  )
}

export default function Timeline({ items }: TimelineProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-5 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
      <div className="space-y-8">
        {items.map((item, index) => (
          <motion.div
            key={item.date + item.title}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="relative flex items-start gap-6 pl-0"
          >
            <TimelineDot icon={item.icon} active={item.active} />
            <div className="flex-1 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                {item.date}
              </span>
              <h3 className="mt-1 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
