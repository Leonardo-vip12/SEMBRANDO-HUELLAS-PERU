const routes: Record<string, Record<string, string>> = {
  es: {
    home: '/',
    about: '/nosotros',
    programs: '/programas',
    projects: '/proyectos',
    species: '/especies',
    gallery: '/galeria',
    news: '/noticias',
    events: '/eventos',
    library: '/biblioteca',
    education: '/educacion',
    volunteers: '/voluntariado',
    donations: '/donaciones',
    contact: '/contacto',
    faq: '/faq',
    impact: '/impacto',
    map: '/mapa-interactivo',
    ai: '/asistente-ia',
    tutor: '/tutor-ia',
    observatory: '/observatorio',
    certificates: '/certificados',
    calculator: '/calculadora',
    multimedia: '/multimedia',
    transparency: '/transparencia',
    sia: '/sia',
    '404': '/404',
  },
  en: {
    home: '/',
    about: '/about',
    programs: '/programs',
    projects: '/projects',
    species: '/species',
    gallery: '/gallery',
    news: '/news',
    events: '/events',
    library: '/library',
    education: '/education',
    volunteers: '/volunteering',
    donations: '/donations',
    contact: '/contact',
    faq: '/faq',
    impact: '/impact',
    map: '/interactive-map',
    ai: '/ai-assistant',
    tutor: '/ai-tutor',
    observatory: '/observatory',
    certificates: '/certificates',
    calculator: '/calculator',
    multimedia: '/multimedia',
    transparency: '/transparency',
    sia: '/sia',
    '404': '/404',
  },
  pt: {
    home: '/',
    about: '/sobre',
    programs: '/programas',
    projects: '/projetos',
    species: '/especies',
    gallery: '/galeria',
    news: '/noticias',
    events: '/eventos',
    library: '/biblioteca',
    education: '/educacao',
    volunteers: '/voluntariado',
    donations: '/doacoes',
    contact: '/contato',
    faq: '/faq',
    impact: '/impacto',
    map: '/mapa-interativo',
    ai: '/assistente-ia',
    tutor: '/tutor-ia',
    observatory: '/observatorio',
    certificates: '/certificados',
    calculator: '/calculadora',
    multimedia: '/multimedia',
    transparency: '/transparencia',
    sia: '/sia',
    '404': '/404',
  },
};

export function localizedRoute(key: string, locale: string = 'es'): string {
  const langRoutes = routes[locale] || routes.es;
  return langRoutes[key] || routes.es[key] || '/';
}

export function getLocalizedPath(path: string, targetLocale: string): string {
  for (const [_locale, langRoutes] of Object.entries(routes)) {
    for (const [key, routePath] of Object.entries(langRoutes)) {
      if (routePath === path) {
        return routes[targetLocale]?.[key] || path;
      }
    }
  }
  return path;
}

export function getHreflangUrls(path: string): Array<{ lang: string; url: string }> {
  return Object.keys(routes).map(lang => ({
    lang,
    url: getLocalizedPath(path, lang),
  }));
}
