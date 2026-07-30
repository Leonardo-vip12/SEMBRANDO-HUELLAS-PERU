import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface PartnerCardProps {
  partner: {
    name: string
    description: string
    website: string
    logo: string
    type: string
  }
  className?: string
}

export default function PartnerCard({
  partner,
  className,
}: PartnerCardProps) {
  return (
    <CardBase
      variant="outlined"
      hover
      className={cn('flex flex-col items-center text-center', className)}
    >
      <div className="mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-xl bg-neutral-50 p-3 dark:bg-neutral-700/50">
        <img
          src={partner.logo}
          alt={`Logo de ${partner.name}`}
          className="max-h-full max-w-full object-contain"
          loading="lazy"
        />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {partner.name}
      </h3>
      <span className="mb-2 inline-block rounded-full bg-primary-50 px-3 py-0.5 text-xs font-medium text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
        {partner.type}
      </span>
      <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-400">
        {partner.description}
      </p>
      <a
        href={partner.website}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        aria-label={`Sitio web de ${partner.name}`}
      >
        Visitar sitio
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </CardBase>
  )
}
