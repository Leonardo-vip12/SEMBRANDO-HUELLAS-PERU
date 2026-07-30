import { useEffect, useCallback, useState, useRef, forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface MegaMenuItem {
  label: string
  href: string
  description?: string
  icon?: React.ReactNode
}

interface MegaMenuColumn {
  title: string
  items: MegaMenuItem[]
}

interface MegaMenuProps {
  trigger: React.ReactNode
  columns: MegaMenuColumn[]
  isOpen?: boolean
  onClose?: () => void
}

const MegaMenu = forwardRef<HTMLDivElement, MegaMenuProps>(
  ({ trigger, columns, isOpen, onClose }, ref) => {
    const [open, setOpen] = useState(isOpen ?? false)
    const menuRef = useRef<HTMLDivElement>(null)

    const isControlled = isOpen !== undefined
    const currentOpen = isControlled ? isOpen : open

    const toggle = useCallback(() => {
      if (isControlled) {
        if (currentOpen && onClose) onClose()
      } else {
        setOpen((prev) => !prev)
      }
    }, [isControlled, currentOpen, onClose])

    const close = useCallback(() => {
      if (isControlled) {
        onClose?.()
      } else {
        setOpen(false)
      }
    }, [isControlled, onClose])

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && currentOpen) {
          close()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [currentOpen, close])

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node) && currentOpen) {
          close()
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [currentOpen, close])

    return (
      <div ref={menuRef} className="relative inline-block">
        <div onClick={toggle} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() } }} role="button" tabIndex={0} aria-expanded={currentOpen} aria-haspopup="true">
          {trigger}
        </div>
        <AnimatePresence>
          {currentOpen && (
            <motion.div
              ref={ref}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full z-40 mt-2 w-auto min-w-[600px] rounded-xl border border-neutral-200 bg-white p-6 shadow-lg dark:border-neutral-700 dark:bg-neutral-900"
              role="menu"
            >
              <div className="grid grid-cols-3 gap-6">
                {columns.map((column) => (
                  <div key={column.title}>
                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      {column.title}
                    </h3>
                    <ul className="space-y-2">
                      {column.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            to={item.href}
                            onClick={close}
                            className="group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                            role="menuitem"
                          >
                            {item.icon && (
                              <span className="mt-0.5 shrink-0 text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300">
                                {item.icon}
                              </span>
                            )}
                            <div>
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {item.label}
                              </p>
                              {item.description && (
                                <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

MegaMenu.displayName = 'MegaMenu'

export default MegaMenu
