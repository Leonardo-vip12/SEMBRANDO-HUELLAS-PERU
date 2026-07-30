import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import Container from '@/components/ui/Container'
import SectionTitle from '@/components/ui/SectionTitle'
import Icon from '@/components/ui/Icon'
import { cn } from '@/lib/cn'

interface Stat {
  label: string
  value: string
  icon?: LucideIcon
  prefix?: string
  suffix?: string
}

interface StatisticsSectionProps {
  title?: string
  subtitle?: string
  stats: Stat[]
  columns?: 2 | 3 | 4
}

export default function StatisticsSection({
  title,
  subtitle,
  stats,
  columns = 4,
}: StatisticsSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="bg-gray-50 py-16 dark:bg-gray-900 md:py-24">
      <Container>
        {title && <SectionTitle title={title} subtitle={subtitle} />}
        <div
          ref={ref}
          className={cn(
            'grid grid-cols-1 gap-8',
            columns >= 2 && 'sm:grid-cols-2',
            columns >= 3 && 'lg:grid-cols-3',
            columns >= 4 && 'xl:grid-cols-4'
          )}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              {stat.icon && (
                <div className="mb-4 inline-flex rounded-full bg-primary-100 p-3 text-primary-600 dark:bg-primary-900 dark:text-primary-300">
                  <Icon name={stat.icon} size={28} />
                </div>
              )}
              <div className="text-4xl font-bold md:text-5xl">
                {stat.prefix && (
                  <span className="text-primary-600">{stat.prefix}</span>
                )}
                <span>{stat.value}</span>
                {stat.suffix && (
                  <span className="text-primary-600">{stat.suffix}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  )
}
