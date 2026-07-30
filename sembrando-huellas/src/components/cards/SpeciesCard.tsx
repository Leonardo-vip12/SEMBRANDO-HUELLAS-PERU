import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface SpeciesCardProps {
  species: {
    name: string
    scientificName: string
    conservationStatus: 'safe' | 'vulnerable' | 'endangered' | 'critical'
    habitat: string
    image: string
    slug: string
  }
  onHover?: (hovering: boolean) => void
  onClick?: () => void
  className?: string
}

const statusStyles: Record<string, string> = {
  safe: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  vulnerable: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  endangered: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  critical: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

export default function SpeciesCard({
  species,
  onHover,
  onClick,
  className,
}: SpeciesCardProps) {
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
      aria-label={onClick ? `Ver especie: ${species.name}` : undefined}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={species.image}
          alt={species.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-2 pt-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {species.name}
        </h3>
        <p className="text-sm italic text-neutral-500 dark:text-neutral-400">
          {species.scientificName}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'rounded-full px-3 py-0.5 text-xs font-medium',
              statusStyles[species.conservationStatus],
            )}
          >
            {species.conservationStatus}
          </span>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {species.habitat}
        </p>
      </div>
    </CardBase>
  )
}
