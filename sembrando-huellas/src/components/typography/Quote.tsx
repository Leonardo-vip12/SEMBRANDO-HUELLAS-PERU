import { cn } from '@/lib/cn'

interface QuoteProps extends React.HTMLAttributes<HTMLElement> {
  author?: string
  source?: string
}

export default function Quote({
  author,
  source,
  className,
  children,
  ...props
}: QuoteProps) {
  return (
    <figure
      className={cn(
        'border-l-4 border-primary-500 pl-6 italic text-neutral-700 dark:text-neutral-300',
        className,
      )}
      {...props}
    >
      <blockquote className="text-lg md:text-xl">{children}</blockquote>
      {(author || source) && (
        <figcaption className="mt-3 text-sm not-italic text-neutral-500 dark:text-neutral-400">
          {author && <span className="font-medium">{author}</span>}
          {author && source && <span className="mx-1">&mdash;</span>}
          {source && <cite>{source}</cite>}
        </figcaption>
      )}
    </figure>
  )
}