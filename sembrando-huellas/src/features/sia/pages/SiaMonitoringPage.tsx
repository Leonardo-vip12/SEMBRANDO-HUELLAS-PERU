import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Server, Database, Brain, RefreshCw, AlertCircle, CheckCircle, Cpu, HardDrive, MemoryStick, Plus } from 'lucide-react';
import { cn } from '@/lib/cn';
import StatsCard from '@/features/admin/components/shared/StatsCard';
import { SiaService } from '../services/sia';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const STATUS_ICONS: Record<string, React.ReactNode> = {
  api: <Server size={22} />,
  database: <Database size={22} />,
  redis: <Database size={22} />,
  ai: <Brain size={22} />,
};

const SERVICE_NAMES: Record<string, string> = {
  api: 'API',
  database: 'Base de Datos',
  redis: 'Redis',
  ai: 'Proveedores IA',
};

export default function SiaMonitoringPage() {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [resources, setResources] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [errorPage, setErrorPage] = useState(1);
  const [logService, setLogService] = useState('');
  const [logStatus, setLogStatus] = useState('');
  const [logPage, setLogPage] = useState(1);
  const [showLogForm, setShowLogForm] = useState(false);
  const [logForm, setLogForm] = useState({ service: '', status: 'ok', latency: '0', message: '' });

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [st, svc, sync, err, res] = await Promise.all([
        SiaService.getSystemStatus().catch(() => null),
        SiaService.getActiveServices().catch(() => []),
        SiaService.getSyncStatus().catch(() => null),
        SiaService.getErrors(errorPage).catch(() => ({ data: [] })),
        SiaService.getResourceUsage().catch(() => null),
      ]);
      setStatus(st);
      setServices(Array.isArray(svc) ? svc : svc?.data || []);
      setSyncStatus(sync);
      setErrors(Array.isArray(err) ? err : err?.data || []);
      setResources(res);
    } catch {}
    setLoading(false);
  }

  async function loadLogs() {
    try {
      const res = await SiaService.getMonitoringLogs(logService || undefined, logStatus || undefined, logPage);
      setLogs(Array.isArray(res) ? res : res?.data || []);
    } catch {}
  }

  useEffect(() => { loadLogs(); }, [logService, logStatus, logPage]);

  async function createLog(e: React.FormEvent) {
    e.preventDefault();
    try {
      await SiaService.createMonitoringLog({
        service: logForm.service,
        status: logForm.status,
        latency: parseInt(logForm.latency) || 0,
        message: logForm.message,
      });
      setShowLogForm(false);
      setLogForm({ service: '', status: 'ok', latency: '0', message: '' });
      loadLogs();
    } catch {}
  }

  function StatusBadge({ healthy }: { healthy: boolean }) {
    return (
      <span className={cn(
        'rounded-full px-2 py-0.5 text-xs font-medium',
        healthy ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
      )}>
        {healthy ? 'Operacional' : 'Caído'}
      </span>
    );
  }

  const statusEntries = status ? Object.entries(status).filter(([k]) => typeof k === 'string' && !['id', 'updatedAt'].includes(k)) : [];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-rose-500 text-white">
              <Activity size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Monitoreo del Sistema</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Estado de servicios, errores, recursos y logs del sistema SIA</p>
        </div>
        <button onClick={loadAll} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <motion.div variants={item} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusEntries.map(([key, val]) => (
          <StatsCard
            key={key}
            label={SERVICE_NAMES[key] || key}
            value={val === true || val === 'ok' || val === 'healthy' ? 'Operacional' : 'Caído'}
            icon={STATUS_ICONS[key] || <Activity size={22} />}
            color={val === true || val === 'ok' || val === 'healthy' ? 'text-green-600' : 'text-red-600'}
          />
        ))}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Servicios Activos</h2>
          {services.length > 0 ? (
            <div className="space-y-2">
              {services.map((s: any, i: number) => (
                <div key={s.name || i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <div className="flex items-center gap-3">
                    {s.status === 'active' || s.healthy
                      ? <CheckCircle size={16} className="text-green-500" />
                      : <AlertCircle size={16} className="text-red-500" />}
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{s.name || s.service}</p>
                      <p className="text-xs text-neutral-400">{s.type || s.category} {s.version ? `v${s.version}` : ''}</p>
                    </div>
                  </div>
                  <StatusBadge healthy={s.status === 'active' || s.healthy} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No hay servicios registrados</p>
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Sincronización</h2>
          {syncStatus ? (
            <div className="space-y-3">
              {Object.entries(syncStatus).filter(([k]) => !['id'].includes(k)).map(([key, val]) => (
                <div key={key} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 capitalize">{key.replace(/_/g, ' ')}</p>
                  <span className={cn(
                    'text-sm font-medium',
                    val === true || val === 'synced' || val === 'ok' ? 'text-green-600' : 'text-amber-600',
                  )}>
                    {String(val)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No hay información de sincronización</p>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Errores Recientes</h2>
            <div className="flex items-center gap-2">
              <button onClick={() => setErrorPage(p => Math.max(1, p - 1))} disabled={errorPage <= 1}
                className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-800">Anterior</button>
              <span className="text-xs text-neutral-400">Pág. {errorPage}</span>
              <button onClick={() => setErrorPage(p => p + 1)}
                className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Siguiente</button>
            </div>
          </div>
          {errors.length > 0 ? (
            <div className="space-y-2">
              {errors.map((e: any, i: number) => (
                <div key={e.id || i} className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{e.message || e.error}</p>
                    <AlertCircle size={14} className="text-red-400" />
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    {e.service || e.source} • {e.code || e.statusCode || ''} • {e.timestamp ? new Date(e.timestamp).toLocaleString() : ''}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-neutral-400">No hay errores registrados</p>
          )}
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Uso de Recursos</h2>
          {resources ? (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(resources).filter(([k]) => !['id'].includes(k)).map(([key, val]) => (
                <div key={key} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                    {key === 'cpu' ? <Cpu size={16} className="text-blue-500" />
                      : key === 'memory' || key === 'ram' ? <MemoryStick size={16} className="text-purple-500" />
                      : <HardDrive size={16} className="text-cyan-500" />}
                    <p className="text-xs text-neutral-400 capitalize">{key}</p>
                  </div>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{String(val)}</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div className={cn(
                      'h-full rounded-full',
                      typeof val === 'number' && val > 80 ? 'bg-red-500' : typeof val === 'number' && val > 50 ? 'bg-amber-500' : 'bg-green-500',
                    )}
                      style={{ width: typeof val === 'number' ? `${Math.min(val, 100)}%` : '0%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {['CPU', 'Memoria', 'Almacenamiento', 'Red'].map((name, i) => (
                <div key={name} className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700">
                  <div className="flex items-center gap-2 mb-2">
                    {i === 0 ? <Cpu size={16} className="text-blue-500" />
                      : i === 1 ? <MemoryStick size={16} className="text-purple-500" />
                      : <HardDrive size={16} className="text-cyan-500" />}
                    <p className="text-xs text-neutral-400">{name}</p>
                  </div>
                  <p className="text-xl font-bold text-neutral-900 dark:text-neutral-100">--</p>
                  <div className="mt-2 h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div className="h-full w-0 rounded-full bg-green-500" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Logs de Monitoreo</h2>
          <button onClick={() => setShowLogForm(!showLogForm)}
            className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
            <Plus size={14} /> Nuevo Log
          </button>
        </div>

        {showLogForm && (
          <form onSubmit={createLog} className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900 space-y-4">
            <div className="grid gap-4 sm:grid-cols-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Servicio</label>
                <input type="text" value={logForm.service} onChange={e => setLogForm({ ...logForm, service: e.target.value })} required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Estado</label>
                <select value={logForm.status} onChange={e => setLogForm({ ...logForm, status: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  <option value="ok">OK</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Latencia (ms)</label>
                <input type="number" value={logForm.latency} onChange={e => setLogForm({ ...logForm, latency: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Mensaje</label>
                <input type="text" value={logForm.message} onChange={e => setLogForm({ ...logForm, message: e.target.value })} required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowLogForm(false)}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Cancelar</button>
              <button type="submit" className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700">Crear Log</button>
            </div>
          </form>
        )}

        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Filtrar por servicio</label>
            <select value={logService} onChange={e => setLogService(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
              <option value="">Todos</option>
              {['api', 'database', 'redis', 'ai-worker', 'sync'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Filtrar por estado</label>
            <select value={logStatus} onChange={e => setLogStatus(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
              <option value="">Todos</option>
              <option value="ok">OK</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLogPage(p => Math.max(1, p - 1))} disabled={logPage <= 1}
              className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50 disabled:opacity-30 dark:border-neutral-700 dark:hover:bg-neutral-800">Anterior</button>
            <span className="text-xs text-neutral-400">Pág. {logPage}</span>
            <button onClick={() => setLogPage(p => p + 1)}
              className="rounded border border-neutral-200 px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800">Siguiente</button>
          </div>
        </div>

        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="pb-3 text-left font-medium text-neutral-500">Timestamp</th>
                  <th className="pb-3 text-left font-medium text-neutral-500">Servicio</th>
                  <th className="pb-3 text-left font-medium text-neutral-500">Estado</th>
                  <th className="pb-3 text-right font-medium text-neutral-500">Latencia</th>
                  <th className="pb-3 text-left font-medium text-neutral-500">Mensaje</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log: any, i: number) => (
                  <tr key={log.id || i} className="border-b border-neutral-100 dark:border-neutral-800">
                    <td className="py-3 text-neutral-700 dark:text-neutral-300">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}
                    </td>
                    <td className="py-3 text-neutral-900 dark:text-neutral-100">{log.service || log.serviceName}</td>
                    <td className="py-3">
                      <span className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-medium',
                        log.status === 'ok' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                          : log.status === 'warning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                          : log.status === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400',
                      )}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-neutral-700 dark:text-neutral-300">{log.latency != null ? `${log.latency}ms` : '-'}</td>
                    <td className="py-3 text-neutral-700 dark:text-neutral-300 max-w-xs truncate">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-neutral-400">No hay logs disponibles</p>
        )}
      </motion.div>
    </motion.div>
  );
}
