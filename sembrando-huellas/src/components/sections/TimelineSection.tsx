import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import { cn } from '@/lib/cn'

interface TimelineEvent {
  year: string
  title: string
  description: string
  image?: string
}

interface TimelineSectionProps {
  title?: string
  subtitle?: string
  events: TimelineEvent[]
  layout?: 'alternating' | 'left'
}

function TimelineItem({
  event,
  index,
  layout,
}: {
  event: TimelineEvent
  index: number
  layout: 'alternating' | 'left'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const isLeft = layout === 'left' || index % 2 === 0

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-start gap-8 pb-12',
        layout === 'alternating' && (isLeft ? 'flex-row' : 'flex-row-reverse')
      )}
    >
      <div className="hidden flex-col items-center md:flex">
        <div className="z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white">
          {index + 1}
        </div>
        {index < 0 && (
          <div className="h-full w-0.5 bg-gray-300 dark:bg-gray-600" />
        )}
      </div>
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isLeft ? -40 : 40 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(
          'flex-1 rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800',
          !isLeft && layout === 'alternating' && 'md:text-right'
        )}
      >
        <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
          {event.year}
        </span>
        <h3 className="mt-1 text-xl font-bold">{event.title}</h3>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {event.description}
        </p>
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="mt-4 rounded-lg object-cover"
          />
        )}
      </motion.div>
    </div>
  )
}

export default function TimelineSection({
  title,
  subtitle,
  events,
  layout = 'alternating',
}: TimelineSectionProps) {
  return (
    <section className="py-16 md:py-24">
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div className="relative">
          <div className="absolute left-5 top-0 hidden h-full w-0.5 bg-gray-300 dark:bg-gray-600 md:block" />
          <div className="space-y-0">
            {events.map((event, index) => (
              <TimelineItem
                key={event.year + event.title}
                event={event}
                index={index}
                layout={layout}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}
