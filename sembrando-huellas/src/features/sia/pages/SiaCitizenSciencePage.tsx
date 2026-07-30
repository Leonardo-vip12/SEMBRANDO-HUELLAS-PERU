import { useState, useEffect, useCallback, Fragment } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle, RotateCcw, UserPlus, ChevronDown, ChevronUp, Image as ImageIcon, MapPin, Clock, Users } from 'lucide-react'
import { cn } from '@/lib/cn'
import StatsCard from '@/features/admin/components/shared/StatsCard'
import { SiaService } from '../services/sia'
import { SEO } from '@/components/seo'
import { Container, Section, SectionTitle, PageTransition, Spinner } from '@/components/ui'
import Button from '@/components/buttons/Button'
import Input from '@/components/inputs/Input'

const STATUSES = ['PENDING', 'VALIDATED', 'APPROVED', 'REJECTED', 'NEEDS_CORRECTION']
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  VALIDATED: 'Validado',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  NEEDS_CORRECTION: 'Corrección',
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  VALIDATED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  APPROVED: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  REJECTED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  NEEDS_CORRECTION: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
}

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock size={14} />,
  VALIDATED: <CheckCircle size={14} />,
  APPROVED: <CheckCircle size={14} />,
  REJECTED: <XCircle size={14} />,
  NEEDS_CORRECTION: <AlertTriangle size={14} />,
}

export default function SiaCitizenSciencePage() {
  const [observations, setObservations] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedData, setExpandedData] = useState<any>(null)
  const [reviewHistory, setReviewHistory] = useState<any[]>([])
  const [assignUserId, setAssignUserId] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [obsRes, statsRes] = await Promise.all([
        SiaService.listCitizenObservations({ page, limit: 10, status: statusFilter || undefined }),
        SiaService.getCitizenScienceStats(),
      ])
      setObservations(obsRes.data || obsRes.observations || [])
      setTotalPages(obsRes.totalPages || obsRes.total_pages || 1)
      setStats(statsRes)
    } catch {
      showToast('error', 'Error al cargar observaciones')
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, showToast])

  useEffect(() => { fetchData() }, [fetchData])

  const toggleExpand = async (obs: any) => {
    if (expandedId === obs.id) {
      setExpandedId(null)
      setExpandedData(null)
      setReviewHistory([])
      return
    }
    setExpandedId(obs.id)
    try {
      const [detailRes, historyRes] = await Promise.all([
        SiaService.getCitizenObservation(obs.id),
        SiaService.getReviewHistory(obs.id),
      ])
      setExpandedData(detailRes.data || detailRes)
      setReviewHistory(historyRes.data || historyRes.history || [])
    } catch {
      setExpandedData(obs)
      setReviewHistory([])
    }
  }

  const handleReview = async (id: string, status: string) => {
    try {
      await SiaService.reviewObservation(id, { status })
      showToast('success', `Observación ${STATUS_LABELS[status].toLowerCase()}`)
      fetchData()
      if (expandedId === id) {
        const detail = await SiaService.getCitizenObservation(id)
        setExpandedData(detail.data || detail)
        const history = await SiaService.getReviewHistory(id)
        setReviewHistory(history.data || history.history || [])
      }
    } catch {
      showToast('error', 'Error al revisar observación')
    }
  }

  const handleAssign = async (id: string) => {
    if (!assignUserId.trim()) return
    try {
      await SiaService.assignObservation(id, assignUserId.trim())
      showToast('success', 'Observación asignada')
      setAssignUserId('')
    } catch {
      showToast('error', 'Error al asignar observación')
    }
  }

  const formatDate = (d: string) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <PageTransition>
      <SEO title="Ciencia Ciudadana - SIA" description="Gestión de observaciones de ciencia ciudadana" />
      <Section>
        <Container>
          <SectionTitle title="Ciencia Ciudadana" subtitle="Gestiona las observaciones reportadas por la comunidad" />

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

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: 'Pendientes', value: stats.pending ?? stats.PENDING ?? 0, icon: <Clock size={20} />, color: 'text-amber-600' },
              { label: 'Validadas', value: stats.validated ?? stats.VALIDATED ?? 0, icon: <CheckCircle size={20} />, color: 'text-blue-600' },
              { label: 'Aprobadas', value: stats.approved ?? stats.APPROVED ?? 0, icon: <CheckCircle size={20} />, color: 'text-green-600' },
              { label: 'Rechazadas', value: stats.rejected ?? stats.REJECTED ?? 0, icon: <XCircle size={20} />, color: 'text-red-600' },
            ].map((s) => (
              <StatsCard key={s.label} label={s.label} value={s.value} icon={s.icon} color={s.color} />
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Filtrar:</span>
            <button onClick={() => { setStatusFilter(''); setPage(1) }} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition-colors', !statusFilter ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300')}>Todas</button>
            {STATUSES.map((s) => (
              <button key={s} onClick={() => { setStatusFilter(s); setPage(1) }} className={cn('inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors', statusFilter === s ? 'bg-primary-600 text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-300')}>
                {statusIcons[s]} {STATUS_LABELS[s]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : observations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-600">
              <Users size={40} className="mx-auto mb-3 text-neutral-400" />
              <p className="text-neutral-500">No hay observaciones registradas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Especie</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Nombre Científico</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Cantidad</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Estado</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Observador</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Fecha</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {observations.map((obs) => (
                      <Fragment key={obs.id}>
                        <tr className={cn('bg-white transition-colors dark:bg-neutral-900', expandedId === obs.id ? 'bg-primary-50/50 dark:bg-primary-900/10' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800')}>
                          <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{obs.species || obs.commonName || '-'}</td>
                          <td className="px-4 py-3 italic text-neutral-600 dark:text-neutral-400">{obs.scientificName || '-'}</td>
                          <td className="px-4 py-3 text-neutral-700 dark:text-neutral-300">{obs.quantity ?? obs.count ?? '-'}</td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium', statusColors[obs.status] || statusColors.PENDING)}>
                              {statusIcons[obs.status]} {STATUS_LABELS[obs.status] || obs.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-neutral-600 dark:text-neutral-400">{obs.observer || obs.observedBy || '-'}</td>
                          <td className="px-4 py-3 text-neutral-500">{formatDate(obs.observedAt || obs.date || obs.createdAt)}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" onClick={() => toggleExpand(obs)}>
                              {expandedId === obs.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </Button>
                          </td>
                        </tr>
                        {expandedId === obs.id && expandedData && (
                          <tr>
                            <td colSpan={7} className="bg-neutral-50 px-6 py-4 dark:bg-neutral-800/50">
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="grid gap-6 sm:grid-cols-2">
                                  <div>
                                    <h4 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Detalles</h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      {[
                                        { label: 'Especie', value: expandedData.species || expandedData.commonName },
                                        { label: 'Nombre Científico', value: expandedData.scientificName },
                                        { label: 'Cantidad', value: expandedData.quantity ?? expandedData.count },
                                        { label: 'Descripción', value: expandedData.description },
                                        { label: 'Hábitat', value: expandedData.habitat },
                                        { label: 'Comportamiento', value: expandedData.behavior },
                                        { label: 'Estado', value: STATUS_LABELS[expandedData.status] || expandedData.status },
                                        { label: 'Observador', value: expandedData.observer || expandedData.observedBy },
                                        { label: 'Email', value: expandedData.observerEmail },
                                        { label: 'Teléfono', value: expandedData.observerPhone },
                                      ].filter((f) => f.value).map((f) => (
                                        <div key={f.label}>
                                          <p className="text-xs text-neutral-500">{f.label}</p>
                                          <p className="text-neutral-900 dark:text-neutral-100">{f.value}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    {(expandedData.images && expandedData.images.length > 0) && (
                                      <div className="mb-4">
                                        <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"><ImageIcon size={14} /> Imágenes</h4>
                                        <div className="flex flex-wrap gap-2">
                                          {expandedData.images.map((img: string, i: number) => (
                                            <img key={i} src={img} alt={`Imagen ${i + 1}`} className="h-20 w-20 rounded-lg object-cover" />
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                    {(expandedData.latitude && expandedData.longitude) && (
                                      <div className="mb-4">
                                        <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"><MapPin size={14} /> Ubicación</h4>
                                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                          {expandedData.latitude}, {expandedData.longitude}
                                        </p>
                                        {(expandedData.region || expandedData.location) && (
                                          <p className="text-sm text-neutral-500">{expandedData.region || expandedData.location}</p>
                                        )}
                                      </div>
                                    )}
                                    {reviewHistory.length > 0 && (
                                      <div className="mb-4">
                                        <h4 className="mb-2 flex items-center gap-1 text-sm font-semibold text-neutral-700 dark:text-neutral-300"><RotateCcw size={14} /> Historial de Revisión</h4>
                                        <div className="space-y-2">
                                          {reviewHistory.map((h: any, i: number) => (
                                            <div key={i} className="rounded-lg border border-neutral-200 bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-800">
                                              <div className="flex items-center gap-2">
                                                <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium', statusColors[h.status] || statusColors.PENDING)}>
                                                  {statusIcons[h.status]} {STATUS_LABELS[h.status] || h.status}
                                                </span>
                                                <span className="text-xs text-neutral-400">{formatDate(h.createdAt || h.date)}</span>
                                              </div>
                                              {h.comments && <p className="mt-1 text-neutral-600 dark:text-neutral-400">{h.comments}</p>}
                                              {h.reviewedBy && <p className="mt-0.5 text-xs text-neutral-400">Por: {h.reviewedBy}</p>}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Acciones:</span>
                                  <Button variant="primary" size="sm" onClick={() => handleReview(obs.id, 'VALIDATED')} leftIcon={<CheckCircle size={14} />}>Validar</Button>
                                  <Button variant="primary" size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleReview(obs.id, 'APPROVED')} leftIcon={<CheckCircle size={14} />}>Aprobar</Button>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleReview(obs.id, 'REJECTED')} leftIcon={<XCircle size={14} />}>Rechazar</Button>
                                  <Button variant="ghost" size="sm" className="text-purple-600 hover:text-purple-800" onClick={() => handleReview(obs.id, 'NEEDS_CORRECTION')} leftIcon={<AlertTriangle size={14} />}>Corrección</Button>
                                  <div className="ml-auto flex items-center gap-2">
                                    <Input placeholder="ID de usuario" value={assignUserId} onChange={(e) => setAssignUserId(e.target.value)} className="w-40" />
                                    <Button variant="ghost" size="sm" onClick={() => handleAssign(obs.id)} leftIcon={<UserPlus size={14} />}>Asignar</Button>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Anterior</Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)} className={cn('flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-primary-600 text-white' : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700')}>{p}</button>
                  ))}
                  <Button variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Siguiente</Button>
                </div>
              )}
            </>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
