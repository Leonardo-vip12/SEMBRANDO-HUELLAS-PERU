import { useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Upload, BookOpen, Loader2, RefreshCw, CheckCircle, Server, FileText, Layers } from 'lucide-react';
import { EisService } from '@/services/eis';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };

const COLLECTIONS = [
  { value: 'news', label: 'Noticias', icon: FileText },
  { value: 'species', label: 'Especies', icon: BookOpen },
  { value: 'programs', label: 'Programas', icon: Layers },
  { value: 'projects', label: 'Proyectos', icon: Server },
  { value: 'faq', label: 'Preguntas Frecuentes', icon: BookOpen },
  { value: 'resources', label: 'Recursos', icon: FileText },
];

export default function RAGPage() {
  const [tab, setTab] = useState<'search' | 'index' | 'stats'>('search');
  const [query, setQuery] = useState('');
  const [collection, setCollection] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [indexResult, setIndexResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!query.trim()) { setError('Consulta requerida'); return; }
    setLoading(true); setError('');
    try {
      const res = await EisService.ragSearch(query, collection || undefined);
      setResults(Array.isArray(res) ? res : []);
    } catch { setError('Error en la búsqueda'); }
    setLoading(false);
  }

  async function handleIndexAll() {
    setLoading(true); setError('');
    try {
      const res = await EisService.ragIndexAll();
      setIndexResult(res);
    } catch { setError('Error al indexar'); }
    setLoading(false);
  }

  async function handleIndexCollection(c: string) {
    setLoading(true); setError('');
    try {
      const res = await EisService.ragIndexCollection(c);
      setIndexResult(res);
    } catch { setError('Error al indexar colección'); }
    setLoading(false);
  }

  async function loadStats() {
    setLoading(true);
    try {
      const res = await EisService.ragStats();
      setStats(res);
    } catch { setError('Error al cargar stats'); }
    setLoading(false);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg">
          <Database size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">RAG - Retrieval Augmented Generation</h1>
          <p className="text-sm text-neutral-500">Búsqueda semántica e indexación de contenido para respuestas precisas</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        {([
          { k: 'search', l: 'Búsqueda', i: Search },
          { k: 'index', l: 'Indexación', i: Upload },
          { k: 'stats', l: 'Estadísticas', i: RefreshCw },
        ] as const).map(t => (
          <button key={t.k} onClick={() => { setTab(t.k as typeof tab); if (t.k === 'stats') loadStats(); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${tab === t.k ? 'border-b-2 border-cyan-500 text-cyan-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
            <t.i size={16} /> {t.l}
          </button>
        ))}
      </div>

      {tab === 'search' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <div className="mb-4 flex gap-2">
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Buscar en el índice semántico..."
                className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              <select value={collection} onChange={e => setCollection(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                <option value="">Todas</option>
                {COLLECTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              <button onClick={handleSearch} disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Buscar
              </button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm text-neutral-400">{results.length} resultado(s)</p>
              {results.map((r: any, i: number) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-cyan-100 px-2 py-0.5 text-xs font-medium text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">
                      {r.document?.collection || r.collection}
                    </span>
                    <span className="text-xs text-neutral-400">{(r.score * 100).toFixed(0)}% similitud</span>
                  </div>
                  <p className="mt-2 text-sm text-neutral-800 dark:text-neutral-200">
                    {r.document?.content?.slice(0, 300) || r.content?.slice(0, 300) || 'Sin contenido'}
                  </p>
                </div>
              ))}
            </div>
          )}

          {!loading && results.length === 0 && query && (
            <p className="text-center text-sm text-neutral-400">No se encontraron resultados</p>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {tab === 'index' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Indexar Todo el Contenido</h2>
            <p className="mb-4 text-xs text-neutral-400">Indexa noticias, especies, programas, FAQs y recursos en el vector store para búsqueda semántica</p>
            <button onClick={handleIndexAll} disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-medium text-white hover:bg-cyan-600 disabled:opacity-50">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              Indexar Todo
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLLECTIONS.map(c => {
              const Icon = c.icon;
              return (
                <button key={c.value} onClick={() => handleIndexCollection(c.value)} disabled={loading}
                  className="rounded-xl border border-neutral-200 bg-white p-4 text-left transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
                  <Icon size={20} className="mb-2 text-cyan-500" />
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{c.label}</h3>
                  <p className="text-xs text-neutral-400">Indexar solo esta colección</p>
                </button>
              );
            })}
          </div>

          {indexResult && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircle size={18} /> <span className="font-medium">Indexación completada</span>
              </div>
              <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                Documentos indexados: {indexResult.indexed || indexResult.collection} | Fallos: {indexResult.failed || 0}
              </p>
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {tab === 'stats' && (
        <div className="space-y-4">
          {loading && <div className="text-center text-neutral-400"><Loader2 size={20} className="mx-auto animate-spin" /></div>}
          {stats && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    <Database size={16} className="text-cyan-500" /> Vector Store
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Documentos indexados</span>
                      <span className="font-medium">{stats.vectorStore?.totalDocuments || 0}</span>
                    </p>
                    <p className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Colecciones</span>
                      <span className="font-medium">{stats.vectorStore?.collections?.length || 0}</span>
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(stats.vectorStore?.collections || []).map((c: string) => (
                      <span key={c} className="rounded-full bg-cyan-100 px-2 py-0.5 text-xs text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300">{c}</span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    <BookOpen size={16} className="text-cyan-500" /> Knowledge Base
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Total entradas</span>
                      <span className="font-medium">{stats.knowledgeBase?.total || 0}</span>
                    </p>
                    <p className="flex justify-between text-neutral-600 dark:text-neutral-300">
                      <span>Verificadas</span>
                      <span className="font-medium">{stats.knowledgeBase?.verified || 0}</span>
                    </p>
                  </div>
                  {stats.knowledgeBase?.categories && Object.keys(stats.knowledgeBase.categories).length > 0 && (
                    <div className="mt-4">
                      <p className="mb-2 text-xs text-neutral-400">Categorías</p>
                      <div className="space-y-1">
                        {Object.entries(stats.knowledgeBase.categories).map(([cat, count]) => (
                          <p key={cat} className="flex justify-between text-xs text-neutral-500">
                            <span>{cat}</span>
                            <span>{count as number}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {!loading && !stats && <p className="text-center text-sm text-neutral-400">Cargue la pestaña de estadísticas para ver los datos</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    </motion.div>
  );
}
