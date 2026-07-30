import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Plus, Target, TrendingUp, Edit3, Trash2, X, Gauge } from 'lucide-react'
import { cn } from '@/lib/cn'
import StatsCard from '@/features/admin/components/shared/StatsCard'
import { SiaService } from '../services/sia'
import { SEO } from '@/components/seo'
import { Container, Section, SectionTitle, PageTransition, Spinner } from '@/components/ui'
import Button from '@/components/buttons/Button'
import Input from '@/components/inputs/Input'
import Textarea from '@/components/inputs/Textarea'

export default function SiaIndicatorsPage() {
  const [indicators, setIndicators] = useState<any[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [summary, setSummary] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [records, setRecords] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [unit, setUnit] = useState('')
  const [formula, setFormula] = useState('')
  const [source, setSource] = useState('')
  const [target, setTarget] = useState('')
  const [current, setCurrent] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [region, setRegion] = useState('')
  const [institution, setInstitution] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [recValue, setRecValue] = useState('')
  const [recDate, setRecDate] = useState(new Date().toISOString().slice(0, 10))
  const [recRegion, setRecRegion] = useState('')
  const [recInstitution, setRecInstitution] = useState('')

  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [indRes, catRes, sumRes] = await Promise.all([
        SiaService.listIndicators(),
        SiaService.getIndicatorCategories(),
        SiaService.getIndicatorSummary(),
      ])
      setIndicators(indRes.data || indRes.indicators || [])
      setCategories(catRes.data || catRes.categories || [])
      setSummary(sumRes.data || sumRes.summary || [])
    } catch {
      showToast('error', 'Error al cargar indicadores')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => { fetchData() }, [fetchData])

  const resetForm = () => {
    setName('')
    setSlug('')
    setDescription('')
    setCategory('')
    setUnit('')
    setFormula('')
    setSource('')
    setTarget('')
    setCurrent('')
    setYear(new Date().getFullYear().toString())
    setRegion('')
    setInstitution('')
    setEditing(null)
  }

  const openEdit = (ind: any) => {
    setName(ind.name || '')
    setSlug(ind.slug || '')
    setDescription(ind.description || '')
    setCategory(ind.category || '')
    setUnit(ind.unit || '')
    setFormula(ind.formula || '')
    setSource(ind.source || '')
    setTarget(ind.target?.toString() || '')
    setCurrent(ind.current?.toString() || '')
    setYear(ind.year?.toString() || new Date().getFullYear().toString())
    setRegion(ind.region || '')
    setInstitution(ind.institution || '')
    setEditing(ind)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !category) return
    setSubmitting(true)
    try {
      const payload = {
        name: name.trim(),
        slug: slug.trim() || name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: description.trim() || undefined,
        category,
        unit: unit.trim() || undefined,
        formula: formula.trim() || undefined,
        source: source.trim() || undefined,
        target: target ? Number(target) : undefined,
        current: current ? Number(current) : undefined,
        year: year ? Number(year) : undefined,
        region: region.trim() || undefined,
        institution: institution.trim() || undefined,
      }
      if (editing) {
        await SiaService.updateIndicator(editing.id, payload)
        showToast('success', 'Indicador actualizado')
      } else {
        await SiaService.createIndicator(payload)
        showToast('success', 'Indicador creado')
      }
      resetForm()
      setShowForm(false)
      fetchData()
    } catch {
      showToast('error', `Error al ${editing ? 'actualizar' : 'crear'} indicador`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este indicador? Esta acción no se puede deshacer.')) return
    try {
      await SiaService.deleteIndicator(id)
      showToast('success', 'Indicador eliminado')
      if (selected?.id === id) { setSelected(null); setRecords([]) }
      fetchData()
    } catch {
      showToast('error', 'Error al eliminar indicador')
    }
  }

  const selectIndicator = async (ind: any) => {
    setSelected(ind)
    try {
      const res = await SiaService.getIndicatorRecords(ind.id)
      setRecords(res.data || res.records || [])
    } catch {
      setRecords([])
    }
  }

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!recValue || !recDate) return
    try {
      await SiaService.addIndicatorRecord(selected!.id, {
        value: Number(recValue),
        date: recDate,
        region: recRegion.trim() || undefined,
        institution: recInstitution.trim() || undefined,
      })
      showToast('success', 'Registro agregado')
      setRecValue('')
      setRecDate(new Date().toISOString().slice(0, 10))
      setRecRegion('')
      setRecInstitution('')
      const res = await SiaService.getIndicatorRecords(selected!.id)
      setRecords(res.data || res.records || [])
    } catch {
      showToast('error', 'Error al agregar registro')
    }
  }

  const progressPercent = (ind: any) => {
    if (!ind.target || !ind.current) return 0
    return Math.min(100, Math.round((Number(ind.current) / Number(ind.target)) * 100))
  }

  const catColors: Record<string, string> = {
    AMBIENTAL: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    SOCIAL: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    ECONOMICO: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    INSTITUCIONAL: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    EDUCATIVO: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  }

  return (
    <PageTransition>
      <SEO title="Indicadores - SIA" description="Gestión de indicadores del SIA" />
      <Section>
        <Container>
          <div className="mb-6 flex items-center justify-between">
            <SectionTitle title="Indicadores" subtitle="Monitorea y administra los indicadores del sistema" />
            <Button onClick={() => { resetForm(); setShowForm(!showForm) }} variant="primary" leftIcon={<Plus size={16} />}>
              {showForm ? 'Cancelar' : 'Nuevo Indicador'}
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
              onSubmit={handleSubmit}
              className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {editing ? 'Editar Indicador' : 'Nuevo Indicador'}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Input label="Nombre" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nombre del indicador" required />
                <Input label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="identificador-unico" />
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Categoría</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-100">
                    <option value="">Seleccionar categoría</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Unidad" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="ej. %, ha, kg" />
                <Input label="Fórmula" value={formula} onChange={(e) => setFormula(e.target.value)} placeholder="ej. (valor/target)*100" />
                <Input label="Fuente" value={source} onChange={(e) => setSource(e.target.value)} placeholder="Fuente de datos" />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Textarea label="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descripción del indicador" rows={2} />
                </div>
                <Input label="Valor Actual" type="number" value={current} onChange={(e) => setCurrent(e.target.value)} placeholder="0" />
                <Input label="Valor Meta" type="number" value={target} onChange={(e) => setTarget(e.target.value)} placeholder="0" />
                <Input label="Año" type="number" value={year} onChange={(e) => setYear(e.target.value)} />
                <Input label="Región" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="Región" />
                <Input label="Institución" value={institution} onChange={(e) => setInstitution(e.target.value)} placeholder="Institución responsable" />
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => { resetForm(); setShowForm(false) }}>Cancelar</Button>
                <Button type="submit" variant="primary" disabled={submitting}>{submitting ? 'Guardando...' : editing ? 'Actualizar' : 'Crear Indicador'}</Button>
              </div>
            </motion.form>
          )}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {summary.length > 0 ? summary.slice(0, 4).map((s: any, i: number) => (
              <StatsCard key={i} label={s.name || s.category || `Indicador ${i + 1}`} value={s.value ?? s.current ?? s.count ?? 0} icon={<Gauge size={20} />} color="text-primary-600" />
            )) : (
              <StatsCard label="Total Indicadores" value={indicators.length} icon={<BarChart3 size={20} />} color="text-primary-600" />
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : indicators.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 py-16 text-center dark:border-neutral-600">
              <BarChart3 size={40} className="mx-auto mb-3 text-neutral-400" />
              <p className="text-neutral-500">No hay indicadores registrados</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {indicators.map((ind) => (
                <motion.div
                  key={ind.id}
                  whileHover={{ y: -2 }}
                  onClick={() => selectIndicator(ind)}
                  className={cn(
                    'cursor-pointer rounded-xl border p-5 transition-shadow hover:shadow-md',
                    selected?.id === ind.id
                      ? 'border-primary-300 bg-primary-50/50 dark:border-primary-700 dark:bg-primary-900/10'
                      : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800',
                  )}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{ind.name}</h3>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', catColors[ind.category] || 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300')}>
                      {ind.category}
                    </span>
                  </div>
                  <div className="mb-3 flex items-center gap-4 text-sm text-neutral-600 dark:text-neutral-400">
                    <span className="inline-flex items-center gap-1"><Target size={14} /> Meta: {ind.target ?? '-'}</span>
                    <span className="inline-flex items-center gap-1"><TrendingUp size={14} /> Actual: {ind.current ?? '-'}</span>
                    {ind.unit && <span className="text-xs text-neutral-400">({ind.unit})</span>}
                  </div>
                  <div className="relative h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        progressPercent(ind) >= 80 ? 'bg-green-500' : progressPercent(ind) >= 50 ? 'bg-amber-500' : 'bg-primary-500',
                      )}
                      style={{ width: `${progressPercent(ind)}%` }}
                    />
                  </div>
                  <p className="mt-1 text-right text-xs text-neutral-400">{progressPercent(ind)}%</p>
                </motion.div>
              ))}
            </div>
          )}

          {selected && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.name}</h3>
                  <p className="text-sm text-neutral-500">{selected.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => openEdit(selected)}><Edit3 size={16} /></Button>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDelete(selected.id)}><Trash2 size={16} /></Button>
                  <Button variant="ghost" size="sm" onClick={() => { setSelected(null); setRecords([]) }}><X size={16} /></Button>
                </div>
              </div>

              <div className="mb-6 grid gap-4 text-sm sm:grid-cols-4">
                {[
                  { label: 'Categoría', value: selected.category },
                  { label: 'Unidad', value: selected.unit || '-' },
                  { label: 'Valor Actual', value: selected.current ?? '-' },
                  { label: 'Meta', value: selected.target ?? '-' },
                  { label: 'Año', value: selected.year || '-' },
                  { label: 'Región', value: selected.region || '-' },
                  { label: 'Institución', value: selected.institution || '-' },
                  { label: 'Fuente', value: selected.source || '-' },
                ].map((f) => (
                  <div key={f.label} className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                    <p className="text-xs text-neutral-500">{f.label}</p>
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">{f.value}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddRecord} className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-700/30">
                <h4 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Agregar Registro</h4>
                <div className="grid gap-3 sm:grid-cols-4">
                  <Input type="number" step="any" placeholder="Valor" value={recValue} onChange={(e) => setRecValue(e.target.value)} required />
                  <Input type="date" value={recDate} onChange={(e) => setRecDate(e.target.value)} required />
                  <Input placeholder="Región" value={recRegion} onChange={(e) => setRecRegion(e.target.value)} />
                  <Input placeholder="Institución" value={recInstitution} onChange={(e) => setRecInstitution(e.target.value)} />
                </div>
                <div className="mt-3 flex justify-end">
                  <Button type="submit" variant="primary" size="sm">Agregar</Button>
                </div>
              </form>

              <h4 className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Historial de Registros</h4>
              {records.length === 0 ? (
                <p className="text-sm text-neutral-500">Sin registros aún</p>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-4 py-2 font-semibold text-neutral-600 dark:text-neutral-400">Valor</th>
                        <th className="px-4 py-2 font-semibold text-neutral-600 dark:text-neutral-400">Fecha</th>
                        <th className="px-4 py-2 font-semibold text-neutral-600 dark:text-neutral-400">Región</th>
                        <th className="px-4 py-2 font-semibold text-neutral-600 dark:text-neutral-400">Institución</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {records.map((rec: any) => (
                        <tr key={rec.id} className="bg-white dark:bg-neutral-900">
                          <td className="px-4 py-2 font-medium text-neutral-900 dark:text-neutral-100">{rec.value}</td>
                          <td className="px-4 py-2 text-neutral-500">{rec.date ? new Date(rec.date).toLocaleDateString('es-PE') : '-'}</td>
                          <td className="px-4 py-2 text-neutral-500">{rec.region || '-'}</td>
                          <td className="px-4 py-2 text-neutral-500">{rec.institution || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </Container>
      </Section>
    </PageTransition>
  )
}
