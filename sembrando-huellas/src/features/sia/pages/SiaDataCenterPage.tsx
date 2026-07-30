import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Database, BarChart3, Globe, Layers, Download, Plus, RefreshCw, Calendar, Tag, FileText, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/cn';
import StatsCard from '@/features/admin/components/shared/StatsCard';
import { SiaService } from '../services/sia';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const TABS = [
  { key: 'datasets', label: 'Datasets', icon: <Database size={16} /> },
  { key: 'timeseries', label: 'Series Temporales', icon: <BarChart3 size={16} /> },
  { key: 'opendata', label: 'Datos Abiertos', icon: <Globe size={16} /> },
];

const CATEGORIES = ['Biodiversidad', 'Clima', 'Agua', 'Suelo', 'Social', 'Económico'];
const FORMATS = ['CSV', 'JSON', 'GeoJSON', 'Excel', 'PDF'];
const VISIBILITIES = ['public', 'private', 'internal'];

export default function SiaDataCenterPage() {
  const [activeTab, setActiveTab] = useState('datasets');
  const [loading, setLoading] = useState(true);
  const [metadata, setMetadata] = useState<any>(null);
  const [datasets, setDatasets] = useState<any[]>([]);
  const [timeSeries, setTimeSeries] = useState<any[]>([]);
  const [openData, setOpenData] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', slug: '', description: '', category: '', source: '', format: 'CSV', visibility: 'public' });
  const [tsIndicator, setTsIndicator] = useState('');
  const [tsStart, setTsStart] = useState('');
  const [tsEnd, setTsEnd] = useState('');

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [meta, ds] = await Promise.all([
        SiaService.getDataCenterMetadata().catch(() => null),
        SiaService.listDatasets().catch(() => []),
      ]);
      setMetadata(meta);
      setDatasets(Array.isArray(ds) ? ds : ds?.data || []);
    } catch {}
    setLoading(false);
  }

  async function loadTimeSeries() {
    try {
      const res = await SiaService.getTimeSeriesData(tsIndicator || undefined, tsStart || undefined, tsEnd || undefined);
      setTimeSeries(Array.isArray(res) ? res : res?.data || []);
    } catch {}
  }

  async function loadOpenData() {
    try {
      const res = await SiaService.getOpenDataCatalog();
      setOpenData(Array.isArray(res) ? res : res?.data || []);
    } catch {}
  }

  useEffect(() => { if (activeTab === 'opendata' && openData.length === 0) loadOpenData(); }, [activeTab]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await SiaService.createDataset(form);
      setShowForm(false);
      setForm({ title: '', slug: '', description: '', category: '', source: '', format: 'CSV', visibility: 'public' });
      loadAll();
    } catch {}
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
              <Database size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Centro de Datos</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Gestión centralizada de datasets, series temporales y datos abiertos</p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {metadata && (
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Total Datasets" value={(metadata.totalDatasets || metadata.total || 0).toLocaleString()} icon={<Database size={22} />} color="text-blue-600" />
          <StatsCard label="Categorías" value={(metadata.categories || 0).toLocaleString()} icon={<Layers size={22} />} color="text-cyan-600" />
          <StatsCard label="Formatos" value={(metadata.formats || 0).toLocaleString()} icon={<FileText size={22} />} color="text-indigo-600" />
          <StatsCard label="Última actualización" value={metadata.lastUpdate ? new Date(metadata.lastUpdate).toLocaleDateString() : '-'} icon={<Calendar size={22} />} color="text-purple-600" />
        </motion.div>
      )}

      <motion.div variants={item} className="flex gap-2 border-b border-neutral-200 pb-2 dark:border-neutral-700">
        {TABS.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 rounded-t-lg px-4 py-2 text-sm font-medium transition-all',
              activeTab === tab.key
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
            )}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </motion.div>

      {activeTab === 'datasets' && (
        <motion.div variants={item} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">{datasets.length} datasets</p>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              <Plus size={16} /> Nuevo Dataset
            </button>
          </div>
          {showForm && (
            <form onSubmit={handleCreate} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Título</label>
                  <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Slug</label>
                  <input type="text" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} required
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Descripción</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Categoría</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                    <option value="">Seleccionar...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Fuente</label>
                  <input type="text" value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Formato</label>
                  <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                    {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-neutral-500">Visibilidad</label>
                  <select value={form.visibility} onChange={e => setForm({ ...form, visibility: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                    {VISIBILITIES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">Cancelar</button>
                <button type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Crear Dataset</button>
              </div>
            </form>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {datasets.map((ds: any, i: number) => (
              <div key={ds.id || i} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">{ds.category || 'General'}</span>
                  {ds.visibility === 'public' ? <Eye size={14} className="text-green-500" /> : <EyeOff size={14} className="text-neutral-400" />}
                </div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{ds.title}</h3>
                <p className="mt-1 text-xs text-neutral-400 line-clamp-2">{ds.description}</p>
                <div className="mt-3 flex items-center justify-between text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><Tag size={12} /> {ds.format}</span>
                  <span className="flex items-center gap-1"><Download size={12} /> {ds.downloadCount || 0} descargas</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'timeseries' && (
        <motion.div variants={item} className="space-y-4">
          <div className="flex flex-wrap items-end gap-4 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Indicador</label>
              <select value={tsIndicator} onChange={e => setTsIndicator(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <option value="">Todos</option>
                {['Avistamientos', 'Especies', 'Cobertura', 'Calidad agua', 'Biodiversidad'].map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Fecha inicio</label>
              <input type="date" value={tsStart} onChange={e => setTsStart(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Fecha fin</label>
              <input type="date" value={tsEnd} onChange={e => setTsEnd(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <button onClick={loadTimeSeries}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Consultar</button>
          </div>
          {timeSeries.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Fecha</th>
                    <th className="px-4 py-3 text-left font-medium text-neutral-500">Indicador</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-500">Valor</th>
                    <th className="px-4 py-3 text-right font-medium text-neutral-500">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {timeSeries.map((ts: any, i: number) => (
                    <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800">
                      <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{ts.date ? new Date(ts.date).toLocaleDateString() : '-'}</td>
                      <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{ts.indicator || ts.label}</td>
                      <td className="px-4 py-3 text-right text-neutral-900 dark:text-neutral-100">{ts.value}</td>
                      <td className="px-4 py-3 text-right text-neutral-500">{ts.unit || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}

      {activeTab === 'opendata' && (
        <motion.div variants={item} className="space-y-4">
          <p className="text-sm text-neutral-500">Catálogo de datos abiertos disponibles para descarga pública</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {openData.map((od: any, i: number) => (
              <div key={od.id || i} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} className="text-green-500" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Abierto</span>
                </div>
                <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{od.title || od.name}</h3>
                <p className="mt-1 text-xs text-neutral-400">{od.description || od.format}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-neutral-400">{od.updatedAt ? new Date(od.updatedAt).toLocaleDateString() : ''}</span>
                  <button className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    <Download size={12} /> Descargar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
