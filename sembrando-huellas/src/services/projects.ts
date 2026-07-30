import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  featured: boolean;
  image: string;
  status: string;
}

export class ProjectsService {
  static getAll(): Promise<APIResponse<Project[]>> {
    return ApiService.get<Project[]>('/projects');
  }

  static getById(id: string): Promise<APIResponse<Project>> {
    return ApiService.get<Project>(`/projects/${id}`);
  }

  static getBySlug(slug: string): Promise<APIResponse<Project>> {
    return ApiService.get<Project>(`/projects/slug/${slug}`);
  }

  static getFeatured(): Promise<APIResponse<Project[]>> {
    return ApiService.get<Project[]>('/projects/featured');
  }

  static getByCategory(category: string): Promise<APIResponse<Project[]>> {
    return ApiService.get<Project[]>('/projects', { params: { category } });
  }
}
