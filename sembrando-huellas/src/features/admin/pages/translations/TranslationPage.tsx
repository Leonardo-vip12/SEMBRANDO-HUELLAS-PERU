import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Key, Globe, Download, Upload, Plus, Search, Trash2, Pencil,
  X, AlertTriangle, RefreshCw, FileJson, FileSpreadsheet, Star,
  Save, ChevronLeft, ChevronRight, Loader2, Target,
} from 'lucide-react';
import { TranslationAdminService } from '../../services/translationAdmin';
import StatsCard from '../../components/shared/StatsCard';
import StatusBadge from '../../components/shared/StatusBadge';
import CardBase from '@/components/cards/CardBase';
import Button from '@/components/buttons/Button';
import { cn } from '@/lib/cn';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

type TabType = 'idiomas' | 'claves' | 'contenido' | 'import-export';

interface Language {
  id: string;
  code: string;
  name: string;
  nativeName?: string;
  active: boolean;
  isDefault: boolean;
}

interface TranslationKey {
  id: string;
  key: string;
  namespace?: string;
  value: string;
  languageId: string;
  language?: string;
  group?: string;
  tags?: string[];
  status?: string;
}

interface Stats {
  totalKeys: number;
  totalLanguages: number;
  missingTranslations: number;
  completePercent: number;
}

const ENTITY_TYPES = [
  { value: 'news', label: 'Noticias' },
  { value: 'project', label: 'Proyectos' },
  { value: 'program', label: 'Programas' },
  { value: 'species', label: 'Especies' },
  { value: 'event', label: 'Eventos' },
  { value: 'gallery', label: 'Galería' },
  { value: 'faq', label: 'FAQ' },
];

const IMPORT_FORMATS = [
  { value: 'json', label: 'JSON' },
  { value: 'csv', label: 'CSV' },
];

export default function TranslationPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('idiomas');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalKeys: 0, totalLanguages: 0, missingTranslations: 0, completePercent: 0,
  });

  const [languages, setLanguages] = useState<Language[]>([]);
  const [langModal, setLangModal] = useState<{ open: boolean; edit?: Language }>({ open: false });
  const [langForm, setLangForm] = useState({ code: '', name: '', nativeName: '' });
  const [savingLang, setSavingLang] = useState(false);

  const [keys, setKeys] = useState<TranslationKey[]>([]);
  const [keysPagination, setKeysPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [keySearch, setKeySearch] = useState('');
  const [keyLangFilter, setKeyLangFilter] = useState('');
  const [keyGroupFilter, setKeyGroupFilter] = useState('');
  const [keyModal, setKeyModal] = useState(false);
  const [keyForm, setKeyForm] = useState({ key: '', namespace: '', value: '', languageId: '', group: '', tags: '' });
  const [savingKey, setSavingKey] = useState(false);
  const [editKeyId, setEditKeyId] = useState<string | null>(null);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [showMissing, setShowMissing] = useState(false);
  const [missingLangId, setMissingLangId] = useState('');
  const [autoTranslating, setAutoTranslating] = useState(false);

  const [entityType, setEntityType] = useState('news');
  const [entityId, setEntityId] = useState('');
  const [contentTranslations, setContentTranslations] = useState<Record<string, any>>({});
  const [loadingContent, setLoadingContent] = useState(false);

  const [importFormat, setImportFormat] = useState('json');
  const [importLang, setImportLang] = useState('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportLang, setExportLang] = useState('');
  const [exporting, setExporting] = useState(false);

  const loadStats = useCallback(async () => {
    try {
      const data = await TranslationAdminService.getTranslationStats();
      if (data) setStats(data as Stats);
    } catch { }
  }, []);

  const loadLanguages = useCallback(async () => {
    try {
      const data = await TranslationAdminService.getLanguages() as Language[];
      setLanguages(data || []);
    } catch { }
  }, []);

  const loadKeys = useCallback(async () => {
    try {
      const data = await TranslationAdminService.getTranslationKeys({
        search: keySearch || undefined,
        languageId: keyLangFilter || undefined,
        group: keyGroupFilter || undefined,
        page: keysPagination.page,
        limit: 20,
      }) as any;
      if (data) {
        setKeys(data.items || data.data || []);
        if (data.pagination) setKeysPagination(prev => ({ ...prev, totalPages: data.pagination.totalPages, total: data.pagination.total }));
      }
    } catch { }
  }, [keySearch, keyLangFilter, keyGroupFilter, keysPagination.page]);

  const initLoad = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadStats(), loadLanguages(), loadKeys()]);
    } catch {
      setError(t('Error al cargar datos'));
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadLanguages, loadKeys]);

  useEffect(() => { initLoad() }, [initLoad]);

  const handleCreateLanguage = async () => {
    setSavingLang(true);
    try {
      if (langModal.edit) {
        await TranslationAdminService.updateLanguage(langModal.edit.id, langForm);
      } else {
        await TranslationAdminService.createLanguage(langForm);
      }
      setLangModal({ open: false });
      setLangForm({ code: '', name: '', nativeName: '' });
      await Promise.all([loadLanguages(), loadStats()]);
    } catch { } finally {
      setSavingLang(false);
    }
  };

  const handleDeleteLanguage = async (id: string) => {
    if (!confirm(t('¿Eliminar este idioma?'))) return;
    try {
      await TranslationAdminService.deleteLanguage(id);
      await Promise.all([loadLanguages(), loadStats()]);
    } catch { }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await TranslationAdminService.setDefaultLanguage(id);
      await loadLanguages();
    } catch { }
  };

  const handleAutoTranslate = async () => {
    if (!keyLangFilter) return;
    setAutoTranslating(true);
    try {
      await TranslationAdminService.autoTranslate(keyLangFilter);
      await loadKeys();
    } catch { } finally {
      setAutoTranslating(false);
    }
  };

  const handleLoadMissing = async () => {
    if (!missingLangId) return;
    try {
      const data = await TranslationAdminService.getMissingKeys(missingLangId) as string[];
      setMissingKeys(data || []);
    } catch { }
  };

  const handleSaveKey = async () => {
    if (!keyForm.key || !keyForm.value || !keyForm.languageId) return;
    setSavingKey(true);
    try {
      await TranslationAdminService.upsertKey({
        key: keyForm.key,
        namespace: keyForm.namespace || undefined,
        value: keyForm.value,
        languageId: keyForm.languageId,
        group: keyForm.group || undefined,
        tags: keyForm.tags ? keyForm.tags.split(',').map(s => s.trim()).filter(Boolean) : undefined,
      });
      setKeyModal(false);
      setKeyForm({ key: '', namespace: '', value: '', languageId: '', group: '', tags: '' });
      setEditKeyId(null);
      await loadKeys();
    } catch { } finally {
      setSavingKey(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm(t('¿Eliminar esta clave?'))) return;
    try {
      await TranslationAdminService.deleteKey(id);
      await loadKeys();
    } catch { }
  };

  const handleLoadContentTranslations = async () => {
    if (!entityId) return;
    setLoadingContent(true);
    try {
      const data = await TranslationAdminService.getContentTranslations(entityType, entityId);
      setContentTranslations(data || {});
    } catch { } finally {
      setLoadingContent(false);
    }
  };

  const handleImport = async () => {
    if (!importFile || !importLang) return;
    setImporting(true);
    try {
      const fd = new FormData();
      fd.append('file', importFile);
      fd.append('languageId', importLang);
      fd.append('format', importFormat);
      await TranslationAdminService.importTranslations(fd);
      setImportFile(null);
      await loadKeys();
    } catch { } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    if (!exportLang) return;
    setExporting(true);
    try {
      const data = await TranslationAdminService.exportTranslations(exportLang, exportFormat);
      const blob = new Blob([typeof data === 'string' ? data : JSON.stringify(data, null, 2)], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${exportLang}.${exportFormat}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <AlertTriangle size={40} className="text-red-400" />
        <p className="text-neutral-500">{error}</p>
        <Button variant="outline" size="sm" onClick={initLoad}>
          <RefreshCw size={14} /> {t('Reintentar')}
        </Button>
      </div>
    );
  }

  const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
    { key: 'idiomas', label: t('Idiomas'), icon: <Globe size={16} /> },
    { key: 'claves', label: t('Claves'), icon: <Key size={16} /> },
    { key: 'contenido', label: t('Contenido'), icon: <FileJson size={16} /> },
    { key: 'import-export', label: t('Importar/Exportar'), icon: <Upload size={16} /> },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemAnim}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{t('Panel de Traducciones')}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t('Administra todos los textos de la plataforma')}</p>
      </motion.div>

      <motion.div variants={itemAnim} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label={t('Total Claves')} value={stats.totalKeys} icon={<Key size={22} />} color="text-blue-600" />
        <StatsCard label={t('Idiomas')} value={stats.totalLanguages} icon={<Globe size={22} />} color="text-green-600" />
        <StatsCard label={t('Faltantes')} value={stats.missingTranslations} icon={<AlertTriangle size={22} />} color="text-amber-600" />
        <StatsCard
          label={t('Completado')}
          value={`${Math.round(stats.completePercent)}%`}
          icon={<Target size={22} />}
          color="text-primary-600"
        />
      </motion.div>

      <motion.div variants={itemAnim}>
        <div className="mb-6 flex items-center gap-1 border-b border-neutral-200 dark:border-neutral-700">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                activeTab === tab.key
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'idiomas' && (
          <motion.div variants={itemAnim} className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-500">{t('Gestiona los idiomas disponibles en la plataforma')}</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setLangForm({ code: '', name: '', nativeName: '' });
                  setLangModal({ open: true });
                }}
              >
                <Plus size={14} /> {t('Añadir Idioma')}
              </Button>
            </div>

            {languages.length === 0 ? (
              <div className="flex flex-col items-center py-16 text-center">
                <Globe size={40} className="mb-2 text-neutral-300" />
                <p className="text-sm text-neutral-500">{t('No hay idiomas registrados')}</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {languages.map((lang, i) => (
                  <motion.div
                    key={lang.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <CardBase variant="default" padding="md">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 dark:bg-primary-900/20">
                            <Globe size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 dark:text-neutral-100">{lang.name}</p>
                            <p className="text-xs text-neutral-400">{lang.code} {lang.nativeName ? `· ${lang.nativeName}` : ''}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {lang.isDefault && (
                            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                              <Star size={10} /> {t('Defecto')}
                            </span>
                          )}
                          <StatusBadge status={lang.active ? 'active' : 'inactive'} />
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        {!lang.isDefault && (
                          <Button variant="ghost" size="xs" onClick={() => handleSetDefault(lang.id)}>
                            <Star size={12} /> {t('Defecto')}
                          </Button>
                        )}
                        <Button
                          variant="ghost" size="xs"
                          onClick={() => {
                            setLangForm({ code: lang.code, name: lang.name, nativeName: lang.nativeName || '' });
                            setLangModal({ open: true, edit: lang });
                          }}
                        >
                          <Pencil size={12} /> {t('Editar')}
                        </Button>
                        <Button variant="ghost" size="xs" onClick={() => handleDeleteLanguage(lang.id)}>
                          <Trash2 size={12} /> {t('Eliminar')}
                        </Button>
                      </div>
                    </CardBase>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'claves' && (
          <motion.div variants={itemAnim} className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  value={keySearch}
                  onChange={e => { setKeySearch(e.target.value); setKeysPagination(p => ({ ...p, page: 1 })) }}
                  placeholder={t('Buscar claves...')}
                  className="w-full rounded-lg border border-neutral-200 bg-white py-2 pl-9 pr-4 text-sm outline-none placeholder-neutral-400 focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <select
                value={keyLangFilter}
                onChange={e => { setKeyLangFilter(e.target.value); setKeysPagination(p => ({ ...p, page: 1 })) }}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="">{t('Todos los idiomas')}</option>
                {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <input
                type="text"
                value={keyGroupFilter}
                onChange={e => { setKeyGroupFilter(e.target.value); setKeysPagination(p => ({ ...p, page: 1 })) }}
                placeholder={t('Grupo...')}
                className="w-32 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              />
              <Button variant="primary" size="sm" onClick={() => { setKeyForm({ key: '', namespace: '', value: '', languageId: '', group: '', tags: '' }); setEditKeyId(null); setKeyModal(true) }}>
                <Plus size={14} /> {t('Añadir Clave')}
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={handleAutoTranslate}
                isLoading={autoTranslating}
                disabled={!keyLangFilter}
              >
                <RefreshCw size={14} /> {t('Auto-traducir')}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={missingLangId}
                onChange={e => setMissingLangId(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="">{t('Seleccionar idioma')}</option>
                {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
              </select>
              <Button variant="outline" size="sm" onClick={handleLoadMissing} disabled={!missingLangId}>
                <AlertTriangle size={14} /> {t('Ver faltantes')}
              </Button>
              {showMissing && (
                <button onClick={() => setShowMissing(false)} className="text-xs text-primary-500 hover:underline">
                  {t('Cerrar')}
                </button>
              )}
            </div>

            {showMissing && missingKeys.length > 0 && (
              <CardBase variant="flat" padding="sm">
                <p className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {t('Claves faltantes')}: {missingKeys.length}
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingKeys.map((k, i) => (
                    <span key={i} className="rounded-md bg-red-50 px-2 py-1 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">
                      {k}
                    </span>
                  ))}
                </div>
              </CardBase>
            )}

            <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800/50">
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('Clave')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('Namespace')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('Valor')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('Idioma')}</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('Estado')}</th>
                      <th className="w-24 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">{t('Acciones')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {keys.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-sm text-neutral-500">
                          {t('No se encontraron claves')}
                        </td>
                      </tr>
                    ) : (
                      keys.map((k, i) => (
                        <motion.tr
                          key={k.id}
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="group transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">{k.key}</td>
                          <td className="px-4 py-3 text-sm text-neutral-500">{k.namespace || '-'}</td>
                          <td className="max-w-[200px] truncate px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{k.value}</td>
                          <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{k.language || k.languageId}</td>
                          <td className="px-4 py-3">
                            <StatusBadge status={k.status === 'complete' ? 'published' : k.status === 'missing' ? 'pending' : 'active'} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
                              <button
                                onClick={() => {
                                  setKeyForm({ key: k.key, namespace: k.namespace || '', value: k.value, languageId: k.languageId, group: k.group || '', tags: (k.tags || []).join(', ') });
                                  setEditKeyId(k.id);
                                  setKeyModal(true);
                                }}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteKey(k.id)}
                                className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {keysPagination.totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  {keysPagination.total} {t('registros')} · {t('Página')} {keysPagination.page} {t('de')} {keysPagination.totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setKeysPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                    disabled={keysPagination.page <= 1}
                    className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: Math.min(5, keysPagination.totalPages) }, (_, i) => {
                    const start = Math.max(0, Math.min(keysPagination.page - 3, keysPagination.totalPages - 5));
                    const p = start + i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setKeysPagination(prev => ({ ...prev, page: p }))}
                        className={cn(
                          'h-8 w-8 rounded-lg text-sm font-medium',
                          keysPagination.page === p ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800',
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setKeysPagination(p => ({ ...p, page: Math.min(p.totalPages, p.page + 1) }))}
                    disabled={keysPagination.page >= keysPagination.totalPages}
                    className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'contenido' && (
          <motion.div variants={itemAnim} className="space-y-4">
            <div className="flex flex-wrap items-end gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Tipo de entidad')}</label>
                <select
                  value={entityType}
                  onChange={e => setEntityType(e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  {ENTITY_TYPES.map(et => <option key={et.value} value={et.value}>{et.label}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('ID de entidad')}</label>
                <input
                  type="text"
                  value={entityId}
                  onChange={e => setEntityId(e.target.value)}
                  placeholder={t('ID...')}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <Button variant="primary" size="sm" onClick={handleLoadContentTranslations} isLoading={loadingContent} disabled={!entityId}>
                <Search size={14} /> {t('Cargar')}
              </Button>
            </div>

            {Object.keys(contentTranslations).length > 0 && (
              <div className="space-y-4">
                {Object.entries(contentTranslations).map(([field, translations]) => (
                  <CardBase key={field} variant="default" padding="md">
                    <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{field}</h4>
                    <div className="space-y-2">
                      {(Array.isArray(translations) ? translations : Object.entries(translations)).map((trans: any, i: number) => {
                        const langCode = Array.isArray(translations) ? trans.languageId || trans.language : trans[0];
                        const value = Array.isArray(translations) ? trans.value : trans[1];
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className="w-16 text-xs font-medium text-neutral-500 uppercase">{langCode}</span>
                            <input
                              type="text"
                              defaultValue={value}
                              className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-primary-300 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                            />
                            <Button
                              variant="ghost" size="xs"
                              onClick={async () => {
                                await TranslationAdminService.upsertTranslation({
                                  entityType, entityId, field,
                                  value: (document.querySelector(`[data-field="${field}"][data-lang="${langCode}"]`) as HTMLInputElement)?.value || value,
                                  languageId: langCode,
                                });
                              }}
                            >
                              <Save size={12} /> {t('Guardar')}
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  </CardBase>
                ))}
              </div>
            )}

            {!loadingContent && Object.keys(contentTranslations).length === 0 && entityId && (
              <div className="flex flex-col items-center py-12 text-center">
                <FileJson size={40} className="mb-2 text-neutral-300" />
                <p className="text-sm text-neutral-500">{t('No hay traducciones para esta entidad')}</p>
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'import-export' && (
          <motion.div variants={itemAnim} className="grid gap-6 lg:grid-cols-2">
            <CardBase variant="default" padding="lg">
              <div className="mb-4 flex items-center gap-2">
                <Upload size={18} className="text-primary-500" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t('Importar Traducciones')}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Formato')}</label>
                  <div className="flex gap-2">
                    {IMPORT_FORMATS.map(f => (
                      <button
                        key={f.value}
                        onClick={() => setImportFormat(f.value)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                          importFormat === f.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800',
                        )}
                      >
                        {f.value === 'json' ? <FileJson size={14} /> : <FileSpreadsheet size={14} />}
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Idioma')}</label>
                  <select
                    value={importLang}
                    onChange={e => setImportLang(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="">{t('Seleccionar...')}</option>
                    {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Archivo')}</label>
                  <input
                    type="file"
                    accept={importFormat === 'json' ? '.json' : '.csv'}
                    onChange={e => setImportFile(e.target.files?.[0] || null)}
                    className="w-full text-sm text-neutral-500 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-xs file:font-medium file:text-primary-700 dark:file:bg-primary-900/20 dark:file:text-primary-400"
                  />
                </div>
                <Button
                  variant="primary" size="sm"
                  onClick={handleImport}
                  isLoading={importing}
                  disabled={!importFile || !importLang}
                  fullWidth
                >
                  <Upload size={14} /> {t('Importar')}
                </Button>
              </div>
            </CardBase>

            <CardBase variant="default" padding="lg">
              <div className="mb-4 flex items-center gap-2">
                <Download size={18} className="text-primary-500" />
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{t('Exportar Traducciones')}</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Idioma')}</label>
                  <select
                    value={exportLang}
                    onChange={e => setExportLang(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                  >
                    <option value="">{t('Seleccionar...')}</option>
                    {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Formato')}</label>
                  <div className="flex gap-2">
                    {IMPORT_FORMATS.map(f => (
                      <button
                        key={f.value}
                        onClick={() => setExportFormat(f.value)}
                        className={cn(
                          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
                          exportFormat === f.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                            : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800',
                        )}
                      >
                        {f.value === 'json' ? <FileJson size={14} /> : <FileSpreadsheet size={14} />}
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  variant="primary" size="sm"
                  onClick={handleExport}
                  isLoading={exporting}
                  disabled={!exportLang}
                  fullWidth
                >
                  <Download size={14} /> {t('Exportar')}
                </Button>
              </div>
            </CardBase>
          </motion.div>
        )}
      </motion.div>

      {langModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {langModal.edit ? t('Editar Idioma') : t('Añadir Idioma')}
              </h3>
              <button onClick={() => setLangModal({ open: false })} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Código')}</label>
                <input
                  type="text"
                  value={langForm.code}
                  onChange={e => setLangForm(f => ({ ...f, code: e.target.value }))}
                  placeholder="es, en, pt..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Nombre')}</label>
                <input
                  type="text"
                  value={langForm.name}
                  onChange={e => setLangForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Español"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Nombre nativo')}</label>
                <input
                  type="text"
                  value={langForm.nativeName}
                  onChange={e => setLangForm(f => ({ ...f, nativeName: e.target.value }))}
                  placeholder="Español"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setLangModal({ open: false })}>
                  {t('Cancelar')}
                </Button>
                <Button variant="primary" size="sm" onClick={handleCreateLanguage} isLoading={savingLang}>
                  <Save size={14} /> {langModal.edit ? t('Guardar') : t('Crear')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {keyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-6 shadow-xl dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {editKeyId ? t('Editar Clave') : t('Añadir Clave')}
              </h3>
              <button onClick={() => setKeyModal(false)} className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Clave')} *</label>
                <input
                  type="text"
                  value={keyForm.key}
                  onChange={e => setKeyForm(f => ({ ...f, key: e.target.value }))}
                  placeholder="home.title"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Namespace')}</label>
                <input
                  type="text"
                  value={keyForm.namespace}
                  onChange={e => setKeyForm(f => ({ ...f, namespace: e.target.value }))}
                  placeholder="common"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Valor')} *</label>
                <textarea
                  value={keyForm.value}
                  onChange={e => setKeyForm(f => ({ ...f, value: e.target.value }))}
                  placeholder="Inicio"
                  rows={3}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Idioma')} *</label>
                <select
                  value={keyForm.languageId}
                  onChange={e => setKeyForm(f => ({ ...f, languageId: e.target.value }))}
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                >
                  <option value="">{t('Seleccionar...')}</option>
                  {languages.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Grupo')}</label>
                <input
                  type="text"
                  value={keyForm.group}
                  onChange={e => setKeyForm(f => ({ ...f, group: e.target.value }))}
                  placeholder="general"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">{t('Tags (separados por coma)')}</label>
                <input
                  type="text"
                  value={keyForm.tags}
                  onChange={e => setKeyForm(f => ({ ...f, tags: e.target.value }))}
                  placeholder="header, nav"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setKeyModal(false)}>
                  {t('Cancelar')}
                </Button>
                <Button variant="primary" size="sm" onClick={handleSaveKey} isLoading={savingKey}>
                  <Save size={14} /> {editKeyId ? t('Guardar') : t('Crear')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
