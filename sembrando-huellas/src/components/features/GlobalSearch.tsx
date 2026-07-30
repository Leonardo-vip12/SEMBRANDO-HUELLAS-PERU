import { useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, TreePine, Bird, Newspaper, Image, Calendar, Loader2 } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { useSearchContext } from '@/contexts/SearchContext';
import type { SearchResult } from '@/services/search';

const typeConfig: Record<SearchResult['type'], { icon: React.ReactNode; label: string }> = {
  program: { icon: <FileText size={14} />, label: 'Programa' },
  project: { icon: <TreePine size={14} />, label: 'Proyecto' },
  species: { icon: <Bird size={14} />, label: 'Especie' },
  news: { icon: <Newspaper size={14} />, label: 'Noticia' },
  gallery: { icon: <Image size={14} />, label: 'Galería' },
  event: { icon: <Calendar size={14} />, label: 'Evento' },
};

export default function GlobalSearch() {
  const { isOpen, closeSearch } = useSearchContext();
  const { query, results, isSearching, hasSearched, search, clear } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeSearch();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? closeSearch() : null;
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, closeSearch]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleSelect = useCallback(() => {
    closeSearch();
    clear();
  }, [closeSearch, clear]);

  const groupResults = (items: SearchResult[]) => {
    const groups: Record<string, SearchResult[]> = {};
    items.forEach((item) => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });
    return groups;
  };

  const groups = groupResults(results);
  const typeOrder: SearchResult['type'][] = ['program', 'project', 'species', 'news', 'gallery', 'event'];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeSearch}
          />
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative z-10 w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div className="flex items-center gap-3 border-b border-neutral-200 px-4 dark:border-neutral-700">
              <Search size={20} className="shrink-0 text-neutral-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => search(e.target.value)}
                placeholder="Buscar programas, especies, noticias..."
                className="w-full bg-transparent py-4 text-base text-neutral-900 placeholder-neutral-400 outline-none dark:text-neutral-100 dark:placeholder-neutral-500"
              />
              {query && (
                <button onClick={clear} className="rounded p-1 text-neutral-400 hover:text-neutral-600">
                  <X size={18} />
                </button>
              )}
              <kbd className="hidden shrink-0 rounded-md border border-neutral-300 px-2 py-0.5 text-xs text-neutral-400 md:inline-block dark:border-neutral-600">
                ESC
              </kbd>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {isSearching && (
                <div className="flex items-center justify-center gap-2 py-8 text-neutral-400">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-sm">Buscando...</span>
                </div>
              )}

              {!isSearching && hasSearched && results.length === 0 && (
                <div className="py-12 text-center">
                  <Search size={32} className="mx-auto mb-2 text-neutral-300" />
                  <p className="text-sm text-neutral-500">No se encontraron resultados para "{query}"</p>
                </div>
              )}

              {!isSearching && results.length > 0 && (
                <div className="py-2">
                  {typeOrder.map((type) => {
                    const items = groups[type];
                    if (!items?.length) return null;
                    return (
                      <div key={type}>
                        <div className="flex items-center gap-2 px-4 py-2">
                          <span className="text-neutral-400">{typeConfig[type].icon}</span>
                          <span className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                            {typeConfig[type].label}
                          </span>
                        </div>
                        {items.map((item) => (
                          <Link
                            key={`${item.type}-${item.id}`}
                            to={item.url}
                            onClick={handleSelect}
                            className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt=""
                                className="h-10 w-10 shrink-0 rounded-lg object-cover"
                              />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-neutral-900 dark:text-neutral-100">
                                {item.title}
                              </p>
                              <p className="truncate text-xs text-neutral-500">
                                {item.description}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}

              {!query && !hasSearched && (
                <div className="py-8 text-center">
                  <p className="text-sm text-neutral-400">
                    Presiona <kbd className="rounded border border-neutral-300 px-1.5 py-0.5 text-xs dark:border-neutral-600">Enter</kbd> para buscar en todo el sitio
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
