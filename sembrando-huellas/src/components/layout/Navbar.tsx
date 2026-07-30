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

  const mainLinks = navigationConfig.slice(0, 6)
  const extraLinks = navigationConfig.slice(6)

  return (
    <>
      <GlobalSearch />
      <nav className={cn('fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md dark:bg-neutral-900/90', className)} {...props}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/" className="text-xl font-bold text-primary-600 dark:text-primary-400">
            {siteConfig.name}
          </Link>

          <div className="hidden items-center gap-1 md:flex">
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
            <div className="group relative">
              <button className="rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800">
                {t('nav.more')}
              </button>
              <div className="invisible absolute right-0 top-full mt-1 w-48 rounded-xl border border-neutral-200 bg-white p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 dark:border-neutral-700 dark:bg-neutral-800">
                {extraLinks.map((item) => (
                  <Link key={item.href} to={item.href}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm transition-colors',
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-neutral-100 dark:border-neutral-700" />
                <p className="px-3 py-1 text-xs font-medium text-neutral-400">{t('nav.features')}</p>
                {featureNavConfig.map((item) => (
                  <Link key={item.href} to={item.href}
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
            </div>
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
              className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 md:hidden dark:hover:bg-neutral-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t border-neutral-200 dark:border-neutral-700 md:hidden"
            >
              <div className="flex flex-col gap-1 px-4 pb-6 pt-2">
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
