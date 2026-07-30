import { useState, useRef, useEffect } from 'react'
import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { cn } from '@/lib/cn'

const languages = [
  { code: 'es', label: 'Español', native: 'Español' },
  { code: 'en', label: 'English', native: 'English' },
  { code: 'pt', label: 'Português', native: 'Português' },
]

export default function LanguageSelector() {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = languages.find(l => l.code === locale) || languages[0]

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
        aria-label="Seleccionar idioma"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{current.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800 z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => { setLocale(lang.code as any); setOpen(false) }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
                locale === lang.code
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-700'
              )}
            >
              <span className="text-base">{lang.code === 'es' ? '🇵🇪' : lang.code === 'en' ? '🇺🇸' : '🇧🇷'}</span>
              <span>{lang.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
