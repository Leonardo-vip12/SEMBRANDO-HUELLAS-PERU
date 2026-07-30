import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Search, BookOpen, FileText, Calendar, Bird, Users, Sparkles, Loader2, TrendingUp } from 'lucide-react';
import { EisService } from '@/services/eis';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const itemAnim = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const CATEGORIES = [
  { value: 'courses', label: 'Cursos', icon: BookOpen },
  { value: 'news', label: 'Noticias', icon: FileText },
  { value: 'projects', label: 'Proyectos', icon: TrendingUp },
  { value: 'species', label: 'Especies', icon: Bird },
  { value: 'educational', label: 'Material Educativo', icon: BookOpen },
  { value: 'events', label: 'Eventos', icon: Calendar },
  { value: 'activities', label: 'Actividades', icon: Users },
];

export default function RecommenderPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch() {
    if (!query.trim()) { setError('Ingrese un tema de interés'); return; }
    setLoading(true); setError(''); setActiveCategory('');
    try {
      const res = await EisService.recommend(query, 8);
      setResults(Array.isArray(res) ? res : []);
    } catch { setError('Error al obtener recomendaciones'); }
    setLoading(false);
  }

  async function handleCategory(category: string) {
    setLoading(true); setError(''); setActiveCategory(category); setQuery('');
    try {
      const res = await EisService.recommendByCategory(category);
      setResults(Array.isArray(res) ? res : []);
    } catch { setError('Error al obtener recomendaciones'); }
    setLoading(false);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-lg">
          <Lightbulb size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Recomendador Inteligente</h1>
          <p className="text-sm text-neutral-500">Descubre contenido relevante según tus intereses</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="¿Qué tema te interesa? (Ej: aves amazónicas, cambio climático...)"
          className="flex-1 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
        <button onClick={handleSearch} disabled={loading}
          className="flex items-center gap-2 rounded-xl bg-violet-500 px-6 py-3 text-sm font-medium text-white hover:bg-violet-600 disabled:opacity-50">
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          Recomendar
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          return (
            <button key={c.value} onClick={() => handleCategory(c.value)} disabled={loading}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-colors ${activeCategory === c.value ? 'bg-violet-500 text-white' : 'border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300'}`}>
              <Icon size={14} /> {c.label}
            </button>
          );
        })}
      </div>

      {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={32} className="animate-spin text-violet-500" />
        </div>
      )}

      {!loading && results.length > 0 && (
        <motion.div variants={itemAnim} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((r: any, i: number) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white p-5 transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800">
              <div className="mb-2 flex items-center gap-2">
                <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700 dark:bg-violet-900 dark:text-violet-300 capitalize">
                  {r.type || r.collection}
                </span>
                {r.score && (
                  <span className="text-xs text-neutral-400">{(r.score * 100).toFixed(0)}%</span>
                )}
              </div>
              <h3 className="mb-1 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{r.title}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2">{r.description}</p>
              {r.reason && (
                <p className="mt-2 text-xs italic text-neutral-400">→ {r.reason}</p>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {!loading && results.length === 0 && !error && (
        <div className="py-16 text-center">
          <Sparkles size={48} className="mx-auto mb-4 text-neutral-300" />
          <p className="text-sm text-neutral-400">Busca un tema o selecciona una categoría para obtener recomendaciones personalizadas</p>
        </div>
      )}
    </motion.div>
  );
}
