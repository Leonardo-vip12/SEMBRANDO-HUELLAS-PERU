import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface Species {
  id: string;
  name: string;
  slug: string;
  scientificName: string;
  category: string;
  description: string;
  image: string;
  conservationStatus: string;
}

export class SpeciesService {
  static getAll(): Promise<APIResponse<Species[]>> {
    return ApiService.get<Species[]>('/species');
  }

  static getById(id: string): Promise<APIResponse<Species>> {
    return ApiService.get<Species>(`/species/${id}`);
  }

  static getBySlug(slug: string): Promise<APIResponse<Species>> {
    return ApiService.get<Species>(`/species/slug/${slug}`);
  }

  static getByCategory(category: string): Promise<APIResponse<Species[]>> {
    return ApiService.get<Species[]>('/species', { params: { category } });
  }

  static search(query: string): Promise<APIResponse<Species[]>> {
    return ApiService.get<Species[]>('/species/search', { params: { q: query } });
  }
}
