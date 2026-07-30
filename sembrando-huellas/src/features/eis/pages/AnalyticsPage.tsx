import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, MessageSquare, Camera, FileText, Calendar, Bird, Award, TrendingUp, Activity, Users, DollarSign, Clock, AlertTriangle } from 'lucide-react';
import { EisService } from '@/services/eis';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AnalyticsPage() {
  const [dashboard, setDashboard] = useState<any>(null);
  const [aiMetrics, setAiMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [dash, metrics] = await Promise.all([
        EisService.analyticsDashboard().catch(() => null),
        EisService.analyticsAIMetrics().catch(() => null),
      ]);
      setDashboard(dash);
      setAiMetrics(metrics);
    } catch {}
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center text-neutral-400">
          <BarChart3 size={40} className="mx-auto mb-2 animate-pulse" />
          <p className="text-sm">Cargando analítica...</p>
        </div>
      </div>
    );
  }

  const overview = dashboard?.overview || {};
  const metrics = aiMetrics || {};

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
          <BarChart3 size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analítica IA</h1>
          <p className="text-sm text-neutral-500">Panel de monitoreo del ecosistema de inteligencia ambiental</p>
        </div>
      </div>

      <motion.div variants={itemAnim} className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Consultas IA</span>
            <MessageSquare size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalQueries || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Identificaciones</span>
            <Camera size={18} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalIdentifications || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Documentos</span>
            <FileText size={18} className="text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalDocuments || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Actividades</span>
            <Calendar size={18} className="text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalActivities || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Observaciones</span>
            <Bird size={18} className="text-green-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalObservations || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Certificados</span>
            <Award size={18} className="text-amber-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalCertificates || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Base Conocimiento</span>
            <Brain size={18} className="text-cyan-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(overview.totalKnowledgeEntries || 0).toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-neutral-400">Usuarios Activos</span>
            <Users size={18} className="text-indigo-500" />
          </div>
          <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{(dashboard?.activeUsers?.total || 0).toLocaleString()}</p>
        </div>
      </motion.div>

      {aiMetrics && (
        <motion.div variants={itemAnim} className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Métricas de IA</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><DollarSign size={14} /> Costo Total</div>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">${(metrics.totalCost || 0).toFixed(4)}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><Activity size={14} /> Tokens Totales</div>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{(metrics.totalTokens || 0).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><Clock size={14} /> Latencia Promedio</div>
              <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{(metrics.averageLatency || 0).toFixed(0)}ms</p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center gap-2 text-xs text-neutral-400"><AlertTriangle size={14} /> Errores 24h</div>
              <p className="text-xl font-bold text-red-500">{metrics.errorsLast24h || 0}</p>
            </div>
          </div>
        </motion.div>
      )}

      {dashboard?.queryStats && (
        <motion.div variants={itemAnim} className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <TrendingUp size={16} /> Consultas por Funcionalidad
            </h3>
            <div className="space-y-2">
              {Object.entries(dashboard.queryStats.features || {}).sort(([, a], [, b]) => (b as number) - (a as number)).map(([feature, count]) => (
                <div key={feature} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 capitalize dark:text-neutral-300">{feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.min(100, ((count as number) / Math.max(...(Object.values(dashboard.queryStats.features) as number[])) * 100))}%` }} />
                    </div>
                    <span className="text-xs text-neutral-400">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <TrendingUp size={16} /> Consultas por Proveedor
            </h3>
            <div className="space-y-2">
              {Object.entries(dashboard.queryStats.providers || {}).sort(([, a], [, b]) => (b as number) - (a as number)).map(([provider, count]) => (
                <div key={provider} className="flex items-center justify-between text-sm">
                  <span className="capitalize text-neutral-600 dark:text-neutral-300">{provider}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-700">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${Math.min(100, ((count as number) / Math.max(...(Object.values(dashboard.queryStats.providers) as number[])) * 100))}%` }} />
                    </div>
                    <span className="text-xs text-neutral-400">{count as number}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {dashboard?.speciesStats && dashboard.speciesStats.length > 0 && (
        <motion.div variants={itemAnim} className="mt-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <Camera size={16} /> Especies Más Identificadas
            </h3>
            <div className="space-y-2">
              {dashboard.speciesStats.map((s: any, i: number) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600 dark:text-neutral-300 italic">{s.scientificName || 'No identificado'}</span>
                  <span className="text-xs text-neutral-400">{s._count?.id || s.count} identificaciones</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
