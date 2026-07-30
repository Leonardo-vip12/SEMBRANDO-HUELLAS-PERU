import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Brain, TrendingUp, PenLine, BarChart3, Lightbulb, AlertTriangle, RefreshCw, ChevronUp, ChevronDown, Minus } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SiaService } from '../services/sia';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const REPORT_TYPES = ['Boletín', 'Informe Técnico', 'Reporte Ejecutivo', 'Ficha Informativa'];
const SOURCE_TYPES = ['Avistamientos', 'Especies', 'Cobertura', 'Calidad agua', 'Biodiversidad', 'Clima'];
const CHART_TYPES = ['Barras', 'Líneas', 'Pastel', 'Radar', 'Área'];
const REGIONS = ['Amazonía', 'Costa', 'Sierra', 'Galápagos', 'Todas'];

export default function SiaAiReportsPage() {
  const [summaryType, setSummaryType] = useState('');
  const [summaryStart, setSummaryStart] = useState('');
  const [summaryEnd, setSummaryEnd] = useState('');
  const [summaryRegion, setSummaryRegion] = useState('');
  const [summaryIndicators, setSummaryIndicators] = useState<string[]>([]);
  const [summaryResult, setSummaryResult] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [trendMetric, setTrendMetric] = useState('');
  const [trendPeriod, setTrendPeriod] = useState('');
  const [trends, setTrends] = useState<any[]>([]);
  const [trendLoading, setTrendLoading] = useState(false);

  const [draftType, setDraftType] = useState('');
  const [draftFilters, setDraftFilters] = useState('');
  const [draftResult, setDraftResult] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);

  const [chartType, setChartType] = useState('Barras');
  const [chartData, setChartData] = useState('');
  const [chartExplanation, setChartExplanation] = useState('');
  const [chartLoading, setChartLoading] = useState(false);

  const [actionData, setActionData] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  async function generateSummary() {
    setSummaryLoading(true);
    try {
      const res = await SiaService.generateAiSummary({
        type: summaryType,
        startDate: summaryStart || undefined,
        endDate: summaryEnd || undefined,
        region: summaryRegion || undefined,
        indicators: summaryIndicators.length > 0 ? summaryIndicators : undefined,
      });
      setSummaryResult(res?.summary || res?.content || JSON.stringify(res));
    } catch {}
    setSummaryLoading(false);
  }

  async function detectTrends() {
    setTrendLoading(true);
    try {
      const res = await SiaService.detectTrends(trendMetric, trendPeriod);
      setTrends(Array.isArray(res) ? res : res?.trends || []);
    } catch {}
    setTrendLoading(false);
  }

  async function generateDraft() {
    setDraftLoading(true);
    try {
      const filters = draftFilters ? JSON.parse(draftFilters) : undefined;
      const res = await SiaService.generateDraft(draftType, filters);
      setDraftResult(res?.draft || res?.content || JSON.stringify(res));
    } catch {}
    setDraftLoading(false);
  }

  async function explainChart() {
    setChartLoading(true);
    try {
      const data = chartData ? JSON.parse(chartData) : {};
      const res = await SiaService.explainChart(chartType, data);
      setChartExplanation(res?.explanation || res?.content || JSON.stringify(res));
    } catch {}
    setChartLoading(false);
  }

  async function suggestActions() {
    setActionLoading(true);
    try {
      const data = actionData ? JSON.parse(actionData) : {};
      const res = await SiaService.suggestActions(data);
      setSuggestions(res?.suggestions || res?.actions || res?.content || JSON.stringify(res));
    } catch {}
    setActionLoading(false);
  }

  function toggleIndicator(ind: string) {
    setSummaryIndicators(prev => prev.includes(ind) ? prev.filter(i => i !== ind) : [...prev, ind]);
  }

  function TrendArrow({ direction }: { direction: string }) {
    if (direction === 'up') return <ChevronUp size={20} className="text-green-500" />;
    if (direction === 'down') return <ChevronDown size={20} className="text-red-500" />;
    return <Minus size={20} className="text-neutral-400" />;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Brain size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Informes con IA</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Generación automatizada de informes, detección de tendencias y análisis asistido por inteligencia artificial</p>
        </div>
      </div>

      <motion.div variants={item} className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20">
        <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Este informe ha sido generado por inteligencia artificial y requiere revisión humana antes de su publicación oficial.
        </p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} className="text-amber-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Generador de Resumen</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Tipo</label>
                <select value={summaryType} onChange={e => setSummaryType(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <option value="">Seleccionar...</option>
                  {REPORT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Región</label>
                <select value={summaryRegion} onChange={e => setSummaryRegion(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <option value="">Todas</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Fecha inicio</label>
                <input type="date" value={summaryStart} onChange={e => setSummaryStart(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Fecha fin</label>
                <input type="date" value={summaryEnd} onChange={e => setSummaryEnd(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium text-neutral-500">Indicadores</label>
              <div className="flex flex-wrap gap-2">
                {SOURCE_TYPES.map(ind => (
                  <button key={ind} onClick={() => toggleIndicator(ind)}
                    className={cn(
                      'rounded-lg border px-3 py-1 text-xs font-medium transition-all',
                      summaryIndicators.includes(ind)
                        ? 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
                        : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800',
                    )}>
                    {ind}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={generateSummary} disabled={summaryLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
              {summaryLoading && <RefreshCw size={14} className="animate-spin" />} Generar Resumen
            </button>
            {summaryResult && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{summaryResult}</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Detección de Tendencias</h2>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Métrica</label>
                <select value={trendMetric} onChange={e => setTrendMetric(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <option value="">Seleccionar...</option>
                  {SOURCE_TYPES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Período</label>
                <select value={trendPeriod} onChange={e => setTrendPeriod(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <option value="">Seleccionar...</option>
                  <option value="7d">7 días</option>
                  <option value="30d">30 días</option>
                  <option value="90d">90 días</option>
                  <option value="1y">1 año</option>
                </select>
              </div>
            </div>
            <button onClick={detectTrends} disabled={trendLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
              {trendLoading && <RefreshCw size={14} className="animate-spin" />} Detectar Tendencias
            </button>
            {trends.length > 0 && (
              <div className="space-y-2">
                {trends.map((t: any, i: number) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
                    <div className="flex items-center gap-3">
                      <TrendArrow direction={t.direction} />
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{t.metric || t.label}</p>
                        <p className="text-xs text-neutral-400">{t.description || t.change} {t.unit ? `(${t.unit})` : ''}</p>
                      </div>
                    </div>
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      t.confidence >= 0.7 ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                        : t.confidence >= 0.4 ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
                        : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400',
                    )}>
                      {((t.confidence || 0) * 100).toFixed(0)}% confianza
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <PenLine size={18} className="text-purple-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Generador de Borrador</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Tipo</label>
              <select value={draftType} onChange={e => setDraftType(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <option value="">Seleccionar...</option>
                <option value="reporte">Reporte</option>
                <option value="articulo">Artículo</option>
                <option value="resumen">Resumen</option>
                <option value="nota">Nota técnica</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Filtros (JSON)</label>
              <textarea value={draftFilters} onChange={e => setDraftFilters(e.target.value)} rows={3} placeholder='{"region":"Amazonía","year":2025}'
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-mono dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <button onClick={generateDraft} disabled={draftLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:opacity-50">
              {draftLoading && <RefreshCw size={14} className="animate-spin" />} Generar Borrador
            </button>
            {draftResult && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{draftResult}</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 size={18} className="text-cyan-500" />
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Explicador de Gráficos</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Tipo de gráfico</label>
              <div className="flex flex-wrap gap-2">
                {CHART_TYPES.map(ct => (
                  <button key={ct} onClick={() => setChartType(ct)}
                    className={cn(
                      'rounded-lg border px-3 py-1 text-xs font-medium transition-all',
                      chartType === ct
                        ? 'border-cyan-200 bg-cyan-50 text-cyan-700 dark:border-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-300'
                        : 'border-neutral-200 text-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800',
                    )}>
                    {ct}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Datos (JSON)</label>
              <textarea value={chartData} onChange={e => setChartData(e.target.value)} rows={4} placeholder='{"labels":["Ene","Feb"],"values":[10,20]}'
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-mono dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <button onClick={explainChart} disabled={chartLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-50">
              {chartLoading && <RefreshCw size={14} className="animate-spin" />} Explicar
            </button>
            {chartExplanation && (
              <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
                <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{chartExplanation}</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-amber-500" />
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Sugeridor de Acciones</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Datos (JSON)</label>
            <textarea value={actionData} onChange={e => setActionData(e.target.value)} rows={4} placeholder='{"indicators":[],"region":"Amazonía","period":"2024-2025"}'
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-mono dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
          </div>
          <button onClick={suggestActions} disabled={actionLoading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 disabled:opacity-50">
            {actionLoading && <RefreshCw size={14} className="animate-spin" />} Sugerir Acciones
          </button>
          {suggestions && (
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <p className="text-sm text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{suggestions}</p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
