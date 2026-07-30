import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Search, MapPin, AlertTriangle, Grid3X3, Globe, Mountain, Droplets, Trees, Leaf, Building2 } from 'lucide-react';
import { SiaService } from '../services/sia';
import { cn } from '@/lib/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const LAYER_ICONS: Record<string, React.ElementType> = {
  vegetation: Trees,
  hydrology: Droplets,
  topography: Mountain,
  climate: Globe,
  land_use: Grid3X3,
  species: Leaf,
  infrastructure: Building2,
};

const LAYER_COLORS: Record<string, string> = {
  vegetation: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  hydrology: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  topography: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  climate: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
  land_use: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  species: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
  infrastructure: 'bg-neutral-50 text-neutral-600 dark:bg-neutral-900/20 dark:text-neutral-400',
};

interface Layer {
  id: string;
  name: string;
  description: string;
  count: number;
  color: string;
}

interface SearchResult {
  id: string;
  name: string;
  type: string;
  coordinates: { lat: number; lng: number };
}

interface LegendItem {
  label: string;
  color: string;
  value?: string;
}

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-neutral-200 border-t-primary-600" />
    </div>
  );
}

export default function SiaMapsPage() {
  const [layers, setLayers] = useState<Layer[]>([]);
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);
  const [layerData, setLayerData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [legend, setLegend] = useState<LegendItem[]>([]);

  useEffect(() => {
    const fetchLayers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [layersResult, legendResult] = await Promise.all([
          SiaService.getLayers(),
          SiaService.getMapLegend(),
        ]);
        setLayers(layersResult?.data || []);
        setLegend(legendResult?.data || []);
      } catch (err: any) {
        setError(err?.message || 'Error al cargar capas del mapa');
      } finally {
        setLoading(false);
      }
    };
    fetchLayers();
  }, []);

  const handleLayerSelect = async (layerId: string) => {
    setSelectedLayer(layerId);
    setLayerData(null);
    try {
      const result = await SiaService.getLayerData(layerId);
      setLayerData(result?.data || []);
    } catch {
      setLayerData([]);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const result = await SiaService.searchLocation(searchQuery);
      setSearchResults(result?.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  if (error) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
        <AlertTriangle size={48} className="mb-4 text-red-400" />
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Error al cargar mapas</h2>
        <p className="mt-1 text-sm text-neutral-500">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">Reintentar</button>
      </motion.div>
    );
  }

  const selectedLayerMeta = layers.find((l) => l.id === selectedLayer);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Mapas Temáticos</h1>
        <p className="mt-1 text-sm text-neutral-500">Visualización geoespacial de capas ambientales del sistema</p>
      </motion.div>

      <div className="flex flex-wrap items-start gap-4">
        <motion.div variants={itemVariants} className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap gap-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-28 animate-pulse rounded-lg bg-neutral-200 dark:bg-neutral-700" />
              ))
            ) : (
              layers.map((layer) => {
                const Icon = LAYER_ICONS[layer.id] || Map;
                return (
                  <button
                    key={layer.id}
                    onClick={() => handleLayerSelect(layer.id)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all',
                      selectedLayer === layer.id
                        ? 'border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700',
                    )}
                  >
                    <Icon size={16} />
                    {layer.name}
                    <span className="ml-1 rounded-full bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-600">
                      {layer.count ?? 0}
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {selectedLayer && selectedLayerMeta && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selectedLayerMeta.name}</h3>
                  <p className="text-sm text-neutral-500">{selectedLayerMeta.description}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <MapPin size={14} />
                  {layerData ? `${layerData.length} registros` : 'Cargando...'}
                </div>
              </div>
              {layerData && layerData.length > 0 ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {layerData.slice(0, 20).map((item: any, i: number) => (
                    <div key={i} className="rounded-lg border border-neutral-100 bg-neutral-50 p-3 text-sm dark:border-neutral-600 dark:bg-neutral-700/50">
                      <p className="font-medium text-neutral-800 dark:text-neutral-200">{item.name || `Elemento ${i + 1}`}</p>
                      {item.region && <p className="text-xs text-neutral-500">{item.region}</p>}
                    </div>
                  ))}
                </div>
              ) : layerData && layerData.length === 0 ? (
                <div className="flex h-24 items-center justify-center text-sm text-neutral-400">No hay datos disponibles para esta capa</div>
              ) : (
                <Spinner />
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="w-full space-y-4 lg:w-72">
          <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Búsqueda Geográfica</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ciudad, región..."
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="rounded-lg bg-primary-600 p-2 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                <Search size={16} />
              </button>
            </div>
            {searching && <Spinner />}
            {searchResults.length > 0 && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-medium text-neutral-500">Resultados</p>
                {searchResults.map((result) => (
                  <div key={result.id} className="rounded-lg border border-neutral-100 bg-neutral-50 p-2.5 text-sm dark:border-neutral-600 dark:bg-neutral-700/50">
                    <div className="flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                      <MapPin size={12} className="text-primary-600" />
                      {result.name}
                    </div>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {result.type} · {result.coordinates.lat.toFixed(4)}, {result.coordinates.lng.toFixed(4)}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {searchResults.length === 0 && !searching && searchQuery && (
              <p className="mt-3 text-xs text-neutral-400">Sin resultados para "{searchQuery}"</p>
            )}
          </div>

          {legend.length > 0 && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <h4 className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-100">Leyenda</h4>
              <div className="space-y-2">
                {legend.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-neutral-600 dark:text-neutral-400">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Capas Disponibles</h2>
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {layers.map((layer) => {
              const Icon = LAYER_ICONS[layer.id] || Map;
              const colorClass = LAYER_COLORS[layer.id] || 'bg-neutral-50 text-neutral-600 dark:bg-neutral-900/20';
              return (
                <motion.button
                  key={layer.id}
                  whileHover={{ y: -2 }}
                  onClick={() => handleLayerSelect(layer.id)}
                  className={cn(
                    'flex items-start gap-4 rounded-xl border p-4 text-left transition-shadow hover:shadow-md',
                    selectedLayer === layer.id
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/10'
                      : 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800',
                  )}
                >
                  <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colorClass)}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{layer.name}</h3>
                    <p className="mt-0.5 text-xs text-neutral-500">{layer.description}</p>
                    <span className="mt-1.5 inline-block rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-400">
                      {layer.count ?? 0} registros
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
