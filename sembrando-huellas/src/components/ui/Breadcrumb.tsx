import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/cn'

interface BreadcrumbItem {
  label: string
  href?: string
  isCurrent?: boolean
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({
  items,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-2 text-sm', className)}
      {...props}
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
          {item.isCurrent || !item.href ? (
            <span
              className={cn(
                item.isCurrent
                  ? 'font-medium text-gray-900'
                  : 'text-gray-500'
              )}
              aria-current={item.isCurrent ? 'page' : undefined}
            >
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href}
              className="text-gray-500 transition-colors hover:text-gray-900"
            >
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  )
}
