import api from '@/lib/axios';
import type { APIResponse } from '@/types';
import programsData from '@/data/json/programs.json';
import projectsData from '@/data/json/projects.json';
import speciesData from '@/data/json/species.json';
import newsData from '@/data/json/news.json';
import galleryData from '@/data/json/gallery.json';
import eventsData from '@/data/json/events.json';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  slug: string;
  type: 'program' | 'project' | 'species' | 'news' | 'gallery' | 'event';
  image?: string;
  url: string;
}

type SearchableItem = {
  id: string;
  title?: string;
  name?: string;
  description?: string;
  slug: string;
  coverImage?: string;
  image?: string;
};

export class SearchService {
  private static localData: SearchResult[] | null = null;

  static async globalSearch(query: string): Promise<SearchResult[]> {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return this.getLocalData().filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }

  static async apiSearch(query: string): Promise<APIResponse<SearchResult[]>> {
    const { data } = await api.get<APIResponse<SearchResult[]>>('/search', {
      params: { q: query },
    });
    return data;
  }

  private static getLocalData(): SearchResult[] {
    if (this.localData) return this.localData;

    const mapItem = (item: SearchableItem, type: SearchResult['type'], urlPrefix: string): SearchResult => ({
      id: item.id,
      title: item.title ?? item.name ?? '',
      description: item.description ?? '',
      slug: item.slug,
      type,
      image: item.coverImage ?? item.image,
      url: `/${urlPrefix}/${item.slug}`,
    });

    const results: SearchResult[] = [
      ...(programsData as SearchableItem[]).map((p) => mapItem(p, 'program', 'programas')),
      ...(projectsData as SearchableItem[]).map((p) => mapItem(p, 'project', 'proyectos')),
      ...(speciesData as SearchableItem[]).map((p) => mapItem(p, 'species', 'especies')),
      ...(newsData as SearchableItem[]).map((p) => mapItem(p, 'news', 'noticias')),
      ...(galleryData as SearchableItem[]).map((p) => mapItem(p, 'gallery', 'galeria')),
      ...(eventsData as SearchableItem[]).map((p) => mapItem(p, 'event', 'eventos')),
    ];

    this.localData = results;
    return results;
  }
}
