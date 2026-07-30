export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type Locale = 'es' | 'en' | 'pt';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}

export interface SEOData {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export type Status = 'idle' | 'loading' | 'success' | 'error';
