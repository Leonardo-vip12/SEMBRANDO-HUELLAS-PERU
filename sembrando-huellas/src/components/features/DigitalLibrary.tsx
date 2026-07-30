import { useState, useMemo } from 'react';
import { FileText, Image, Video, Map, BarChart3, Heart, Newspaper, Presentation, Download, Search, Filter } from 'lucide-react';
import { LibraryService } from '@/services/library';
import CardBase from '@/components/cards/CardBase';
import DownloadButton from '@/components/shared/DownloadButton';
import FavoriteButton from '@/components/shared/FavoriteButton';
import { cn } from '@/lib/cn';

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText size={20} />,
  Image: <Image size={20} />,
  Video: <Video size={20} />,
  Map: <Map size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Heart: <Heart size={20} />,
  Newspaper: <Newspaper size={20} />,
  Presentation: <Presentation size={20} />,
};

export default function DigitalLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [selectedFormat, setSelectedFormat] = useState('Todos');

  const resources = useMemo(() => LibraryService.getAll(), []);
  const categories = useMemo(() => ['Todas', ...LibraryService.getCategories()], []);
  const formats = useMemo(() => ['Todos', ...LibraryService.getFormats()], []);

  const filtered = useMemo(() => {
    let result = resources;
    if (selectedCategory !== 'Todas') result = result.filter((r) => r.category === selectedCategory);
    if (selectedFormat !== 'Todos') result = result.filter((r) => r.format === selectedFormat);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    return result;
  }, [resources, selectedCategory, selectedFormat, searchQuery]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar recursos..."
            className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1 rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-700">
            <Filter size={14} className="text-neutral-400" />
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-transparent text-sm text-neutral-700 outline-none dark:text-neutral-300"
            >
              {formats.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              selectedCategory === cat
                ? 'bg-primary-600 text-white'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400',
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <Search size={40} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-neutral-500">No se encontraron recursos con los filtros seleccionados.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <CardBase key={resource.id} variant="default" hover padding="lg">
              <div className="flex h-full flex-col">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400">
                    {iconMap[resource.icon] ?? <FileText size={20} />}
                  </div>
                  <span className="rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-700">
                    {resource.format}
                  </span>
                </div>
                <h3 className="mb-1 font-medium text-neutral-900 dark:text-neutral-100">{resource.title}</h3>
                <p className="mb-4 flex-1 text-sm text-neutral-500">{resource.description}</p>
                <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-700">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Download size={12} />
                    <span>{resource.downloads} descargas</span>
                    <span className="text-neutral-300">|</span>
                    <span>{resource.fileSize}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FavoriteButton
                      item={{ id: resource.id, type: 'download', title: resource.title, slug: resource.id, url: '#' }}
                      size="sm"
                    />
                    <DownloadButton resourceId={resource.id} fileUrl={resource.fileUrl} label="" className="rounded-lg p-1.5" />
                  </div>
                </div>
              </div>
            </CardBase>
          ))}
        </div>
      )}
    </div>
  );
}
