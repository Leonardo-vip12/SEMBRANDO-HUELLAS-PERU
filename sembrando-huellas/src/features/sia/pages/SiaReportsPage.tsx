import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Trash2, Plus, FileSpreadsheet, File as FileIcon } from 'lucide-react'
import { cn } from '@/lib/cn'
import StatsCard from '@/features/admin/components/shared/StatsCard'
import { SiaService } from '../services/sia'
import { SEO } from '@/components/seo'
import { Container, Section, SectionTitle, PageTransition, Spinner } from '@/components/ui'
import Button from '@/components/buttons/Button'
import Input from '@/components/inputs/Input'
import Textarea from '@/components/inputs/Textarea'

const REPORT_TYPES = ['INSTITUCIONAL', 'CAMPAÑA', 'PROYECTO', 'EDUCATIVO', 'BIODIVERSIDAD']
const FORMATS = ['PDF', 'EXCEL', 'CSV']

const typeColors: Record<string, string> = {
  INSTITUCIONAL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  CAMPAÑA: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  PROYECTO: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  EDUCATIVO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  BIODIVERSIDAD: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
}

const formatIcons: Record<string, React.ReactNode> = {
  PDF: <FileText size={16} />,
  EXCEL: <FileSpreadsheet size={16} />,
  CSV: <FileIcon size={16} />,
}

export default function SiaReportsPage() {
  const [reports, setReports] = useState<any[]>([])
  const [stats, setStats] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [title, setTitle] = useState('')
  const [type, setType] = useState('')
  const [description, setDescription] = useState('')
  const [format, setFormat] = useState('PDF')
  const [submitting, setSubmitting] = useState(false)

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [reportsRes, statsRes] = await Promise.all([
        SiaService.listReports(page, 10),
        SiaService.getReportStats(),
      ])
      setReports(reportsRes.data || reportsRes.reports || [])
      setTotalPages(reportsRes.totalPages || reportsRes.total_pages || 1)
      setStats(statsRes)
    } catch {
      showToast('error', 'Error al cargar reportes')
    } finally {
      setLoading(false)
    }
  }, [page, showToast])

  useEffect(() => { fetchData() }, [fetchData])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !type) return
    setSubmitting(true)
    try {
      await SiaService.generateReport({ title: title.trim(), type, description: description.trim() || undefined, format })
      showToast('success', 'Reporte generado exitosamente')
      setTitle('')
      setType('')
      setDescription('')
      setFormat('PDF')
      setShowForm(false)
      fetchData()
    } catch {
      showToast('error', 'Error al generar reporte')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este reporte?')) return
    try {
      await SiaService.deleteReport(id)
      showToast('success', 'Reporte eliminado')
      fetchData()
    } catch {
      showToast('error', 'Error al eliminar reporte')
    }
  }

  const formatDate = (d: string) => {
    if (!d) return '-'
    return new Date(d).toLocaleDateString('es-PE', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <PageTransition>
      <SEO title="Reportes - SIA" description="Gestión de reportes del SIA" />
      <Section>
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <SectionTitle title="Reportes" subtitle="Genera y administra reportes del sistema" />
            <Button onClick={() => setShowForm(!showForm)} variant="primary" leftIcon={<Plus size={16} />}>
              {showForm ? 'Cancelar' : 'Nuevo Reporte'}
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

          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleGenerate}
              className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Generar Reporte</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Título" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Título del reporte" required />
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Tipo</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} required className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                    <option value="">Seleccionar tipo</option>
                    {REPORT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Textarea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción opcional" rows={3} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Formato</label>
                  <div className="flex gap-2">
                    {FORMATS.map((f) => (
                      <button type="button" key={f} onClick={() => setFormat(f)} className={cn('flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors', format === f ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300' : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400')}>
                        {formatIcons[f]} {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Generando...' : 'Generar Reporte'}</Button>
              </div>
            </motion.form>
          )}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {REPORT_TYPES.map((rt) => (
              <StatsCard key={rt} label={rt.charAt(0) + rt.slice(1).toLowerCase()} value={stats[rt] ?? stats[rt.toLowerCase()] ?? 0} icon={<FileText size={20} />} color="text-primary-600" />
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : reports.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-600">
              <FileText size={40} className="mx-auto mb-3 text-neutral-400" />
              <p className="text-neutral-500">No hay reportes generados aún</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-700">
                <table className="w-full text-left text-sm">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Título</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Tipo</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Formato</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Generado</th>
                      <th className="px-4 py-3 font-semibold text-neutral-600 dark:text-neutral-400">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                    {reports.map((r) => (
                      <tr key={r.id} className="bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{r.title}</td>
                        <td className="px-4 py-3">
                          <span className={cn('inline-block rounded-full px-2.5 py-0.5 text-xs font-medium', typeColors[r.type] || typeColors.INSTITUCIONAL)}>{r.type}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-neutral-600 dark:text-neutral-400">{formatIcons[r.format] || <FileText size={16} />} {r.format}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-500">{formatDate(r.createdAt || r.generatedAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => window.open(r.url || `/sia/reports/${r.id}/download`, '_blank')}><Download size={16} /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(r.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></Button>
                          </div>
                        </td>
                      </tr>
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
