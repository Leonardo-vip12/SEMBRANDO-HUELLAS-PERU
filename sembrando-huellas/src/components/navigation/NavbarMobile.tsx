import { useEffect, useCallback, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import type { NavigationItem } from '@/types'
import { cn } from '@/lib/cn'

interface NavbarMobileProps {
  items: NavigationItem[]
  logo: React.ReactNode
  activePath: string
  onNavigate: (href: string) => void
  isOpen: boolean
  onToggle: () => void
}

const sidebarVariants = {
  hidden: { x: '-100%' },
  visible: { x: 0 },
  exit: { x: '-100%' },
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
}

const NavbarMobile = forwardRef<HTMLDivElement, NavbarMobileProps>(
  ({ items, logo, activePath, onNavigate, isOpen, onToggle }, ref) => {
    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isOpen) {
          onToggle()
        }
      },
      [isOpen, onToggle]
    )

    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [isOpen])

    useEffect(() => {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    return (
      <AnimatePresence>
        {isOpen && (
          <div ref={ref} className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
            <motion.div
              key="backdrop"
              variants={backdropVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50"
              onClick={onToggle}
              aria-hidden="true"
            />
            <motion.div
              key="sidebar"
              variants={sidebarVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed left-0 top-0 flex h-full w-72 flex-col bg-white dark:bg-neutral-900 shadow-xl"
            >
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 px-4 py-4">
                {logo}
                <button
                  onClick={onToggle}
                  className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                <ul className="space-y-1 px-2">
                  {items.map((item) => (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => {
                          onNavigate(item.href)
                          onToggle()
                        }}
                        className={cn(
                          'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                          activePath === item.href
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                            : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        )}
                      >
                        {item.label}
                      </Link>
                      {item.children && item.children.length > 0 && (
                        <ul className="ml-4 mt-1 space-y-1 border-l border-neutral-200 dark:border-neutral-700 pl-3">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                to={child.href}
                                onClick={() => {
                                  onNavigate(child.href)
                                  onToggle()
                                }}
                                className={cn(
                                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                                  activePath === child.href
                                    ? 'text-primary-700 dark:text-primary-300'
                                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    )
  }
)

NavbarMobile.displayName = 'NavbarMobile'

export default NavbarMobile
