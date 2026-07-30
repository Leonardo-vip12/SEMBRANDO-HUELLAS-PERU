import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Plus, RefreshCw, Crosshair, Ruler, Search, Trash2, Edit3, Target } from 'lucide-react';
import { cn } from '@/lib/cn';
import { SiaService } from '../services/sia';

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const ZONE_TYPES = ['reserva', 'corredor', 'parche', 'transecto', 'punto_muestreo'];
const ZONE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const TOOLS = [
  { key: 'clustering', label: 'Agrupación de Puntos', icon: <Crosshair size={16} /> },
  { key: 'density', label: 'Densidad de Registros', icon: <Target size={16} /> },
  { key: 'buffer', label: 'Análisis de Buffer', icon: <Ruler size={16} /> },
];

const LAYERS = ['Observaciones', 'Especies', 'Cobertura vegetal', 'Hidrografía', 'Infraestructura'];

export default function SiaGeospatialPage() {
  const [zones, setZones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZone, setEditingZone] = useState<any>(null);
  const [zoneForm, setZoneForm] = useState({ name: '', type: 'reserva', description: '', geometry: '', latitude: '', longitude: '', color: '#3b82f6' });
  const [activeTool, setActiveTool] = useState('clustering');
  const [toolResults, setToolResults] = useState<any>(null);

  const [clusterLayer, setClusterLayer] = useState('');
  const [clusterZoom, setClusterZoom] = useState('10');
  const [densityLayer, setDensityLayer] = useState('');
  const [densityRegion, setDensityRegion] = useState('');
  const [bufferLayer, setBufferLayer] = useState('');
  const [bufferLat, setBufferLat] = useState('');
  const [bufferLng, setBufferLng] = useState('');
  const [bufferRadius, setBufferRadius] = useState('5');
  const [queryLayer, setQueryLayer] = useState('');
  const [queryType, setQueryType] = useState('intersects');
  const [queryGeometry, setQueryGeometry] = useState('');

  useEffect(() => { loadZones(); }, []);

  async function loadZones() {
    setLoading(true);
    try {
      const res = await SiaService.listZones();
      setZones(Array.isArray(res) ? res : res?.data || []);
    } catch {}
    setLoading(false);
  }

  async function saveZone(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        ...zoneForm,
        center: { lat: parseFloat(zoneForm.latitude), lng: parseFloat(zoneForm.longitude) },
        geometry: zoneForm.geometry ? JSON.parse(zoneForm.geometry) : undefined,
      };
      if (editingZone) {
        await SiaService.updateZone(editingZone.id, payload);
      } else {
        await SiaService.createZone(payload);
      }
      setShowZoneForm(false);
      setEditingZone(null);
      setZoneForm({ name: '', type: 'reserva', description: '', geometry: '', latitude: '', longitude: '', color: '#3b82f6' });
      loadZones();
    } catch {}
  }

  function startEdit(zone: any) {
    setEditingZone(zone);
    setZoneForm({
      name: zone.name || '',
      type: zone.type || 'reserva',
      description: zone.description || '',
      geometry: zone.geometry ? JSON.stringify(zone.geometry) : '',
      latitude: String(zone.center?.lat || ''),
      longitude: String(zone.center?.lng || ''),
      color: zone.color || '#3b82f6',
    });
    setShowZoneForm(true);
  }

  async function deleteZone(id: string) {
    try {
      await SiaService.deleteZone(id);
      loadZones();
    } catch {}
  }

  async function runClustering() {
    setToolResults(null);
    try {
      const res = await SiaService.getClustering(clusterLayer, parseInt(clusterZoom));
      setToolResults(res);
    } catch {}
  }

  async function runDensity() {
    setToolResults(null);
    try {
      const res = await SiaService.getDensity(densityLayer, densityRegion || undefined);
      setToolResults(res);
    } catch {}
  }

  async function runBuffer() {
    setToolResults(null);
    try {
      const res = await SiaService.bufferAnalysis({
        layer: bufferLayer,
        lat: parseFloat(bufferLat),
        lng: parseFloat(bufferLng),
        radiusKm: parseFloat(bufferRadius),
      });
      setToolResults(res);
    } catch {}
  }

  async function runSpatialQuery() {
    setToolResults(null);
    try {
      const res = await SiaService.spatialQuery({
        layer: queryLayer,
        type: queryType,
        geometry: JSON.parse(queryGeometry),
      });
      setToolResults(res);
    } catch {}
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-500 text-white">
              <Map size={18} />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analítica Geoespacial</h1>
          </div>
          <p className="mt-1 text-sm text-neutral-500">Gestión de zonas, herramientas de análisis espacial y consultas geográficas</p>
        </div>
        <button onClick={loadZones} className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800">
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Zonas</h2>
          <button onClick={() => { setShowZoneForm(!showZoneForm); setEditingZone(null); setZoneForm({ name: '', type: 'reserva', description: '', geometry: '', latitude: '', longitude: '', color: '#3b82f6' }); }}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700">
            <Plus size={14} /> {showZoneForm ? 'Cerrar' : 'Nueva Zona'}
          </button>
        </div>
        {showZoneForm && (
          <form onSubmit={saveZone} className="mb-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Nombre</label>
                <input type="text" value={zoneForm.name} onChange={e => setZoneForm({ ...zoneForm, name: e.target.value })} required
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Tipo</label>
                <select value={zoneForm.type} onChange={e => setZoneForm({ ...zoneForm, type: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100">
                  {ZONE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-neutral-500">Descripción</label>
                <textarea value={zoneForm.description} onChange={e => setZoneForm({ ...zoneForm, description: e.target.value })} rows={2}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Latitud</label>
                <input type="number" step="any" value={zoneForm.latitude} onChange={e => setZoneForm({ ...zoneForm, latitude: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Longitud</label>
                <input type="number" step="any" value={zoneForm.longitude} onChange={e => setZoneForm({ ...zoneForm, longitude: e.target.value })}
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Geometría (GeoJSON)</label>
                <textarea value={zoneForm.geometry} onChange={e => setZoneForm({ ...zoneForm, geometry: e.target.value })} rows={3} placeholder='{"type":"Polygon","coordinates":[[[]]]}'
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-mono dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {ZONE_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setZoneForm({ ...zoneForm, color: c })}
                      className={cn('h-8 w-8 rounded-full border-2', zoneForm.color === c ? 'border-neutral-900 dark:border-white' : 'border-transparent')}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => { setShowZoneForm(false); setEditingZone(null); }}
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300">Cancelar</button>
              <button type="submit" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                {editingZone ? 'Actualizar' : 'Crear'} Zona
              </button>
            </div>
          </form>
        )}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z: any, i: number) => (
            <div key={z.id || i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: z.color || '#3b82f6' }} />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{z.name}</p>
                  <p className="text-xs text-neutral-400 capitalize">{z.type}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => startEdit(z)} className="rounded p-1 text-neutral-400 hover:text-blue-500"><Edit3 size={14} /></button>
                <button onClick={() => deleteZone(z.id)} className="rounded p-1 text-neutral-400 hover:text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {zones.length === 0 && !loading && (
            <p className="col-span-full py-6 text-center text-sm text-neutral-400">No hay zonas registradas</p>
          )}
        </div>
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Herramientas de Análisis</h2>
        <div className="flex flex-wrap gap-2 mb-6">
          {TOOLS.map(t => (
            <button key={t.key} onClick={() => setActiveTool(t.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                activeTool === t.key
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800',
              )}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {activeTool === 'clustering' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Capa</label>
                <select value={clusterLayer} onChange={e => setClusterLayer(e.target.value)}
                  className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                  <option value="">Seleccionar...</option>
                  {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-neutral-500">Zoom</label>
                <input type="number" value={clusterZoom} onChange={e => setClusterZoom(e.target.value)} min="1" max="20"
                  className="w-24 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
              </div>
              <button onClick={runClustering}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Analizar</button>
            </div>
          </div>
        )}

        {activeTool === 'density' && (
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Capa</label>
              <select value={densityLayer} onChange={e => setDensityLayer(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <option value="">Seleccionar...</option>
                {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Región</label>
              <input type="text" value={densityRegion} onChange={e => setDensityRegion(e.target.value)} placeholder="Todas las regiones"
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <button onClick={runDensity}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Analizar</button>
          </div>
        )}

        {activeTool === 'buffer' && (
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Capa</label>
              <select value={bufferLayer} onChange={e => setBufferLayer(e.target.value)}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
                <option value="">Seleccionar...</option>
                {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Latitud</label>
              <input type="number" step="any" value={bufferLat} onChange={e => setBufferLat(e.target.value)}
                className="w-28 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Longitud</label>
              <input type="number" step="any" value={bufferLng} onChange={e => setBufferLng(e.target.value)}
                className="w-28 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Radio (km)</label>
              <input type="number" step="0.1" value={bufferRadius} onChange={e => setBufferRadius(e.target.value)}
                className="w-20 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </div>
            <button onClick={runBuffer}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">Analizar</button>
          </div>
        )}

        {toolResults && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <h4 className="mb-2 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Resultados</h4>
            <pre className="max-h-60 overflow-auto text-xs text-neutral-600 dark:text-neutral-400">{JSON.stringify(toolResults, null, 2)}</pre>
          </div>
        )}
      </motion.div>

      <motion.div variants={item} className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
        <h2 className="mb-4 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Consulta Espacial</h2>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Capa</label>
            <select value={queryLayer} onChange={e => setQueryLayer(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
              <option value="">Seleccionar...</option>
              {LAYERS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Tipo</label>
            <select value={queryType} onChange={e => setQueryType(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100">
              <option value="intersects">Interseca</option>
              <option value="within">Dentro de</option>
              <option value="near">Cerca de</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs font-medium text-neutral-500">Geometría (GeoJSON)</label>
            <textarea value={queryGeometry} onChange={e => setQueryGeometry(e.target.value)} rows={2} placeholder='{"type":"Point","coordinates":[-78.5,-1.5]}'
              className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-mono dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
          </div>
          <button onClick={runSpatialQuery}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"><Search size={16} /> Consultar</button>
        </div>
        {toolResults && (
          <div className="mt-4 rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <pre className="max-h-60 overflow-auto text-xs text-neutral-600 dark:text-neutral-400">{JSON.stringify(toolResults, null, 2)}</pre>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
