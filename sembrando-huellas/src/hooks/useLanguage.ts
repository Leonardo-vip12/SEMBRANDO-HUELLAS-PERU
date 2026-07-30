import { useLanguage as useLanguageContext } from '@/contexts/LanguageContext'
import { useTranslation } from 'react-i18next'

const RTL_LOCALES: string[] = []

export function useLanguage() {
  const ctx = useLanguageContext()
  const { t } = useTranslation()
  const isRTL = RTL_LOCALES.includes(ctx.locale)

  return { ...ctx, t, isRTL }
}
