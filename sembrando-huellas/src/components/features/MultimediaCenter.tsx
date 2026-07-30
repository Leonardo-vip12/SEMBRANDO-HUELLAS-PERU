import { useState, useMemo } from 'react';
import { Image, Video, Search } from 'lucide-react';
import { MultimediaService } from '@/services/multimedia';
import CardBase from '@/components/cards/CardBase';
import { cn } from '@/lib/cn';

export default function MultimediaCenter() {
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const media = useMemo(() => MultimediaService.getAll(), []);

  const filtered = useMemo(() => {
    let result = media;
    if (filter !== 'all') result = result.filter((m) => m.type === filter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
    }
    return result;
  }, [media, filter, searchQuery]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2">
          {([
            { id: 'all' as const, label: 'Todos', icon: null },
            { id: 'image' as const, label: 'Imágenes', icon: <Image size={16} /> },
            { id: 'video' as const, label: 'Videos', icon: <Video size={16} /> },
          ]).map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                filter === f.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400',
              )}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en multimedia..."
            className="rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-4 text-sm outline-none focus:border-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Image size={40} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500">No hay contenido multimedia disponible.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((item) => (
            <CardBase key={item.id} variant="default" padding="none" hover>
              <div className="group relative aspect-square overflow-hidden rounded-xl">
                {item.type === 'image' ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
                    <Video size={48} className="text-neutral-300" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <p className="truncate text-sm font-medium text-white">{item.title}</p>
                  <p className="truncate text-xs text-white/80">{item.category}</p>
                </div>
                <div className="absolute right-2 top-2 rounded-md bg-black/50 px-2 py-0.5 text-xs text-white">
                  {item.type === 'image' ? 'Foto' : 'Video'}
                </div>
              </div>
            </CardBase>
          ))}
        </div>
      )}
    </div>
  );
}
