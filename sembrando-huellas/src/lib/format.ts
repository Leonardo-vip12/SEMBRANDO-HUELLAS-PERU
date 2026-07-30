const localeMap: Record<string, string> = {
  es: 'es-PE',
  en: 'en-US',
  pt: 'pt-BR',
};

export function getLocaleCode(lang: string = 'es'): string {
  return localeMap[lang] || 'es-PE';
}

export function formatDate(date: string | Date, lang: string = 'es', options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return d.toLocaleDateString(getLocaleCode(lang), options || defaultOptions);
}

export function formatNumber(num: number, lang: string = 'es', options?: Intl.NumberFormatOptions): string {
  return num.toLocaleString(getLocaleCode(lang), options);
}

export function formatCurrency(amount: number, lang: string = 'es', currency: string = 'PEN'): string {
  return amount.toLocaleString(getLocaleCode(lang), { style: 'currency', currency, minimumFractionDigits: 2 });
}

export function formatRelativeTime(date: string | Date, lang: string = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return lang === 'es' ? 'Ahora' : lang === 'pt' ? 'Agora' : 'Just now';
  if (diffMin < 60) return lang === 'es' ? `Hace ${diffMin} min` : lang === 'pt' ? `Há ${diffMin} min` : `${diffMin} min ago`;
  if (diffHour < 24) return lang === 'es' ? `Hace ${diffHour}h` : lang === 'pt' ? `Há ${diffHour}h` : `${diffHour}h ago`;
  if (diffDay < 7) return lang === 'es' ? `Hace ${diffDay}d` : lang === 'pt' ? `Há ${diffDay}d` : `${diffDay}d ago`;
  return formatDate(d, lang);
}
