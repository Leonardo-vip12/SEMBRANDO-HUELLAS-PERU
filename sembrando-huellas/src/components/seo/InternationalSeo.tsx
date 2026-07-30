import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const siteUrl = 'https://sembrandohuellas.org';

const languageMapping: Record<string, string> = {
  es: 'es_PE',
  en: 'en_US',
  pt: 'pt_BR',
};

interface InternationalSeoProps {
  title?: string;
  description?: string;
  image?: string;
}

export default function InternationalSeo({ title, description, image }: InternationalSeoProps) {
  const { locale } = useLanguage();
  const location = useLocation();
  const currentPath = location.pathname;

  const hreflangs = ['es', 'en', 'pt'].map(lang => ({
    lang,
    url: `${siteUrl}/${lang}${currentPath.replace(/^\/(es|en|pt)/, '')}`,
  }));

  const canonical = `${siteUrl}/${locale}${currentPath.replace(/^\/(es|en|pt)/, '')}`;

  return (
    <Helmet>
      <link rel="canonical" href={canonical} />
      {hreflangs.map(h => (
        <link key={h.lang} rel="alternate" hrefLang={h.lang} href={h.url} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${siteUrl}${currentPath}`} />
      <meta property="og:locale" content={languageMapping[locale] || 'es_PE'} />
      {title && <meta property="og:title" content={title} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
