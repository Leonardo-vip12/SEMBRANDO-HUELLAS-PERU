import type { APIResponse } from '@/types';

export interface FavoriteItem {
  id: string;
  type: 'program' | 'project' | 'species' | 'news' | 'gallery' | 'event' | 'download';
  title: string;
  slug: string;
  image?: string;
  url: string;
  addedAt: string;
}

const STORAGE_KEY = 'sh-favorites';

export class FavoritesService {
  static getAll(): FavoriteItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as FavoriteItem[]) : [];
    } catch {
      return [];
    }
  }

  static add(item: FavoriteItem): void {
    const items = this.getAll();
    if (!items.some((i) => i.id === item.id && i.type === item.type)) {
      items.push({ ...item, addedAt: new Date().toISOString() });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  }

  static remove(id: string, type: FavoriteItem['type']): void {
    const items = this.getAll().filter((i) => !(i.id === id && i.type === type));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  static toggle(item: FavoriteItem): boolean {
    const items = this.getAll();
    const exists = items.find((i) => i.id === item.id && i.type === item.type);
    if (exists) {
      this.remove(item.id, item.type);
      return false;
    }
    this.add(item);
    return true;
  }

  static isFavorite(id: string, type: FavoriteItem['type']): boolean {
    return this.getAll().some((i) => i.id === id && i.type === type);
  }

  static clear(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  static async apiSync(items: FavoriteItem[]): Promise<APIResponse<{ synced: number }>> {
    const { default: api } = await import('@/lib/axios');
    const { data } = await api.post<APIResponse<{ synced: number }>>('/favorites/sync', { items });
    return data;
  }
}
