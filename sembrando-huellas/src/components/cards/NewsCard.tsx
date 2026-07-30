import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/cn'
import CardBase from './CardBase'

interface NewsCardProps {
  article: {
    title: string
    slug: string
    excerpt: string
    coverImage: string
    publishedAt: string
    category: string
    author: string
  }
  onHover?: (hovering: boolean) => void
  onClick?: () => void
  className?: string
}

export default function NewsCard({
  article,
  onHover,
  onClick,
  className,
}: NewsCardProps) {
  const formattedDate = format(new Date(article.publishedAt), "d 'de' MMMM, yyyy", { locale: es })

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
      aria-label={onClick ? `Leer noticia: ${article.title}` : undefined}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={article.coverImage}
          alt={article.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
          <time dateTime={article.publishedAt}>{formattedDate}</time>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300">
            {article.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
          {article.excerpt}
        </p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          Por {article.author}
        </p>
      </div>
    </CardBase>
  )
}
