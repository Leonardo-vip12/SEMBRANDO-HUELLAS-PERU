export const siteConfig = {
  name: 'Sembrando Huellas Perú',
  description:
    'Organización dedicada a la protección y conservación de especies en peligro de extinción en el Perú, promoviendo la reforestación y el cuidado del medio ambiente.',
  url: 'https://sembrandohuellas.org',
  locale: 'es',
  locales: ['es', 'en', 'pt'] as const,
  defaultLocale: 'es' as const,
  copyright: `© ${new Date().getFullYear()} Sembrando Huellas Perú. Todos los derechos reservados.`,
  email: 'contacto@sembrandohuellas.org',
  social: {
    facebook: 'https://facebook.com/sembrandohuellas',
    instagram: 'https://instagram.com/sembrandohuellas',
    twitter: 'https://twitter.com/sembrandohuellas',
    youtube: 'https://youtube.com/@sembrandohuellas',
    tiktok: 'https://tiktok.com/@sembrandohuellas',
  },
} as const;
