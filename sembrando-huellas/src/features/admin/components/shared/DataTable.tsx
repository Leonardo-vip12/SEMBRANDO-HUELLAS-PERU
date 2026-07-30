import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ChevronDown, ChevronUp, ChevronsUpDown, ChevronLeft, ChevronRight, Trash2, Eye, Pencil, Copy, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/cn';

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T extends Record<string, any>> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onDuplicate?: (item: T) => void;
  onPreview?: (item: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  actions?: (item: T) => React.ReactNode;
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  onEdit,
  onDelete,
  onDuplicate,
  onPreview,
  searchable = true,
  searchPlaceholder,
  pageSize = 10,
  actions,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const placeholder = searchPlaceholder || t('admin.search');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((item) =>
        columns.some((col) => String(item[col.key] ?? '').toLowerCase().includes(q)),
      );
    }
    if (sortKey) {
      result = [...result].sort((a, b) => {
        const aVal = a[sortKey] ?? '';
        const bVal = b[sortKey] ?? '';
        const cmp = String(aVal).localeCompare(String(bVal));
        return sortDir === 'asc' ? cmp : -cmp;
      });
    }
    return result;
  }, [data, search, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleAll = () => {
    if (selected.size === paginated.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paginated.map(keyExtractor)));
    }
  };

  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {searchable && (
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              placeholder={placeholder}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none placeholder-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </div>
        )}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-neutral-500">{selected.size} {t('admin.selected')}</span>
            <button className="rounded-lg px-3 py-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={14} className="inline" /> {t('admin.delete')}
            </button>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={paginated.length > 0 && selected.size === paginated.length}
                    onChange={toggleAll}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                </th>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className={cn(
                      'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500',
                      col.sortable && 'cursor-pointer select-none hover:text-neutral-700',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right',
                    )}
                    style={col.width ? { width: col.width } : undefined}
                    onClick={() => col.sortable && toggleSort(col.key)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        sortKey === col.key ? (
                          sortDir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                        ) : (
                          <ChevronsUpDown size={12} className="opacity-40" />
                        )
                      )}
                    </span>
                  </th>
                ))}
                <th className="w-16 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {t('admin.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              <AnimatePresence mode="popLayout">
                {paginated.map((item) => {
                  const id = keyExtractor(item);
                  return (
                    <motion.tr
                      key={id}
                      layout
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className={cn(
                        'group transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50',
                        selected.has(id) && 'bg-primary-50/50 dark:bg-primary-900/10',
                      )}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selected.has(id)}
                          onChange={() => toggleOne(id)}
                          className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                        />
                      </td>
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={cn(
                            'px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300',
                            col.align === 'center' && 'text-center',
                            col.align === 'right' && 'text-right',
                          )}
                        >
                          {col.render ? col.render(item) : item[col.key]}
                        </td>
                      ))}
                      <td className="px-4 py-3 text-right">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === id ? null : id)}
                            className="rounded-lg p-1.5 text-neutral-400 opacity-0 transition-opacity hover:bg-neutral-100 group-hover:opacity-100 dark:hover:bg-neutral-700"
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {openMenu === id && (
                            <div className="absolute right-0 top-full z-10 mt-1 w-40 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-800">
                              {onPreview && (
                                <button onClick={() => { onPreview(item); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700">
                                  <Eye size={14} /> {t('admin.preview')}
                                </button>
                              )}
                              {onEdit && (
                                <button onClick={() => { onEdit(item); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700">
                                  <Pencil size={14} /> {t('admin.edit')}
                                </button>
                              )}
                              {onDuplicate && (
                                <button onClick={() => { onDuplicate(item); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-700">
                                  <Copy size={14} /> {t('admin.duplicate')}
                                </button>
                              )}
                              {onDelete && (
                                <button onClick={() => { onDelete(item); setOpenMenu(null); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                  <Trash2 size={14} /> {t('admin.delete')}
                                </button>
                              )}
                              {actions && actions(item)}
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {paginated.length === 0 && (
          <div className="flex flex-col items-center py-16 text-center">
            <Search size={32} className="mb-2 text-neutral-300" />
            <p className="text-sm text-neutral-500">{t('admin.noResults')}</p>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-neutral-500">
          {filtered.length} {t('admin.records')} · {t('admin.page')} {page + 1} {t('admin.of')} {totalPages}
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const start = Math.max(0, Math.min(page - 2, totalPages - 5));
            const p = start + i;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'h-8 w-8 rounded-lg text-sm font-medium',
                  page === p ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                )}
              >
                {p + 1}
              </button>
            );
          })}
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
