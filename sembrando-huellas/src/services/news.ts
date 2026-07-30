import { ApiService } from './api';
import type { APIResponse, PaginatedResponse } from '@/types';

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured: boolean;
  image: string;
  publishedAt: string;
}

export class NewsService {
  static getAll(): Promise<APIResponse<NewsItem[]>> {
    return ApiService.get<NewsItem[]>('/news');
  }

  static getById(id: string): Promise<APIResponse<NewsItem>> {
    return ApiService.get<NewsItem>(`/news/${id}`);
  }

  static getBySlug(slug: string): Promise<APIResponse<NewsItem>> {
    return ApiService.get<NewsItem>(`/news/slug/${slug}`);
  }

  static getFeatured(): Promise<APIResponse<NewsItem[]>> {
    return ApiService.get<NewsItem[]>('/news/featured');
  }

  static getPaginated(page: number, limit: number): Promise<APIResponse<PaginatedResponse<NewsItem>>> {
    return ApiService.get<PaginatedResponse<NewsItem>>('/news', { params: { page, limit } });
  }
}
