import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { Locale } from '@/types'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  dir: 'ltr' | 'rtl'
  t: (key: string, options?: any) => string
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageContextProvider({ children }: { children: ReactNode }) {
  const { i18n, t } = useTranslation()
  const [locale, setLocaleState] = useState<Locale>((i18n.language || 'es') as Locale)

  useEffect(() => {
    setLocaleState(i18n.language as Locale)
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  const setLocale = useCallback((newLocale: Locale) => {
    i18n.changeLanguage(newLocale)
    localStorage.setItem('sembrando-huellas-lang', newLocale)
    setLocaleState(newLocale)
  }, [i18n])

  return (
    <LanguageContext.Provider value={{ locale, setLocale, dir: 'ltr', t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageContextProvider')
  return ctx
}
