import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Bell, BellOff, Plus, Trash2, CheckCheck, RefreshCw, AlertCircle, Info, AlertOctagon, Activity } from 'lucide-react'
import { cn } from '@/lib/cn'
import StatsCard from '@/features/admin/components/shared/StatsCard'
import { SiaService } from '../services/sia'
import { SEO } from '@/components/seo'
import { Container, Section, SectionTitle, PageTransition, Spinner } from '@/components/ui'
import Button from '@/components/buttons/Button'
import Input from '@/components/inputs/Input'
import Textarea from '@/components/inputs/Textarea'

const CONDITIONS = ['GT', 'LT', 'GTE', 'LTE', 'EQ']
const CONDITION_LABELS: Record<string, string> = {
  GT: 'Mayor que',
  LT: 'Menor que',
  GTE: 'Mayor o igual',
  LTE: 'Menor o igual',
  EQ: 'Igual a',
}

const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const SEVERITY_COLORS: Record<string, string> = {
  LOW: 'bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-300',
  MEDIUM: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300',
  HIGH: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300',
  CRITICAL: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-300',
}

const SEVERITY_ICONS: Record<string, React.ReactNode> = {
  LOW: <Info size={14} />,
  MEDIUM: <AlertCircle size={14} />,
  HIGH: <AlertTriangle size={14} />,
  CRITICAL: <AlertOctagon size={14} />,
}

const CHANNELS = ['EMAIL', 'SMS', 'PUSH', 'DASHBOARD']

export default function SiaAlertsPage() {
  const [tab, setTab] = useState<'rules' | 'logs'>('rules')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [rules, setRules] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [logPage, setLogPage] = useState(1)
  const [logTotalPages, setLogTotalPages] = useState(1)
  const [severityFilter, setSeverityFilter] = useState('')
  const [logsLoading, setLogsLoading] = useState(false)

  const [stats, setStats] = useState<any>({})
  const [indicators, setIndicators] = useState<any[]>([])

  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [condition, setCondition] = useState('GT')
  const [threshold, setThreshold] = useState('')
  const [severity, setSeverity] = useState('MEDIUM')
  const [channel, setChannel] = useState('EMAIL')
  const [indicatorId, setIndicatorId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [checking, setChecking] = useState(false)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchRules = useCallback(async () => {
    try {
      const [rulesRes, statsRes, indRes] = await Promise.all([
        SiaService.listAlertRules(),
        SiaService.getAlertStats(),
        SiaService.listIndicators(),
      ])
      setRules(rulesRes.data || rulesRes.rules || [])
      setStats(statsRes)
      setIndicators(indRes.data || indRes.indicators || [])
    } catch {
      showToast('error', 'Error al cargar reglas')
    }
  }, [showToast])

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true)
    try {
      const res = await SiaService.getAlertLogs({
        severity: severityFilter || undefined,
        page: logPage,
        limit: 10,
      })
      setLogs(res.data || res.logs || [])
      setLogTotalPages(res.totalPages || res.total_pages || 1)
    } catch {
      showToast('error', 'Error al cargar registros')
    } finally {
      setLogsLoading(false)
    }
  }, [severityFilter, logPage, showToast])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [rulesRes, statsRes, indRes] = await Promise.all([
        SiaService.listAlertRules(),
        SiaService.getAlertStats(),
        SiaService.listIndicators(),
      ])
      setRules(rulesRes.data || rulesRes.rules || [])
      setStats(statsRes)
      setIndicators(indRes.data || indRes.indicators || [])
    } catch {
      showToast('error', 'Error al cargar datos')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchData() }, [fetchData])
  useEffect(() => { if (tab === 'logs') fetchLogs() }, [tab, fetchLogs])

  const resetForm = () => {
    setName('')
    setDesc('')
    setCondition('GT')
    setThreshold('')
    setSeverity('MEDIUM')
    setChannel('EMAIL')
    setIndicatorId('')
    setEditing(null)
  }

  const openEdit = (rule: any) => {
    setName(rule.name || '')
    setDesc(rule.description || '')
    setCondition(rule.condition || 'GT')
    setThreshold(rule.threshold?.toString() || '')
    setSeverity(rule.severity || 'MEDIUM')
    setChannel(rule.channel || 'EMAIL')
    setIndicatorId(rule.indicatorId || rule.indicator_id || '')
    setEditing(rule)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !threshold) return
    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        description: desc.trim() || undefined,
        condition,
        threshold: Number(threshold),
        severity,
        channel,
        indicatorId: indicatorId || undefined,
      }
      if (editing) {
        await SiaService.updateAlertRule(editing.id, payload)
        showToast('success', 'Regla actualizada')
      } else {
        await SiaService.createAlertRule(payload)
        showToast('success', 'Regla creada')
      }
      resetForm()
      setShowForm(false)
      fetchRules()
    } catch {
      showToast('error', `Error al ${editing ? 'actualizar' : 'crear'} regla`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta regla?')) return
    try {
      await SiaService.deleteAlertRule(id)
      showToast('success', 'Regla eliminada')
      fetchRules()
    } catch {
      showToast('error', 'Error al eliminar regla')
    }
  }

  const handleToggleStatus = async (rule: any) => {
    const newStatus = rule.status === 'ACTIVE' ? 'PAUSED' : 'ACTIVE'
    try {
      await SiaService.updateAlertRule(rule.id, { status: newStatus })
      showToast('success', `Regla ${newStatus === 'ACTIVE' ? 'activada' : 'pausada'}`)
      fetchRules()
    } catch {
      showToast('error', 'Error al cambiar estado')
    }
  }

  const handleCheckThresholds = async () => {
    setChecking(true)
    try {
      await SiaService.checkAlertThresholds()
      showToast('success', 'Umbrales verificados')
    } catch {
      showToast('error', 'Error al verificar umbrales')
    } finally {
      setChecking(false)
    }
  }

  const handleMarkRead = async (id: string) => {
    try {
      await SiaService.markAlertRead(id)
      fetchLogs()
    } catch {
      showToast('error', 'Error al marcar como leído')
    }
  }

  const formatDate = (d: string) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <PageTransition>
      <SEO title="Alertas - SIA" description="Gestión de alertas y umbrales del SIA" />
      <Section>
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <SectionTitle title="Alertas" subtitle="Configura reglas y monitorea alertas del sistema" />
            <Button variant="secondary" onClick={handleCheckThresholds} disabled={checking} leftIcon={<RefreshCw size={16} className={cn(checking && 'animate-spin')} />}>
              {checking ? 'Verificando...' : 'Verificar Umbrales'}
            </Button>
          </div>

          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'mb-4 rounded-lg px-4 py-3 text-sm font-medium',
                toast.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
              )}
            >
              {toast.message}
            </motion.div>
          )}

          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <StatsCard label="Total Reglas" value={stats.total ?? stats.totalRules ?? rules.length} icon={<Activity size={20} />} color="text-primary-600" />
            <StatsCard label="Activas" value={stats.active ?? stats.ACTIVE ?? rules.filter((r) => r.status === 'ACTIVE').length} icon={<Bell size={20} />} color="text-green-600" />
            <StatsCard label="Disparadas" value={stats.triggered ?? stats.TRIGGERED ?? 0} icon={<AlertTriangle size={20} />} color="text-orange-600" />
            <StatsCard label="Pausadas" value={stats.paused ?? stats.PAUSED ?? rules.filter((r) => r.status === 'PAUSED').length} icon={<BellOff size={20} />} color="text-neutral-600" />
          </div>

          <div className="mb-6 flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            {(['rules', 'logs'] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)} className={cn('flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors', tab === t ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-700 dark:text-neutral-100' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400')}>
                {t === 'rules' ? 'Reglas' : 'Registros'}
              </button>
            ))}
          </div>

          {tab === 'rules' && (
            <>
              <div className="mb-4 flex justify-end">
                <Button onClick={() => { resetForm(); setShowForm(!showForm) }} variant="primary" leftIcon={<Plus size={16} />}>
                  {showForm ? 'Cancelar' : 'Nueva Regla'}
                </Button>
              </div>

              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  onSubmit={handleSubmit}
                  className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {editing ? 'Editar Regla' : 'Nueva Regla de Alerta'}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre de la regla" required />
                    <div className="sm:col-span-2 lg:col-span-3">
                      <Textarea label="Descripción" value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Descripción opcional" rows={2} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Condición</label>
                      <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                        {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]} ({c})</option>)}
                      </select>
                    </div>
                    <Input label="Umbral" type="number" step="any" value={threshold} onChange={(e) => setThreshold(e.target.value)} placeholder="0" required />
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Severidad</label>
                      <select value={severity} onChange={(e) => setSeverity(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                        {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Canal</label>
                      <select value={channel} onChange={(e) => setChannel(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                        {CHANNELS.map((ch) => <option key={ch} value={ch}>{ch}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Indicador</label>
                      <select value={indicatorId} onChange={(e) => setIndicatorId(e.target.value)} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                        <option value="">Sin indicador</option>
                        {indicators.map((ind) => <option key={ind.id} value={ind.id}>{ind.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={() => { resetForm(); setShowForm(false) }}>Cancelar</Button>
                    <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Regla'}</Button>
                  </div>
                </motion.form>
              )}

              {loading ? (
                <div className="flex justify-center py-16"><Spinner /></div>
              ) : rules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-600">
                  <Bell size={40} className="mx-auto mb-3 text-neutral-400" />
                  <p className="text-neutral-500">No hay reglas configuradas</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {rules.map((rule) => (
                    <motion.div
                      key={rule.id}
                      whileHover={{ y: -1 }}
                      className="rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-700 dark:bg-neutral-800"
                    >
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{rule.name}</h3>
                          {rule.description && <p className="mt-0.5 text-sm text-neutral-500">{rule.description}</p>}
                        </div>
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', rule.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300')}>
                          {rule.status === 'ACTIVE' ? <Bell size={12} /> : <BellOff size={12} />}
                          {rule.status === 'ACTIVE' ? 'Activa' : 'Pausada'}
                        </span>
                      </div>
                      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                        <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', SEVERITY_COLORS[rule.severity] || SEVERITY_COLORS.MEDIUM)}>
                          {SEVERITY_ICONS[rule.severity]} {rule.severity}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300">
                          {CONDITION_LABELS[rule.condition] || rule.condition} {rule.threshold}
                        </span>
                        <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-700">{rule.channel}</span>
                      </div>
                      {rule.indicator && <p className="mb-3 text-xs text-neutral-400">Indicador: {rule.indicator.name || rule.indicator}</p>}
                      <div className="flex items-center gap-2 border-t border-neutral-100 pt-3 dark:border-neutral-700">
                        <Button variant="ghost" size="sm" onClick={() => handleToggleStatus(rule)}>
                          {rule.status === 'ACTIVE' ? <BellOff size={14} /> : <Bell size={14} />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => openEdit(rule)}><Plus size={14} /></Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(rule.id)}><Trash2 size={14} /></Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {tab === 'logs' && (
            <>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Severidad:</span>
                <button onClick={() => { setSeverityFilter(''); setLogPage(1) }} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-colors', !severityFilter ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300')}>Todas</button>
                {SEVERITIES.map((s) => (
                  <button key={s} onClick={() => { setSeverityFilter(s); setLogPage(1) }} className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors', severityFilter === s ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300')}>
                    {SEVERITY_ICONS[s]} {s}
                  </button>
                ))}
              </div>

              {logsLoading ? (
                <div className="flex justify-center py-16"><Spinner /></div>
              ) : logs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-600">
                  <AlertTriangle size={40} className="mx-auto mb-3 text-neutral-400" />
                  <p className="text-neutral-500">No hay registros de alertas</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-neutral-50 dark:bg-neutral-800">
                        <tr>
                          <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Severidad</th>
                          <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Mensaje</th>
                          <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Fecha</th>
                          <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Estado</th>
                          <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                        {logs.map((log: any) => (
                          <tr key={log.id} className={cn('bg-white transition-colors dark:bg-neutral-900', !log.read && 'bg-primary-50/30 dark:bg-primary-900/5')}>
                            <td className="px-4 py-3">
                              <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', SEVERITY_COLORS[log.severity] || SEVERITY_COLORS.MEDIUM)}>
                                {SEVERITY_ICONS[log.severity]} {log.severity}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">{log.message || log.description}</td>
                            <td className="px-4 py-3 text-neutral-500">{formatDate(log.createdAt || log.date)}</td>
                            <td className="px-4 py-3">
                              {log.read ? (
                                <span className="text-xs text-neutral-400">Leído</span>
                              ) : (
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">No leído</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {!log.read && (
                                <Button variant="ghost" size="sm" onClick={() => handleMarkRead(log.id)}><CheckCheck size={14} /></Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {logTotalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" disabled={logPage <= 1} onClick={() => setLogPage((p) => Math.max(1, p - 1))}>Anterior</Button>
                      {Array.from({ length: logTotalPages }, (_, i) => i + 1).map((p) => (
                        <button key={p} onClick={() => setLogPage(p)} className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors', p === logPage ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700')}>{p}</button>
                      ))}
                      <Button variant="ghost" size="sm" disabled={logPage >= logTotalPages} onClick={() => setLogPage((p) => Math.min(logTotalPages, p + 1))}>Siguiente</Button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
