import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface EducationCardProps {
  program: {
    title: string
    description: string
    icon: LucideIcon
    duration: string
    level: string
  }
  className?: string
}

export default function EducationCard({
  program,
  className,
}: EducationCardProps) {
  const Icon = program.icon

  return (
    <CardBase
      variant="elevated"
      hover
      className={cn('group', className)}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors duration-300 group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400 dark:group-hover:bg-primary-600 dark:group-hover:text-white">
        <Icon size={24} />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {program.title}
      </h3>
      <p className="mb-4 line-clamp-3 text-sm text-neutral-600 dark:text-neutral-400">
        {program.description}
      </p>
      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {program.duration}
        </span>
        <span className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {program.level}
        </span>
      </div>
    </CardBase>
  )
}
