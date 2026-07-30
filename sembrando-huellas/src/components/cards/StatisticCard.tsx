import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface StatisticCardProps {
  label: string
  value: number
  trend?: 'up' | 'down' | 'neutral'
  icon?: LucideIcon
  prefix?: string
  suffix?: string
  className?: string
}

const trendIcons = {
  up: (
    <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  down: (
    <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
    </svg>
  ),
  neutral: null,
}

export default function StatisticCard({
  label,
  value,
  trend,
  icon: Icon,
  prefix,
  suffix,
  className,
}: StatisticCardProps) {
  const displayValue = [
    prefix ?? '',
    value.toLocaleString(),
    suffix ?? '',
  ].join('')

  return (
    <CardBase
      variant="default"
      className={cn('flex items-center gap-4', className)}
    >
      {Icon && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
          <Icon size={24} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {label}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {displayValue}
          </p>
          {trend && trend !== 'neutral' && (
            <span className="flex items-center">{trendIcons[trend]}</span>
          )}
        </div>
      </div>
    </CardBase>
  )
}
