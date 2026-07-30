import { getLocales } from 'expo-localization';
import es from './locales/es';
import en from './locales/en';

export type Locale = 'es' | 'en' | 'pt';
type TranslationMap = Record<string, string | Record<string, any>>;
type DeepRecord = Record<string, any>;

const translations: Record<Locale, DeepRecord> = { es, en };

let currentLocale: Locale = 'es';

const deviceLang = getLocales()?.[0]?.languageCode;
if (deviceLang === 'en') currentLocale = 'en';

export function setLocale(locale: Locale) {
  currentLocale = locale;
}

export function getCurrentLocale(): Locale {
  return currentLocale;
}

function getNestedValue(obj: DeepRecord, path: string): string {
  const keys = path.split('.');
  let current = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

export function t(key: string, params?: Record<string, string | number>): string {
  const lang = translations[currentLocale] || translations.es;
  let value = getNestedValue(lang, key);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{{${k}}}`, String(v));
    });
  }
  return value;
}

export function useLocale() {
  return { t, setLocale, getCurrentLocale, currentLocale };
}
