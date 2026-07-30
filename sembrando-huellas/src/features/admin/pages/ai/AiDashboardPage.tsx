import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Brain, Sparkles, Activity, DollarSign, RefreshCw, BarChart3, MessageSquare, Image, FileText, Globe, Shield, Server } from 'lucide-react';
import { AiService } from '@/services/ai';
import StatsCard from '../../components/shared/StatsCard';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AiDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [providers, setProviders] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'logs' | 'providers'>('overview');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [statsData, providersData, configData, logsData] = await Promise.all([
        AiService.getStats(),
        AiService.getProviders(),
        AiService.getAiConfig(),
        AiService.getLogs(1),
      ]);
      setStats(statsData);
      setProviders(Array.isArray(providersData) ? providersData : []);
      setConfig(configData);
      setLogs(logsData?.data || []);
    } catch (err) {
      console.error('Error loading AI data:', err);
    }
    setLoading(false);
  }

  const features = [
    { label: 'Asistente IA', icon: <Bot size={22} />, desc: 'Asesor especializado en medio ambiente', color: 'text-emerald-500' },
    { label: 'Identificador', icon: <Image size={22} />, desc: 'Reconocimiento de especies por imagen', color: 'text-blue-500' },
    { label: 'Generador Contenido', icon: <FileText size={22} />, desc: 'Creación de material educativo', color: 'text-purple-500' },
    { label: 'Generador Noticias', icon: <MessageSquare size={22} />, desc: 'Borradores y resúmenes editoriales', color: 'text-amber-500' },
    { label: 'Búsqueda Semántica', icon: <Brain size={22} />, desc: 'Búsqueda inteligente con IA', color: 'text-cyan-500' },
    { label: 'Traductor', icon: <Globe size={22} />, desc: 'Traducción a múltiples idiomas', color: 'text-pink-500' },
    { label: 'Recomendador', icon: <Sparkles size={22} />, desc: 'Recomendaciones personalizadas', color: 'text-indigo-500' },
    { label: 'Análisis Impacto', icon: <BarChart3 size={22} />, desc: 'Informes automáticos de impacto', color: 'text-green-500' },
    { label: 'Certificados', icon: <Shield size={22} />, desc: 'Generación con QR', color: 'text-red-500' },
    { label: 'Resumidor', icon: <Activity size={22} />, desc: 'Resúmenes automáticos de textos', color: 'text-orange-500' },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 text-white">
              <Bot size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Panel de IA</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Monitoreo y administración de los sistemas de inteligencia artificial</p>
        </div>
        <button onClick={loadData} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Actualizar
        </button>
      </div>

      {stats && (
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard label="Consultas Totales" value={(stats.totalQueries || 0).toLocaleString()} icon={<MessageSquare size={22} />} color="text-blue-600" />
          <StatsCard label="Tokens Consumidos" value={(stats.totalTokens || 0).toLocaleString()} icon={<Brain size={22} />} color="text-purple-600" />
          <StatsCard label="Costo Total" value={`$${(stats.totalCost || 0).toFixed(4)}`} icon={<DollarSign size={22} />} color="text-green-600" />
          <StatsCard label="Latencia Promedio" value={`${(stats.averageLatency || 0).toFixed(0)}ms`} icon={<Activity size={22} />} color="text-amber-600" />
        </motion.div>
      )}

      <div className="flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        {(['overview', 'logs', 'providers'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-b-2 border-primary-500 text-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'overview' ? 'Resumen' : t === 'logs' ? 'Consultas' : 'Proveedores'}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {features.map(f => (
              <div key={f.label} className="rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
                <div className={`mb-2 ${f.color}`}>{f.icon}</div>
                <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{f.label}</h3>
                <p className="mt-1 text-xs text-neutral-400">{f.desc}</p>
              </div>
            ))}
          </motion.div>

          {config && (
            <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
              <h3 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Configuración Actual</h3>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                  <p className="text-xs text-neutral-400">Proveedor Activo</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100 capitalize">{config.activeProvider || 'No configurado'}</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                  <p className="text-xs text-neutral-400">Temperatura</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{config.defaultTemperature || 0.7}</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                  <p className="text-xs text-neutral-400">Máx. Tokens</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{config.maxTokens || 4096}</p>
                </div>
                <div className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                  <p className="text-xs text-neutral-400">Límite Costo</p>
                  <p className="mt-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">${config.costLimit || 50}/día</p>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}

      {tab === 'logs' && (
        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200 dark:border-neutral-700">
                <tr className="text-left text-xs text-neutral-400">
                  <th className="px-4 py-3">Feature</th>
                  <th className="px-4 py-3">Proveedor</th>
                  <th className="px-4 py-3">Tokens</th>
                  <th className="px-4 py-3">Costo</th>
                  <th className="px-4 py-3">Latencia</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any) => (
                  <tr key={log.id} className="border-b border-neutral-100 text-neutral-700 last:border-0 dark:border-neutral-700 dark:text-neutral-300">
                    <td className="px-4 py-3 font-medium">{log.feature}</td>
                    <td className="px-4 py-3 capitalize">{log.provider}</td>
                    <td className="px-4 py-3">{log.tokensUsed}</td>
                    <td className="px-4 py-3">${(log.cost || 0).toFixed(6)}</td>
                    <td className="px-4 py-3">{log.latencyMs}ms</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${log.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {log.success ? 'Éxito' : 'Error'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-400">{new Date(log.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">No hay consultas registradas</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {tab === 'providers' && (
        <motion.div variants={item} className="grid gap-4 sm:grid-cols-2">
          {providers.map((p: any) => (
            <div key={p.type} className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Server size={20} className="text-neutral-400" />
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">{p.type}</h3>
                    <p className="text-xs text-neutral-400">{p.model}</p>
                  </div>
                </div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {p.available ? 'Disponible' : 'No configurado'}
                </span>
              </div>
            </div>
          ))}
          {providers.length === 0 && (
            <div className="col-span-2 rounded-xl border border-neutral-200 bg-white p-8 text-center text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
              No hay proveedores disponibles
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
