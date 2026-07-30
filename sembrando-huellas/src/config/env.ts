export const env = {
  APP_NAME: import.meta.env.VITE_APP_NAME as string,
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION as string,
  APP_URL: import.meta.env.VITE_APP_URL as string,
  APP_LOCALE: import.meta.env.VITE_APP_LOCALE as string,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT),
  ENABLE_PWA: import.meta.env.VITE_ENABLE_PWA === 'true',
  ENABLE_DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  GA_TRACKING_ID: import.meta.env.VITE_GA_TRACKING_ID as string,
} as const;
