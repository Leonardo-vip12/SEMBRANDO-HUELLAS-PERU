import { useState } from 'react';
import { MapPin, Camera, Bird, List, BarChart3, Loader2, Send } from 'lucide-react';
import { EisService } from '@/services/eis';

export default function ObservatoryPage() {
  const [tab, setTab] = useState<'register' | 'list' | 'map' | 'stats'>('register');
  const [form, setForm] = useState({ speciesName: '', scientificName: '', quantity: 1, latitude: 0, longitude: 0, habitat: '', weather: '', comments: '' });
  const [loading, setLoading] = useState(false);
  const [observations, setObservations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [message, setMessage] = useState('');

  async function handleRegister() {
    if (!form.latitude || !form.longitude) { setMessage('Ubicación requerida'); return; }
    setLoading(true);
    try {
      await EisService.registerObservation(form);
      setMessage('Observación registrada exitosamente');
      setForm({ speciesName: '', scientificName: '', quantity: 1, latitude: 0, longitude: 0, habitat: '', weather: '', comments: '' });
    } catch { setMessage('Error al registrar'); }
    setLoading(false);
  }

  async function loadObservations() {
    setLoading(true);
    try {
      const res = await EisService.listObservations();
      setObservations((res as any).data || []);
    } catch { setMessage('Error al cargar'); }
    setLoading(false);
  }

  async function loadStats() {
    setLoading(true);
    try {
      const res = await EisService.observatoryStats();
      setStats(res);
    } catch { setMessage('Error al cargar stats'); }
    setLoading(false);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg">
          <Bird size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Observatorio de Biodiversidad</h1>
          <p className="text-sm text-neutral-500">Registra y explora observaciones de especies en Perú</p>
        </div>
      </div>

      <div className="mb-6 flex gap-2 border-b border-neutral-200 dark:border-neutral-700">
        {([{ k: 'register', l: 'Registrar', i: Camera }, { k: 'list', l: 'Observaciones', i: List }, { k: 'map', l: 'Mapa', i: MapPin }, { k: 'stats', l: 'Estadísticas', i: BarChart3 }] as const).map(t => (
          <button key={t.k} onClick={() => { setTab(t.k as typeof tab); if (t.k === 'list') loadObservations(); if (t.k === 'stats') loadStats(); }}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${tab === t.k ? 'border-b-2 border-emerald-500 text-emerald-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
            <t.i size={16} /> {t.l}
          </button>
        ))}
      </div>

      {tab === 'register' && (
        <div className="mx-auto max-w-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs text-neutral-400">Nombre común</label>
              <input value={form.speciesName} onChange={e => setForm({ ...form, speciesName: e.target.value })} className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
            <div><label className="mb-1 block text-xs text-neutral-400">Nombre científico</label>
              <input value={form.scientificName} onChange={e => setForm({ ...form, scientificName: e.target.value })} className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div><label className="mb-1 block text-xs text-neutral-400">Cantidad</label>
              <input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
            <div><label className="mb-1 block text-xs text-neutral-400">Latitud</label>
              <input type="number" step="any" value={form.latitude} onChange={e => setForm({ ...form, latitude: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
            <div><label className="mb-1 block text-xs text-neutral-400">Longitud</label>
              <input type="number" step="any" value={form.longitude} onChange={e => setForm({ ...form, longitude: Number(e.target.value) })}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="mb-1 block text-xs text-neutral-400">Hábitat</label>
              <input value={form.habitat} onChange={e => setForm({ ...form, habitat: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Bosque, río, etc." /></div>
            <div><label className="mb-1 block text-xs text-neutral-400">Clima</label>
              <input value={form.weather} onChange={e => setForm({ ...form, weather: e.target.value })}
                className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
          </div>
          <div><label className="mb-1 block text-xs text-neutral-400">Comentarios</label>
            <textarea value={form.comments} onChange={e => setForm({ ...form, comments: e.target.value })} rows={3}
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" /></div>
          <button onClick={handleRegister} disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-50">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Registrar Observación
          </button>
          {message && <p className="text-center text-sm text-neutral-500">{message}</p>}
        </div>
      )}

      {tab === 'list' && (
        <div className="space-y-3">
          {loading && <div className="text-center text-neutral-400"><Loader2 size={20} className="mx-auto animate-spin" /></div>}
          {observations.map((o: any) => (
            <div key={o.id} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{o.speciesName || o.scientificName || 'No identificado'}</p>
                  <p className="text-xs text-neutral-400">{o.scientificName} • {o.quantity} individuo(s)</p>
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs ${o.status === 'VERIFIED' ? 'bg-green-100 text-green-700' : o.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {o.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">{o.latitude}, {o.longitude} • {new Date(o.observedAt).toLocaleDateString()}</p>
            </div>
          ))}
          {!loading && observations.length === 0 && <p className="text-center text-sm text-neutral-400">No hay observaciones registradas</p>}
        </div>
      )}

      {tab === 'map' && (
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center dark:border-neutral-700 dark:bg-neutral-800">
          <MapPin size={40} className="mx-auto mb-2 text-neutral-300" />
          <p className="text-sm text-neutral-400">El mapa interactivo se renderizará aquí con los datos de observaciones</p>
          <p className="text-xs text-neutral-300">API de mapas: /eis/observatory/map</p>
        </div>
      )}

      {tab === 'stats' && stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-3xl font-bold text-emerald-500">{stats.total || 0}</p>
            <p className="text-xs text-neutral-400">Total Observaciones</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-3xl font-bold text-green-500">{stats.verified || 0}</p>
            <p className="text-xs text-neutral-400">Verificadas</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center dark:border-neutral-700 dark:bg-neutral-800">
            <p className="text-3xl font-bold text-amber-500">{stats.pending || 0}</p>
            <p className="text-xs text-neutral-400">Pendientes</p>
          </div>
          {stats.topSpecies?.map((s: any, i: number) => (
            <div key={i} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{s.scientificName}</p>
              <p className="text-xs text-neutral-400">{s._count} registro(s)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
