import { useState, useCallback } from 'react';
import { FavoritesService, type FavoriteItem } from '@/services/favorites';

export function useFavorites() {
  const [items, setItems] = useState<FavoriteItem[]>(() => FavoritesService.getAll());

  const refresh = useCallback(() => {
    setItems(FavoritesService.getAll());
  }, []);

  const add = useCallback((item: FavoriteItem) => {
    FavoritesService.add(item);
    refresh();
  }, [refresh]);

  const remove = useCallback((id: string, type: FavoriteItem['type']) => {
    FavoritesService.remove(id, type);
    refresh();
  }, [refresh]);

  const toggle = useCallback((item: FavoriteItem): boolean => {
    const result = FavoritesService.toggle(item);
    refresh();
    return result;
  }, [refresh]);

  const isFavorite = useCallback((id: string, type: FavoriteItem['type']): boolean => {
    return FavoritesService.isFavorite(id, type);
  }, []);

  const clear = useCallback(() => {
    FavoritesService.clear();
    refresh();
  }, [refresh]);

  const count = items.length;

  return { items, count, add, remove, toggle, isFavorite, clear, refresh };
}
