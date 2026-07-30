import { useState, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/cn'

interface SidebarItem {
  label: string
  href: string
  icon?: React.ReactNode
  children?: SidebarItem[]
}

interface SidebarProps {
  items: SidebarItem[]
  activePath: string
  isCollapsed?: boolean
  onToggle?: () => void
}

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ items, activePath, isCollapsed = false, onToggle }, ref) => {
    const [expandedSections, setExpandedSections] = useState<string[]>([])

    const toggleSection = (label: string) => {
      setExpandedSections((prev) =>
        prev.includes(label)
          ? prev.filter((l) => l !== label)
          : [...prev, label]
      )
    }

    const isExpanded = (label: string) => expandedSections.includes(label)

    const renderItem = (item: SidebarItem, depth = 0) => {
      const hasChildren = item.children && item.children.length > 0
      const isActive = activePath === item.href
      const sectionOpen = isExpanded(item.label)

      return (
        <li key={item.href}>
          <div className="flex items-center">
            <Link
              to={item.href}
              className={cn(
                'flex flex-1 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              {item.icon && (
                <span className="shrink-0">{item.icon}</span>
              )}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
            {hasChildren && !isCollapsed && (
              <button
                onClick={() => toggleSection(item.label)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                aria-label={sectionOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
                aria-expanded={sectionOpen}
              >
                <ChevronDown
                  size={16}
                  className={cn(
                    'transition-transform',
                    sectionOpen && 'rotate-180'
                  )}
                />
              </button>
            )}
          </div>
          {hasChildren && sectionOpen && !isCollapsed && (
            <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3">
              {item.children!.map((child) => renderItem(child, depth + 1))}
            </ul>
          )}
        </li>
      )
    }

    return (
      <aside
        ref={ref}
        className={cn(
          'flex h-full flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-200',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className="flex items-center justify-end border-b border-gray-200 dark:border-gray-700 p-3">
          {onToggle && (
            <button
              onClick={onToggle}
              className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <ChevronLeft
                size={18}
                className={cn('transition-transform', isCollapsed && 'rotate-180')}
              />
            </button>
          )}
        </div>
        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-1">
            {items.map((item) => renderItem(item))}
          </ul>
        </nav>
      </aside>
    )
  }
)

Sidebar.displayName = 'Sidebar'

export default Sidebar
