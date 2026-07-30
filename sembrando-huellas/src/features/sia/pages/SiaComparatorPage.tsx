import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowLeftRight, BarChart3, Table2, RefreshCw, MapPin, Building2, Megaphone, FolderKanban, Calendar } from 'lucide-react';
import { cn } from '@/lib/cn';
import StatsCard from '@/features/admin/components/shared/StatsCard';
import { SiaService } from '../services/sia';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const COMPARISON_TYPES = [
  { key: 'region', label: 'Región', icon: <MapPin size={16} /> },
  { key: 'institution', label: 'Institución', icon: <Building2 size={16} /> },
  { key: 'campaign', label: 'Campaña', icon: <Megaphone size={16} /> },
  { key: 'project', label: 'Proyecto', icon: <FolderKanban size={16} /> },
  { key: 'period', label: 'Período', icon: <Calendar size={16} /> },
];

const INDICATORS = [
  'Avistamientos totales', 'Especies identificadas', 'Cobertura vegetal',
  'Calidad de agua', 'Índice de biodiversidad', 'Registros históricos',
];

export default function SiaComparatorPage() {
  const [type, setType] = useState('region');
  const [entity1, setEntity1] = useState('');
  const [entity2, setEntity2] = useState('');
  const [indicator, setIndicator] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [view, setView] = useState<'chart' | 'table'>('chart');

  const handleCompare = async () => {
    setLoading(true);
    setResult(null);
    try {
      const payload: any = { type, indicatorId: indicator || undefined };
      if (type === 'period') {
        payload.startDate = entity1;
        payload.endDate = entity2;
      } else {
        payload.ids = [entity1, entity2].filter(Boolean);
      }
      const res = await SiaService.compare(payload);
      setResult(res);
    } catch {}
    setLoading(false);
  };

  const chartData = result?.data?.map((d: any) => ({
    name: d.name || d.label,
    valor1: d.valor1 ?? d.value1 ?? 0,
    valor2: d.valor2 ?? d.value2 ?? 0,
  })) || [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 text-white">
              <ArrowLeftRight size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Comparador</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Compare indicadores entre regiones, instituciones, campañas, proyectos o períodos</p>
        </div>
        {result && (
          <div className="flex gap-2">
            <button onClick={() => setView(view === 'chart' ? 'table' : 'chart')}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              {view === 'chart' ? <Table2 size={14} /> : <BarChart3 size={14} />} {view === 'chart' ? 'Tabla' : 'Gráfico'}
            </button>
            <button onClick={handleCompare} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
            </button>
          </div>
        )}
      </div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex flex-wrap gap-2 mb-6">
          {COMPARISON_TYPES.map((ct) => (
            <button key={ct.key} onClick={() => { setType(ct.key); setResult(null); }}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                type === ct.key
                  ? 'border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-800 dark:bg-violet-900/20 dark:text-violet-300'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
              )}>
              {ct.icon} {ct.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {type === 'period' ? (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Fecha inicio</label>
                <input type="date" value={entity1} onChange={e => setEntity1(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Fecha fin</label>
                <input type="date" value={entity2} onChange={e => setEntity2(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Entidad 1</label>
                <input type="text" value={entity1} onChange={e => setEntity1(e.target.value)} placeholder={`Nombre de ${type}`}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Entidad 2</label>
                <input type="text" value={entity2} onChange={e => setEntity2(e.target.value)} placeholder={`Nombre de ${type}`}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
            </>
          )}
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Indicador</label>
            <select value={indicator} onChange={e => setIndicator(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
              <option value="">Seleccionar...</option>
              {INDICATORS.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleCompare} disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700 disabled:opacity-50">
              {loading ? 'Comparando...' : 'Comparar'}
            </button>
          </div>
        </div>
      </motion.div>

      {result && (
        <motion.div variants={item} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard label="Total registros" value={(result.total || 0).toLocaleString()} icon={<BarChart3 size={22} />} color="text-violet-600" />
            <StatsCard label="Diferencia promedio" value={result.avgDiff != null ? result.avgDiff.toFixed(2) : '0'} icon={<ArrowLeftRight size={22} />} color="text-purple-600" />
            <StatsCard label="Entidad 1" value={result.entity1Label || '-'} icon={<BarChart3 size={22} />} color="text-blue-600" />
            <StatsCard label="Entidad 2" value={result.entity2Label || '-'} icon={<BarChart3 size={22} />} color="text-amber-600" />
          </div>

          {view === 'chart' && chartData.length > 0 && (
            <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Comparación gráfica</h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-700" />
                  <XAxis dataKey="name" className="text-xs text-neutral-500" />
                  <YAxis className="text-xs text-neutral-500" />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb' }} />
                  <Legend />
                  <Bar dataKey="valor1" fill="#7c3aed" name={result.entity1Label || 'Entidad 1'} radius={[6, 6, 0, 0]} />
                  <Bar dataKey="valor2" fill="#f59e0b" name={result.entity2Label || 'Entidad 2'} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {view === 'table' && result.data?.length > 0 && (
            <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800 overflow-x-auto">
              <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Tabla de diferencias</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="pb-3 text-left font-medium text-neutral-500">Indicador</th>
                    <th className="pb-3 text-right font-medium text-neutral-500">{result.entity1Label || 'Entidad 1'}</th>
                    <th className="pb-3 text-right font-medium text-neutral-500">{result.entity2Label || 'Entidad 2'}</th>
                    <th className="pb-3 text-right font-medium text-neutral-500">Diferencia</th>
                    <th className="pb-3 text-right font-medium text-neutral-500">%</th>
                  </tr>
                </thead>
                <tbody>
                  {result.data.map((d: any, i: number) => {
                    const v1 = d.valor1 ?? d.value1 ?? 0;
                    const v2 = d.valor2 ?? d.value2 ?? 0;
                    const diff = v1 - v2;
                    const pct = v2 !== 0 ? ((diff / v2) * 100).toFixed(1) : '∞';
                    return (
                      <tr key={i} className="border-b border-neutral-100 dark:border-neutral-800">
                        <td className="py-3 text-neutral-900 dark:text-neutral-100">{d.name || d.label || d.indicator}</td>
                        <td className="py-3 text-right text-neutral-700 dark:text-neutral-300">{v1}</td>
                        <td className="py-3 text-right text-neutral-700 dark:text-neutral-300">{v2}</td>
                        <td className={cn('py-3 text-right font-medium', diff >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {diff >= 0 ? '+' : ''}{diff.toFixed(2)}
                        </td>
                        <td className={cn('py-3 text-right font-medium', Number(pct) >= 0 ? 'text-green-600' : 'text-red-600')}>
                          {pct}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </motion.div>
          )}
        </motion.div>
      )}

      {!result && !loading && (
        <motion.div variants={item} className="flex flex-col items-center justify-center py-16 text-neutral-400">
          <ArrowLeftRight size={48} className="mb-4 opacity-30" />
          <p className="text-sm">Seleccione los parámetros de comparación y presione "Comparar"</p>
        </motion.div>
      )}
    </motion.div>
  );
}
