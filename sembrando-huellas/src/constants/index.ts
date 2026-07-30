export const APP_ROUTES = {
  HOME: '/',
  ABOUT: '/nosotros',
  PROGRAMS: '/programas',
  EDUCATION: '/educacion',
  PROJECTS: '/proyectos',
  GALLERY: '/galeria',
  SPECIES: '/especies',
  IMPACT: '/impacto',
  NEWS: '/noticias',
  VOLUNTEERS: '/voluntariado',
  DONATIONS: '/donaciones',
  CONTACT: '/contacto',
  DASHBOARD: '/dashboard',
  NOT_FOUND: '/404',
} as const;

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export const QUERY_KEYS = {
  species: 'species',
  speciesDetail: 'species-detail',
  projects: 'projects',
  projectDetail: 'project-detail',
  news: 'news',
  newsDetail: 'news-detail',
  gallery: 'gallery',
  impact: 'impact',
  programs: 'programs',
  testimonials: 'testimonials',
  faqs: 'faqs',
  volunteers: 'volunteers',
  donations: 'donations',
  contacts: 'contacts',
  dashboard: 'dashboard',
  stats: 'stats',
} as const;
