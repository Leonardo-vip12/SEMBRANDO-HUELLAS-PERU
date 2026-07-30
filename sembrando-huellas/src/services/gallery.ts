import { ApiService } from './api';
import type { APIResponse } from '@/types';

interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  caption: string;
  album: string;
}

interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
}

export class GalleryService {
  static getAll(): Promise<APIResponse<GalleryImage[]>> {
    return ApiService.get<GalleryImage[]>('/gallery');
  }

  static getById(id: string): Promise<APIResponse<GalleryImage>> {
    return ApiService.get<GalleryImage>(`/gallery/${id}`);
  }

  static getByAlbum(album: string): Promise<APIResponse<GalleryImage[]>> {
    return ApiService.get<GalleryImage[]>('/gallery', { params: { album } });
  }

  static getAlbums(): Promise<APIResponse<Album[]>> {
    return ApiService.get<Album[]>('/gallery/albums');
  }
}
