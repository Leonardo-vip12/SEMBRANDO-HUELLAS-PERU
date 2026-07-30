import { Heart } from 'lucide-react';
import { cn } from '@/lib/cn';
import { useFavorites } from '@/hooks/useFavorites';
import type { FavoriteItem } from '@/services/favorites';

interface FavoriteButtonProps {
  item: Omit<FavoriteItem, 'addedAt'>;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const sizeMap = { sm: 16, md: 20, lg: 24 };

export default function FavoriteButton({ item, className, size = 'md', showLabel }: FavoriteButtonProps) {
  const { toggle, isFavorite } = useFavorites();
  const favorited = isFavorite(item.id, item.type);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle({ ...item, addedAt: new Date().toISOString() });
      }}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-lg transition-all duration-200',
        'hover:scale-110 active:scale-95',
        favorited
          ? 'text-red-500'
          : 'text-neutral-400 hover:text-red-400 dark:text-neutral-500',
        className,
      )}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <Heart
        size={sizeMap[size]}
        className={cn(
          'transition-all duration-200',
          favorited && 'fill-current',
        )}
      />
      {showLabel && (
        <span className="text-xs">{favorited ? 'Guardado' : 'Guardar'}</span>
      )}
    </button>
  );
}
