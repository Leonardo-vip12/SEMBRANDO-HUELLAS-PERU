import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
  highlight?: boolean
  className?: string
}

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  highlight = false,
  className,
}: FeatureCardProps) {
  return (
    <CardBase
      variant={highlight ? 'elevated' : 'default'}
      hover
      className={cn(
        'group',
        highlight && 'ring-2 ring-primary-500/20',
        className,
      )}
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
        <Icon size={28} />
      </div>
      <h3 className="mb-2 text-center text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="text-center text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </p>
    </CardBase>
  )
}
