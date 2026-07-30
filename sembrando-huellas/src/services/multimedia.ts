import api from '@/lib/axios';
import type { APIResponse } from '@/types';
import galleryData from '@/data/json/gallery.json';
import downloadsData from '@/data/json/downloads.json';

export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio' | 'document';
  src: string;
  thumbnail?: string;
  category: string;
  tags: string[];
  date: string;
  downloads: number;
}

export class MultimediaService {
  static getAll(): MediaItem[] {
    const gallery = (galleryData as any[]).flatMap((album) =>
      (album.images ?? []).map((img: any) => ({
        id: img.id,
        title: img.caption ?? album.title,
        description: album.description,
        type: 'image' as const,
        src: img.src,
        thumbnail: img.src,
        category: 'Galería',
        tags: album.tags ?? [],
        date: album.date,
        downloads: 0,
      })),
    );

    const videos = (downloadsData as any[])
      .filter((d) => d.format === 'MP4')
      .map((d) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        type: 'video' as const,
        src: d.fileUrl,
        thumbnail: undefined,
        category: d.category,
        tags: [],
        date: '',
        downloads: d.downloads,
      }));

    return [...gallery, ...videos];
  }

  static getByType(type: MediaItem['type']): MediaItem[] {
    const all = this.getAll();
    return all.filter((m) => m.type === type);
  }

  static search(query: string): MediaItem[] {
    const q = query.toLowerCase();
    const all = this.getAll();
    return all.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  static async apiGetAll(): Promise<APIResponse<MediaItem[]>> {
    const { data } = await api.get<APIResponse<MediaItem[]>>('/multimedia');
    return data;
  }
}
