import api from '@/lib/axios';
import type { APIResponse } from '@/types';
import downloadsData from '@/data/json/downloads.json';

export interface LibraryResource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileSize: string;
  format: string;
  category: string;
  icon: string;
  downloads: number;
  featured: boolean;
}

export class LibraryService {
  static getAll(): LibraryResource[] {
    return downloadsData as LibraryResource[];
  }

  static getByCategory(category: string): LibraryResource[] {
    return (downloadsData as LibraryResource[]).filter(
      (r) => r.category.toLowerCase() === category.toLowerCase(),
    );
  }

  static getFeatured(): LibraryResource[] {
    return (downloadsData as LibraryResource[]).filter((r) => r.featured);
  }

  static search(query: string): LibraryResource[] {
    const q = query.toLowerCase();
    return (downloadsData as LibraryResource[]).filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q),
    );
  }

  static async incrementDownloads(id: string): Promise<void> {
    const resources = downloadsData as LibraryResource[];
    const idx = resources.findIndex((r) => r.id === id);
    if (idx !== -1) {
      (resources[idx] as any).downloads = (resources[idx].downloads || 0) + 1;
    }
  }

  static getCategories(): string[] {
    return [...new Set((downloadsData as LibraryResource[]).map((r) => r.category))];
  }

  static getFormats(): string[] {
    return [...new Set((downloadsData as LibraryResource[]).map((r) => r.format))];
  }

  static async apiGetAll(): Promise<APIResponse<LibraryResource[]>> {
    const { data } = await api.get<APIResponse<LibraryResource[]>>('/downloads');
    return data;
  }
}
