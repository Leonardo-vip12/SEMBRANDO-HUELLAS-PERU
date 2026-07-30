import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Eye, AlertTriangle, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
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

const CHART_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
    </div>
  );
}

interface SpeciesItem {
  name: string;
  count: number;
}

interface TimelinePoint {
  date: string;
  observations: number;
}

interface ConservationItem {
  status: string;
  count: number;
}

interface HistoricalRecord {
  id: string;
  speciesName: string;
  date: string;
  region: string;
  observer: string;
  status: string;
}

interface StatsData {
  totalSpecies: number;
  totalObservations: number;
  conservationStatuses: { status: string; count: number }[];
}

export default function SiaBiodiversityPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [speciesDistribution, setSpeciesDistribution] = useState<SpeciesItem[]>([]);
  const [observationsTimeline, setObservationsTimeline] = useState<TimelinePoint[]>([]);
  const [conservationStatus, setConservationStatus] = useState<ConservationItem[]>([]);
  const [historicalRecords, setHistoricalRecords] = useState<HistoricalRecord[]>([]);
  const [temporalComparison, setTemporalComparison] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [year1, setYear1] = useState(new Date().getFullYear() - 1);
  const [year2, setYear2] = useState(new Date().getFullYear());
  const [comparing, setComparing] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dist, timeline, conservation, records, comp] = await Promise.all([
        SiaService.getSpeciesDistribution(),
        SiaService.getObservationsTimeline(),
        SiaService.getConservationStatus(),
        SiaService.getHistoricalRecords({ page, limit: 10 }),
        SiaService.getTemporalComparison(year1, year2),
      ]);
      setSpeciesDistribution(dist?.data || []);
      setObservationsTimeline(timeline?.data || []);
      setConservationStatus(conservation?.data || []);
      setHistoricalRecords(records?.data || []);
      setTotalRecords(records?.total || 0);
      setTemporalComparison(comp?.data || []);

      const totalSpecies = dist?.data?.length || 0;
      const totalObservations = timeline?.data?.reduce((sum: number, p: TimelinePoint) => sum + p.observations, 0) || 0;
      setStats({ totalSpecies, totalObservations, conservationStatuses: conservation?.data || [] });
    } catch (err: any) {
      setError(err?.message || 'Error al cargar datos de biodiversidad');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [page]);

  const loadTemporalComparison = async () => {
    setComparing(true);
    try {
      const result = await SiaService.getTemporalComparison(year1, year2);
      setTemporalComparison(result?.data || []);
    } catch { /* ignore */ } finally {
      setComparing(false);
    }
  };

  const handleMapData = async () => {
    try {
      await SiaService.getBiodiversityMapData();
    } catch { /* ignore */ }
  };

  const recordsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(totalRecords / recordsPerPage));

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={48} className="mb-4 text-red-400" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Error al cargar el observatorio</h2>
        <p className="mt-1 text-sm text-neutral-500">{error}</p>
        <button onClick={fetchAll} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Reintentar</button>
      </motion.div>
    );
  }

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Observatorio de Biodiversidad</h1>
        <p className="mt-1 text-sm text-neutral-500">Monitoreo y análisis de la biodiversidad registrada en el sistema</p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatsCard label="Especies Registradas" value={loading ? '...' : (stats?.totalSpecies ?? 0)} icon={<Leaf size={18} />} color="text-primary-600" />
        <StatsCard label="Observaciones" value={loading ? '...' : (stats?.totalObservations ?? 0)} icon={<Eye size={18} />} color="text-blue-600" />
        {loading ? (
          <>
            <StatsCard label="Estado de Conservación" value="..." icon={<AlertTriangle size={18} />} color="text-amber-600" />
            <StatsCard label="Datos Geográficos" value="..." icon={<MapPin size={18} />} color="text-purple-600" />
          </>
        ) : (
          (stats?.conservationStatuses?.slice(0, 2) || []).map((cs) => (
            <StatsCard key={cs.status} label={cs.status} value={cs.count} icon={<AlertTriangle size={18} />} color="text-amber-600" />
          ))
        )}
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Distribución de Especies</h3>
          <p className="mb-4 text-xs text-neutral-500">Cantidad de registros por especie</p>
          {loading ? <Spinner /> : speciesDistribution.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-neutral-400">Sin datos</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={speciesDistribution} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                  {speciesDistribution.map((_, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Observaciones en el Tiempo</h3>
          <p className="mb-4 text-xs text-neutral-500">Evolución de observaciones registradas</p>
          {loading ? <Spinner /> : observationsTimeline.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-neutral-400">Sin datos</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={observationsTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="observations" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h3 className="mb-1 text-base font-semibold text-neutral-900 dark:text-neutral-100">Estado de Conservación</h3>
          <p className="mb-4 text-xs text-neutral-500">Distribución por categoría de amenaza</p>
          {loading ? <Spinner /> : conservationStatus.length === 0 ? (
            <div className="flex h-[250px] items-center justify-center text-sm text-neutral-400">Sin datos</div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={conservationStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Comparativa Temporal</h3>
            <p className="text-xs text-neutral-500">Comparación entre dos períodos anuales</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={year1}
              onChange={(e) => setYear1(Number(e.target.value))}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="text-sm text-neutral-400">vs</span>
            <select
              value={year2}
              onChange={(e) => setYear2(Number(e.target.value))}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
            >
              {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button
              onClick={loadTemporalComparison}
              disabled={comparing}
              className="rounded-lg bg-primary-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-50"
            >
              {comparing ? 'Cargando...' : 'Comparar'}
            </button>
          </div>
        </div>
        {comparing ? <Spinner /> : temporalComparison.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-neutral-400">Selecciona dos años y presiona Comparar</div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={temporalComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="year1" name={String(year1)} fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="year2" name={String(year2)} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      <motion.div variants={itemVariants} className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">Registros Históricos</h3>
            <p className="text-xs text-neutral-500">Últimas observaciones documentadas</p>
          </div>
          <button onClick={handleMapData} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-700">
            <MapPin size={14} /> Ver en Mapa
          </button>
        </div>
        {loading ? <Spinner /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800/50">
                  <th className="px-6 py-3">Especie</th>
                  <th className="px-6 py-3">Fecha</th>
                  <th className="px-6 py-3">Región</th>
                  <th className="px-6 py-3">Observador</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {historicalRecords.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-sm text-neutral-400">No se encontraron registros</td>
                  </tr>
                ) : (
                  historicalRecords.map((rec) => (
                    <tr key={rec.id} className="text-sm text-neutral-700 transition-colors hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50">
                      <td className="px-6 py-3 font-medium">{rec.speciesName}</td>
                      <td className="px-6 py-3">{rec.date}</td>
                      <td className="px-6 py-3">{rec.region}</td>
                      <td className="px-6 py-3">{rec.observer}</td>
                      <td className="px-6 py-3">
                        <span className={cn(
                          'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                          rec.status === 'confirmed' && 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
                          rec.status === 'pending' && 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
                          rec.status === 'rejected' && 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
                        )}>
                          {rec.status === 'confirmed' ? 'Confirmado' : rec.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-neutral-200 px-6 py-3 dark:border-neutral-700">
          <p className="text-sm text-neutral-500">{totalRecords} registros · Página {page} de {totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:hover:bg-neutral-800">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
