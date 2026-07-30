import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface ProjectCardProps {
  project: {
    title: string
    slug: string
    description: string
    category: string
    coverImage: string
    status: 'active' | 'completed' | 'pending' | 'on-hold'
  }
  onHover?: (hovering: boolean) => void
  onClick?: () => void
  className?: string
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'on-hold': 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
}

export default function ProjectCard({
  project,
  onHover,
  onClick,
  className,
}: ProjectCardProps) {
  return (
    <CardBase
      hover
      className={cn('overflow-hidden', className)}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
      onClick={onClick}
      onKeyDown={onClick ? (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `Ver proyecto: ${project.title}` : undefined}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            {project.category}
          </span>
          <span
            className={cn(
              'rounded-full px-3 py-1 text-xs font-medium',
              statusStyles[project.status],
            )}
          >
            {project.status}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {project.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {project.description}
        </p>
      </div>
    </CardBase>
  )
}
