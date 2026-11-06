import { useEffect, useRef } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Search, Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useConfig } from '@/contexts/ConfigContext'
import { useUI } from '@/contexts/UIContext'
import { useSearchContext } from '@/contexts/SearchContext'
import { useNotifications } from '@/hooks/useNotifications'
import { navigationConfig, featureNavConfig } from '@/config/navigation'
import { cn } from '@/lib/cn'
import LanguageSelector from '@/components/navigation/LanguageSelector'
import GlobalSearch from '@/components/features/GlobalSearch'

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

export default function Navbar({ className, ...props }: NavbarProps) {
  const { t } = useTranslation()
  const { siteConfig } = useConfig()
  const { mobileMenuOpen, toggleMobileMenu } = useUI()
  const { openSearch } = useSearchContext()
  const { unreadCount } = useNotifications()
  const { pathname } = useLocation()

  const moreRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    function closeOutside(event: PointerEvent) {
      if (!moreRef.current?.contains(event.target as Node)) {
        moreRef.current?.removeAttribute('open')
      }
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  const mainLinks = navigationConfig.slice(0, 6)
  const extraLinks = navigationConfig.slice(6)

  return (
    <>
      <GlobalSearch />
      <nav className={cn('fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md dark:bg-neutral-900/90', className)} {...props}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-base sm:text-xl font-bold text-primary-600 dark:text-primary-400">
            {siteConfig.name}
          </Link>

          <div className="hidden items-center gap-1 xl:flex">
            {mainLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
                )}
              >
                {t(item.label)}
              </Link>
            ))}
            <details
              ref={moreRef}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  event.currentTarget.removeAttribute('open')
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') {
                  event.currentTarget.removeAttribute('open')
                  event.currentTarget.querySelector('summary')?.focus()
                }
              }}
            >
              <summary className="cursor-pointer list-none rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
                {t('nav.more')}
              </summary>
              <div className="absolute right-0 top-full mt-1 max-h-[calc(100dvh-5rem)] w-56 overflow-y-auto rounded-xl border border-neutral-200 bg-white p-2 shadow-lg transition-all dark:border-neutral-700 dark:bg-neutral-800">
                {extraLinks.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => moreRef.current?.removeAttribute('open')}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                <p className="px-3 py-1 text-xs font-medium text-neutral-400">{t('nav.features')}</p>
                {featureNavConfig.map((item) => (
                  <Link key={item.href} to={item.href} onClick={() => moreRef.current?.removeAttribute('open')}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              </div>
            </details>
          </div>

          <div className="flex items-center gap-2">
            <LanguageSelector />
            <button
              onClick={openSearch}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Buscar"
            >
              <Search size={20} />
            </button>
            <button
              className="relative rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Notificaciones"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={toggleMobileMenu}
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 xl:hidden dark:hover:bg-neutral-800"
              aria-label="Menú principal"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-neutral-200 dark:border-neutral-700 xl:hidden"
            >
              <div className="flex max-h-[calc(100dvh-5rem)] flex-col gap-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-2">
                {[...mainLinks, ...extraLinks].map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={toggleMobileMenu}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
                <div className="my-2 border-t border-neutral-100 dark:border-neutral-700" />
                <p className="px-3 text-xs font-medium text-neutral-400">{t('nav.features')}</p>
                {featureNavConfig.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={toggleMobileMenu}
                    className={cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      pathname === item.href
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                    )}
                  >
                    {t(item.label)}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  )
}
