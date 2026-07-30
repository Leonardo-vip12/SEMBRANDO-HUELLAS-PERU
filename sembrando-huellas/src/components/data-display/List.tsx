import { cn } from '@/lib/cn'

interface ListItem {
  id: string
  content: React.ReactNode
  secondary?: React.ReactNode
  icon?: React.ReactNode
  divider?: boolean
}

interface ListProps {
  items: ListItem[]
  variant?: 'simple' | 'bulleted' | 'numbered' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'text-sm py-2',
  md: 'text-base py-3',
  lg: 'text-lg py-4',
}

export default function List({
  items,
  variant = 'simple',
  size = 'md',
  className,
}: ListProps) {
  const Tag = variant === 'numbered' ? 'ol' : 'ul'

  return (
    <Tag
      className={cn(
        variant === 'bulleted' && 'list-inside list-disc',
        variant === 'numbered' && 'list-inside list-decimal',
        className
      )}
    >
      {items.map((item, index) => {
        const showDivider = item.divider ?? variant === 'simple'

        if (variant === 'simple' || variant === 'icon') {
          return (
            <li
              key={item.id}
              className={cn(
                'flex items-start gap-3',
                sizeClasses[size],
                showDivider && index < items.length - 1 && 'border-b border-gray-200 dark:border-gray-700'
              )}
            >
              {variant === 'icon' && item.icon && (
                <span className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <div className="flex-1">
                <div>{item.content}</div>
                {item.secondary && (
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                    {item.secondary}
                  </p>
                )}
              </div>
            </li>
          )
        }

        return (
          <li key={item.id} className={cn(sizeClasses[size])}>
            <div>{item.content}</div>
            {item.secondary && (
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {item.secondary}
              </p>
            )}
          </li>
        )
      })}
    </Tag>
  )
}
