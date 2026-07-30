import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface ImpactCardProps {
  metric: {
    label: string
    value: number
    icon: LucideIcon
    description: string
    prefix?: string
    suffix?: string
  }
  className?: string
}

export default function ImpactCard({
  metric,
  className,
}: ImpactCardProps) {
  const Icon = metric.icon
  const displayValue = [
    metric.prefix ?? '',
    metric.value.toLocaleString(),
    metric.suffix ?? '',
  ].join('')

  return (
    <CardBase
      variant="elevated"
      className={cn('text-center', className)}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
        <Icon size={28} />
      </div>
      <p className="mb-1 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
        {displayValue}
      </p>
      <p className="mb-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        {metric.label}
      </p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        {metric.description}
      </p>
    </CardBase>
  )
}
