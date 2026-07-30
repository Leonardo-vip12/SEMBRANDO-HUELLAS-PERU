import { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Building2, GraduationCap, UserCheck, TreePine,
  Leaf, Eye, Megaphone, Database, Clock,
  Filter, BarChart3, FileText, AlertTriangle, TrendingUp, Globe,
} from 'lucide-react';
import { SiaService } from '../services/sia';
import StatsCard from '@/features/admin/components/shared/StatsCard';
import { cn } from '@/lib/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const TimeSeriesChart = lazy(() =>
  import('recharts').then((mod) => ({
    default: ({ data }: { data: { label: string; value: number }[] }) => {
      const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } = mod;
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      );
    },
  }))
);

interface DashboardData {
  activities: number;
  institutions: number;
  students: number;
  teachers: number;
  trees: number;
  species: number;
  observations: number;
  campaigns: number;
  resources: number;
  volunteerHours: number;
  [key: string]: number;
}

const STAT_CARDS = [
  { key: 'activities', label: 'Actividades', icon: Activity },
  { key: 'institutions', label: 'Instituciones', icon: Building2 },
  { key: 'students', label: 'Estudiantes', icon: GraduationCap },
  { key: 'teachers', label: 'Docentes', icon: UserCheck },
  { key: 'trees', label: 'Árboles', icon: TreePine },
  { key: 'species', label: 'Especies', icon: Leaf },
  { key: 'observations', label: 'Observaciones', icon: Eye },
  { key: 'campaigns', label: 'Campañas', icon: Megaphone },
  { key: 'resources', label: 'Recursos', icon: Database },
  { key: 'volunteerHours', label: 'Horas Voluntariado', icon: Clock },
];

const QUICK_ACTIONS = [
  { label: 'Biodiversidad', icon: Leaf, path: '/sia/biodiversidad', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' },
  { label: 'Mapas Temáticos', icon: Globe, path: '/sia/mapas', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
  { label: 'Análisis', icon: BarChart3, path: '/sia/analisis', color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20' },
  { label: 'Reportes', icon: FileText, path: '/sia/reportes', color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' },
  { label: 'Alertas', icon: AlertTriangle, path: '/sia/alertas', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
  { label: 'Indicadores', icon: TrendingUp, path: '/sia/indicadores', color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20' },
];

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
    </div>
  );
}

export default function SiaDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [timeSeries, setTimeSeries] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({ startDate: '', endDate: '', region: '', institution: '' });

  const fetchData = async (appliedFilters?: typeof filters) => {
    const f = appliedFilters || filters;
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, string> = {};
      if (f.startDate) params.startDate = f.startDate;
      if (f.endDate) params.endDate = f.endDate;
      if (f.region) params.region = f.region;
      if (f.institution) params.institution = f.institution;
      const [dashResult, tsResult] = await Promise.all([
        SiaService.getDashboard(params),
        SiaService.getTimeSeries('all', f.startDate, f.endDate),
      ]);
      setData(dashResult);
      setTimeSeries(tsResult?.data || []);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleFilter = () => fetchData();

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={48} className="mb-4 text-red-400" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Error al cargar el dashboard</h2>
        <p className="mt-1 text-sm text-neutral-500">{error}</p>
        <button onClick={() => fetchData()} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Reintentar</button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Dashboard Ejecutivo SIA</h1>
        <p className="mt-1 text-sm text-neutral-500">Panel de monitoreo integral del Sistema Inteligente de Información Ambiental</p>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-500">Fecha inicio</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, startDate: e.target.value }))}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-500">Fecha fin</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters((prev) => ({ ...prev, endDate: e.target.value }))}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-500">Región</label>
          <select
            value={filters.region}
            onChange={(e) => setFilters((prev) => ({ ...prev, region: e.target.value }))}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          >
            <option value="">Todas</option>
            <option value="norte">Norte</option>
            <option value="sur">Sur</option>
            <option value="centro">Centro</option>
            <option value="oriente">Oriente</option>
            <option value="occidente">Occidente</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-500">Institución</label>
          <input
            type="text"
            value={filters.institution}
            onChange={(e) => setFilters((prev) => ({ ...prev, institution: e.target.value }))}
            placeholder="Buscar institución..."
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
        <button
          onClick={handleFilter}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          <Filter size={14} /> Filtrar
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {STAT_CARDS.map((card) => (
          <StatsCard
            key={card.key}
            label={card.label}
            value={loading ? '...' : (data?.[card.key] ?? 0)}
            icon={<card.icon size={18} />}
            color="text-primary-600"
          />
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Evolución Temporal</h2>
        <p className="mb-4 text-sm text-neutral-500">Comportamiento de métricas seleccionadas en el tiempo</p>
        {loading ? (
          <Spinner />
        ) : timeSeries.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-neutral-400">Sin datos disponibles para el período seleccionado</div>
        ) : (
          <Suspense fallback={<Spinner />}>
            <TimeSeriesChart data={timeSeries} />
          </Suspense>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Acceso Rápido</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {QUICK_ACTIONS.map((action) => (
            <motion.a
              key={action.path}
              whileHover={{ y: -2 }}
              href={action.path}
              className="flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-center transition-shadow hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', action.color)}>
                <action.icon size={18} />
              </div>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{action.label}</span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
