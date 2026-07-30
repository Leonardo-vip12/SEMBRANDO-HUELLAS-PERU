import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown } from 'lucide-react'
import type { NavigationItem } from '@/types'
import { cn } from '@/lib/cn'

interface NavbarDesktopProps {
  items: NavigationItem[]
  logo?: React.ReactNode
  activePath?: string
  onNavigate?: (href: string) => void
  className?: string
}

const NavbarDesktop = forwardRef<HTMLElement, NavbarDesktopProps>(
  ({ items, logo, activePath, className }, ref) => {
    return (
      <nav ref={ref} className={cn('hidden items-center gap-1 md:flex', className)}>
        {logo && <div className="mr-6">{logo}</div>}
        {items.map((item) => {
          const isActive = activePath === item.href
          const hasChildren = item.children && item.children?.length > 0

          if (hasChildren) {
            return (
              <div key={item.href} className="group relative">
                <button
                  className={cn(
                    'flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                  )}
                >
                  {item.label}
                  <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                </button>
                <div className="invisible absolute top-full left-0 mt-1 w-48 rounded-lg border border-neutral-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-800">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className="block rounded-md px-3 py-2 text-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-700 dark:hover:text-neutral-100"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    )
  }
)

NavbarDesktop.displayName = 'NavbarDesktop'
export default NavbarDesktop
