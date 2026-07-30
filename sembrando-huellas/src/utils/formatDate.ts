import { format, formatDistanceToNow } from 'date-fns'
import { es, enUS, pt } from 'date-fns/locale'
import type { Locale as AppLocale } from '@/types'
import type { Locale as DateFnsLocale } from 'date-fns'

type DateFormat = 'short' | 'long' | 'relative'

const localeMap: Record<AppLocale, DateFnsLocale> = {
  es: es as DateFnsLocale,
  en: enUS as DateFnsLocale,
  pt: pt as DateFnsLocale,
}

export function formatDate(
  date: Date | string | number,
  type: DateFormat = 'short',
  locale: AppLocale = 'es'
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date
  const localeObj = localeMap[locale]

  switch (type) {
    case 'short':
      return format(d, 'dd/MM/yyyy', { locale: localeObj })
    case 'long':
      return format(d, "dd 'de' MMMM, yyyy", { locale: localeObj })
    case 'relative':
      return formatDistanceToNow(d, { addSuffix: true, locale: localeObj })
  }
}
