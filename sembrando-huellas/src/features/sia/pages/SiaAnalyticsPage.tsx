import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, PieChart as PieChartIcon, Radar as RadarIcon } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { SiaService } from '../services/sia';
import { cn } from '@/lib/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

const METRICS = [
  { value: 'activities', label: 'Actividades' },
  { value: 'trees', label: 'Árboles Plantados' },
  { value: 'students', label: 'Estudiantes' },
  { value: 'species', label: 'Especies' },
  { value: 'observations', label: 'Observaciones' },
  { value: 'volunteer_hours', label: 'Horas Voluntariado' },
];

const PERIODS = [
  { value: 'monthly', label: 'Mensual' },
  { value: 'quarterly', label: 'Trimestral' },
  { value: 'yearly', label: 'Anual' },
];

interface AccumulatedIndicator {
  label: string;
  value: number;
  change: number;
  positive: boolean;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
    </div>
  );
}

export default function SiaAnalyticsPage() {
  const [metric, setMetric] = useState('activities');
  const [period, setPeriod] = useState('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lineData, setLineData] = useState<any[]>([]);
  const [barData, setBarData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);
  const [radarData, setRadarData] = useState<any[]>([]);
  const [accumulated, setAccumulated] = useState<AccumulatedIndicator[]>([]);

  const fetchAll = async (m: string, p: string) => {
    setLoading(true);
    setError(null);
    try {
      const [lineResult, barResult, pieResult, radarResult, accResult] = await Promise.all([
        SiaService.getLineChart(m, p),
        SiaService.getBarChart('region', m),
        SiaService.getPieChart(m),
        SiaService.getRadarChart(['environmental', 'social', 'economic', 'educational', 'sustainability']),
        SiaService.getAccumulatedIndicators(),
      ]);
      setLineData(lineResult?.data || []);
      setBarData(barResult?.data || []);
      setPieData(pieResult?.data || []);
      setRadarData(radarResult?.data || []);
      setAccumulated(accResult?.data || []);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar datos de análisis');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(metric, period); }, []);

  const handleMetricChange = (m: string) => {
    setMetric(m);
    fetchAll(m, period);
  };

  const handlePeriodChange = (p: string) => {
    setPeriod(p);
    fetchAll(metric, p);
  };

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={48} className="mb-4 text-red-400" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Error al cargar análisis</h2>
        <p className="mt-1 text-sm text-neutral-500">{error}</p>
        <button onClick={() => fetchAll(metric, period)} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Reintentar</button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Análisis Estadístico</h1>
          <p className="mt-1 text-sm text-neutral-500">Visualización y análisis de datos ambientales del sistema</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Métrica</label>
            <select
              value={metric}
              onChange={(e) => handleMetricChange(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {METRICS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-neutral-500">Período</label>
            <select
              value={period}
              onChange={(e) => handlePeriodChange(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {PERIODS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-1 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary-600" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Evolución Temporal</h3>
          </div>
          <p className="mb-4 text-xs text-neutral-500">Tendencia de {METRICS.find((m) => m.value === metric)?.label.toLowerCase()} en el tiempo</p>
          {loading ? <Spinner /> : lineData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-neutral-400">Sin datos disponibles</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-1 flex items-center gap-2">
            <BarChart3 size={16} className="text-blue-500" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Distribución por Región</h3>
          </div>
          <p className="mb-4 text-xs text-neutral-500">Comparativa regional de {METRICS.find((m) => m.value === metric)?.label.toLowerCase()}</p>
          {loading ? <Spinner /> : barData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-neutral-400">Sin datos disponibles</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-1 flex items-center gap-2">
            <PieChartIcon size={16} className="text-amber-500" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Composición</h3>
          </div>
          <p className="mb-4 text-xs text-neutral-500">Distribución porcentual de {METRICS.find((m) => m.value === metric)?.label.toLowerCase()}</p>
          {loading ? <Spinner /> : pieData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-neutral-400">Sin datos disponibles</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} label={(entry: any) => entry.label}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-1 flex items-center gap-2">
            <RadarIcon size={16} className="text-purple-500" />
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Dimensiones Integrales</h3>
          </div>
          <p className="mb-4 text-xs text-neutral-500">Evaluación multi-dimensional del desempeño ambiental</p>
          {loading ? <Spinner /> : radarData.length === 0 ? (
            <div className="flex h-[280px] items-center justify-center text-sm text-neutral-400">Sin datos disponibles</div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis tick={{ fontSize: 11 }} />
                <Radar name="Valor actual" dataKey="value" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Indicadores Acumulados</h3>
        <p className="mb-4 text-sm text-neutral-500">Resumen de métricas consolidadas del sistema</p>
        {loading ? <Spinner /> : accumulated.length === 0 ? (
          <div className="flex h-24 items-center justify-center text-sm text-neutral-400">Sin indicadores disponibles</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {accumulated.map((indicator, i) => (
              <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 text-center dark:border-neutral-600 dark:bg-neutral-700/50">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{indicator.value.toLocaleString()}</p>
                <p className="mt-0.5 text-xs text-neutral-500">{indicator.label}</p>
                {indicator.change !== undefined && (
                  <span className={cn(
                    'mt-1 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                    indicator.positive ? 'text-green-600' : 'text-red-600',
                  )}>
                    {indicator.positive ? '+' : ''}{indicator.change}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
