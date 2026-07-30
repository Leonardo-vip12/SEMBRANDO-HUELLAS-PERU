import { useState } from 'react';
import { FileText, Upload, Loader2, Brain, HelpCircle, Map, BookmarkCheck, Activity } from 'lucide-react';
import { EisService } from '@/services/eis';

export default function DocumentAnalysisPage() {
  const [tab, setTab] = useState<'file' | 'text'>('text');
  const [text, setText] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleAnalyzeText() {
    if (text.length < 10) { setError('El texto debe tener al menos 10 caracteres'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await EisService.analyzeText(text);
      setResult(res);
    } catch { setError('Error al analizar el texto'); }
    setLoading(false);
  }

  const sections = result ? [
    { key: 'summary', label: 'Resumen', icon: FileText, content: result.summary },
    { key: 'concepts', label: 'Conceptos', icon: Brain, content: Array.isArray(result.concepts) ? result.concepts : null },
    { key: 'questions', label: 'Preguntas', icon: HelpCircle, content: Array.isArray(result.questions) ? result.questions : null },
    { key: 'mindMap', label: 'Mapa Conceptual', icon: Map, content: result.mindMap?.centralTopic ? result.mindMap : null },
    { key: 'glossary', label: 'Glosario', icon: BookmarkCheck, content: Array.isArray(result.glossary) ? result.glossary : null },
    { key: 'activities', label: 'Actividades', icon: Activity, content: Array.isArray(result.activities) ? result.activities : null },
  ] : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Análisis de Documentos</h1>
          <p className="text-sm text-neutral-500">Analiza textos con IA: resúmenes, conceptos, preguntas y más</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        <button onClick={() => setTab('text')}
          className={`px-4 py-2 text-sm font-medium ${tab === 'text' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-neutral-500'}`}>
          Texto Directo
        </button>
        <button onClick={() => setTab('file')}
          className={`px-4 py-2 text-sm font-medium ${tab === 'file' ? 'border-b-2 border-purple-500 text-purple-600' : 'text-neutral-500'}`}>
          Subir Archivo
        </button>
      </div>

      {tab === 'text' && (
        <div className="space-y-4">
          <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
            placeholder="Pega aquí el texto que deseas analizar (mín. 10 caracteres)..."
            className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
          <button onClick={handleAnalyzeText} disabled={loading || text.length < 10}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-500 px-4 py-3 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
            Analizar con IA
          </button>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {tab === 'file' && (
        <div className="rounded-xl border-2 border-dashed border-neutral-300 p-12 text-center dark:border-neutral-600">
          <Upload size={48} className="mx-auto mb-3 text-neutral-300" />
          <p className="text-sm text-neutral-400">Sube un archivo PDF, Word, PPT o TXT</p>
          <p className="text-xs text-neutral-300">El análisis completo requiere autenticación</p>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6">
          {sections.map(s => {
            if (!s.content) return null;
            return (
              <div key={s.key} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  <s.icon size={16} className="text-purple-500" /> {s.label}
                </h3>
                {typeof s.content === 'string' && <p className="text-sm text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">{s.content}</p>}
                {Array.isArray(s.content) && s.content.map((item: any, i: number) => (
                  <div key={i} className="mb-3 last:mb-0">
                    {item.concept && <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.concept}</p>}
                    {item.definition && <p className="text-xs text-neutral-500">{item.definition}</p>}
                    {item.question && <p className="text-sm text-neutral-800 dark:text-neutral-200">{item.question}</p>}
                    {item.term && <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.term}</p>}
                    {item.simpleExplanation && <p className="text-xs text-neutral-500">{item.simpleExplanation}</p>}
                    {item.title && <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.title}</p>}
                    {item.description && <p className="text-xs text-neutral-500">{item.description}</p>}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
