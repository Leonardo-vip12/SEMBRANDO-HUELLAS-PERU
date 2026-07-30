import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import esTranslation from '@/locales/es/translation.json';
import enTranslation from '@/locales/en/translation.json';
import ptTranslation from '@/locales/pt/translation.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'es',
  debug: false,
  interpolation: { escapeValue: false },
  defaultNS: 'translation',
  resources: {
    es: { translation: esTranslation },
    en: { translation: enTranslation },
    pt: { translation: ptTranslation },
  },
  supportedLngs: ['es', 'en', 'pt'],
  nonExplicitSupportedLngs: true,
});

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sembrando-huellas-lang', lng);
    document.documentElement.lang = lng;
  }
});

const savedLang = typeof window !== 'undefined' ? localStorage.getItem('sembrando-huellas-lang') : null;
if (savedLang && ['es', 'en', 'pt'].includes(savedLang)) {
  i18n.changeLanguage(savedLang);
}

export default i18n;