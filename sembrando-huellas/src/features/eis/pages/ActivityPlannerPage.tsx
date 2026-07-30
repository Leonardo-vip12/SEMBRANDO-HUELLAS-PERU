import { useState } from 'react';
import { Calendar, Loader2, Sparkles, Clock, Users, Target, BookOpen } from 'lucide-react';
import { EisService } from '@/services/eis';

const ACTIVITY_TYPES = [
  { value: 'charla', label: 'Charla' },
  { value: 'campana', label: 'Campaña' },
  { value: 'taller', label: 'Taller' },
  { value: 'sesion_educativa', label: 'Sesión Educativa' },
  { value: 'juego', label: 'Juego' },
  { value: 'dinamica', label: 'Dinámica' },
];

export default function ActivityPlannerPage() {
  const [form, setForm] = useState({ activityType: 'taller', topic: '', level: 'general', duration: '60', participants: 20, objectives: '' });
  const [plan, setPlan] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handlePlan() {
    if (!form.topic.trim()) { setError('El tema es requerido'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await EisService.planActivity({
        activityType: form.activityType,
        topic: form.topic,
        level: form.level,
        duration: `${form.duration} minutos`,
        participants: form.participants,
        objectives: form.objectives.split('\n').filter(Boolean),
      });
      setPlan(res);
    } catch { setError('Error al generar el plan'); }
    setLoading(false);
  }

  async function loadRecommendations() {
    setLoading(true);
    try {
      const res = await EisService.activityRecommendations(form.level, `${form.duration} minutos`);
      setRecommendations(Array.isArray(res) ? res : []);
    } catch { setError('Error al cargar recomendaciones'); }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg">
          <Calendar size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Planificador de Actividades</h1>
          <p className="text-sm text-neutral-500">Diseña actividades educativas ambientales con IA</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
            <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Configura tu actividad</h2>
            <div className="space-y-4">
              <div><label className="mb-1 block text-xs text-neutral-400">Tipo</label>
                <select value={form.activityType} onChange={e => setForm({ ...form, activityType: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  {ACTIVITY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div><label className="mb-1 block text-xs text-neutral-400">Tema</label>
                <input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })}
                  placeholder="Ej: Contaminación por plásticos en el río Ucayali"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="mb-1 block text-xs text-neutral-400">Nivel</label>
                  <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                    <option value="primaria">Primaria</option>
                    <option value="secundaria">Secundaria</option>
                    <option value="universidad">Universidad</option>
                    <option value="general">General</option>
                  </select>
                </div>
                <div><label className="mb-1 block text-xs text-neutral-400">Duración (min)</label>
                  <input type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                </div>
                <div><label className="mb-1 block text-xs text-neutral-400">Participantes</label>
                  <input type="number" value={form.participants} onChange={e => setForm({ ...form, participants: Number(e.target.value) })}
                    className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
                </div>
              </div>
              <div><label className="mb-1 block text-xs text-neutral-400">Objetivos (uno por línea)</label>
                <textarea value={form.objectives} onChange={e => setForm({ ...form, objectives: e.target.value })} rows={3}
                  placeholder="Identificar fuentes de contaminación&#10;Proponer soluciones prácticas"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <button onClick={handlePlan} disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                Generar Plan
              </button>
            </div>
          </div>

          <button onClick={loadRecommendations} disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
            <Sparkles size={16} /> Ver Recomendaciones
          </button>

          {recommendations.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recomendaciones</h3>
              {recommendations.map((r: any, i: number) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
                  <h4 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{r.title}</h4>
                  <p className="text-xs text-neutral-400">{r.type} • {r.duration} • {r.level}</p>
                  <p className="mt-1 text-xs text-neutral-500">{r.briefDescription}</p>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <div>
          {plan && (
            <div className="space-y-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">{plan.title || 'Plan de Actividad'}</h2>
                <p className="mb-4 text-sm text-neutral-500">{plan.description}</p>
                <div className="mb-4 flex flex-wrap gap-3 text-xs text-neutral-400">
                  {plan.duration && <span className="flex items-center gap-1"><Clock size={14} /> {plan.duration}</span>}
                  {plan.participants && <span className="flex items-center gap-1"><Users size={14} /> {plan.participants} participantes</span>}
                </div>
                {plan.objectives && plan.objectives.length > 0 && (
                  <div className="mb-4"><h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100"><Target size={16} /> Objetivos</h3>
                    <ul className="list-inside list-disc text-sm text-neutral-600 dark:text-neutral-300">
                      {plan.objectives.map((o: string, i: number) => <li key={i}>{o}</li>)}
                    </ul>
                  </div>
                )}
              </div>
              {plan.structure && plan.structure.length > 0 && (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100"><BookOpen size={16} /> Estructura</h3>
                  <div className="space-y-3">
                    {plan.structure.map((s: any, i: number) => (
                      <div key={i} className="rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{s.title || s.step || `Paso ${i + 1}`}</p>
                          {s.time && <span className="text-xs text-neutral-400">{s.time}</span>}
                        </div>
                        {s.description && <p className="mt-1 text-xs text-neutral-500">{s.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {plan.materials && plan.materials.length > 0 && (
                <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
                  <h3 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Materiales</h3>
                  <ul className="list-inside list-disc text-sm text-neutral-600 dark:text-neutral-300">
                    {plan.materials.map((m: string, i: number) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
