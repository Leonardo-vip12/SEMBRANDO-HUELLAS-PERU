import { useState, useMemo } from 'react';
import { MapPin, TreePine, Bird, Search, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import projectsData from '@/data/json/projects.json';
import speciesData from '@/data/json/species.json';
import eventsData from '@/data/json/events.json';

interface MapLocation {
  id: string;
  name: string;
  description: string;
  type: 'project' | 'species' | 'event';
  region: string;
  coordinates: { lat: number; lng: number };
  image?: string;
  url: string;
}

const typeColors: Record<string, string> = {
  project: 'bg-green-500',
  species: 'bg-amber-500',
  event: 'bg-blue-500',
};

const typeIcons: Record<string, React.ReactNode> = {
  project: <TreePine size={14} className="text-white" />,
  species: <Bird size={14} className="text-white" />,
  event: <MapPin size={14} className="text-white" />,
};

function generateLocations(): MapLocation[] {
  const projects = (projectsData as any[]).map((p) => ({
    id: p.id,
    name: p.title,
    description: p.description?.slice(0, 100) ?? '',
    type: 'project' as const,
    region: p.region ?? 'Amazonía Peruana',
    coordinates: p.coordinates ?? { lat: -12.5 + Math.random() * 5, lng: -70 + Math.random() * 5 },
    image: p.coverImage,
    url: `/proyectos/${p.slug}`,
  }));

  const species = (speciesData as any[]).map((s) => ({
    id: s.id,
    name: s.name,
    description: s.habitat ?? '',
    type: 'species' as const,
    region: s.region ?? 'Amazonía Peruana',
    coordinates: { lat: -12 + Math.random() * 4, lng: -71 + Math.random() * 4 },
    image: s.image,
    url: `/especies/${s.slug}`,
  }));

  const events = (eventsData as any[]).map((e) => ({
    id: e.id,
    name: e.title,
    description: e.location ?? '',
    type: 'event' as const,
    region: e.location ?? 'Perú',
    coordinates: { lat: -11.5 + Math.random() * 3, lng: -72 + Math.random() * 4 },
    image: e.coverImage,
    url: `/calendario`,
  }));

  return [...projects, ...species, ...events];
}

export default function InteractiveMap() {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<MapLocation | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const locations = useMemo(() => generateLocations(), []);

  const filtered = useMemo(() => {
    let result = locations;
    if (filter !== 'all') result = result.filter((l) => l.type === filter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((l) => l.name.toLowerCase().includes(q) || l.region.toLowerCase().includes(q));
    }
    return result;
  }, [filter, searchQuery, locations]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900">
      <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap gap-2">
        <div className="flex items-center gap-1 rounded-lg bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur dark:bg-neutral-800/90">
          <Search size={14} className="text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar en el mapa..."
            className="w-40 bg-transparent text-sm text-neutral-900 outline-none placeholder-neutral-400 dark:text-neutral-100"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')}>
              <X size={14} className="text-neutral-400" />
            </button>
          )}
        </div>

        {['all', 'project', 'species', 'event'].map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setSelected(null); }}
            className={cn(
              'rounded-lg px-3 py-1.5 text-xs font-medium backdrop-blur transition-colors',
              filter === f
                ? 'bg-primary-600 text-white'
                : 'bg-white/90 text-neutral-600 hover:bg-white dark:bg-neutral-800/90 dark:text-neutral-400',
            )}
          >
            {f === 'all' ? 'Todos' : f === 'project' ? 'Proyectos' : f === 'species' ? 'Especies' : 'Eventos'}
          </button>
        ))}

        <span className="ml-auto rounded-lg bg-white/90 px-2 py-1 text-xs text-neutral-500 backdrop-blur dark:bg-neutral-800/90">
          {filtered.length} marcadores
        </span>
      </div>

      <div className="relative h-[500px] w-full bg-gradient-to-br from-green-100 via-emerald-50 to-blue-100 dark:from-green-950/30 dark:via-emerald-900/20 dark:to-blue-950/30">
        <svg className="h-full w-full" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid meet">
          <defs>
            <radialGradient id="marker-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="800" height="500" fill="none" />

          {filtered.map((loc) => {
            const x = ((loc.coordinates.lng + 75) / 10) * 800;
            const y = ((loc.coordinates.lat + 15) / 10) * 500;
            const isSelected = selected?.id === loc.id;
            const color = typeColors[loc.type];

            return (
              <g key={`${loc.type}-${loc.id}`} className="cursor-pointer" onClick={() => setSelected(isSelected ? null : loc)}>
                {isSelected && (
                  <circle cx={x} cy={y} r={24} fill="currentColor" opacity={0.15} className={color.replace('bg-', 'text-')} />
                )}
                <circle cx={x} cy={y} r={isSelected ? 10 : 7} className={cn(color, 'transition-all duration-200')} />
                <circle cx={x} cy={y} r={isSelected ? 10 : 7} fill="white" className={cn('opacity-30', 'transition-all duration-200')} />
                <text x={x} y={y + 4} textAnchor="middle" fill="white" fontSize={10} fontWeight="bold" className="pointer-events-none">
                  {typeIcons[loc.type] ? '●' : ''}
                </text>
                {isSelected && (
                  <>
                    <rect x={x - 80} y={y - 50} width={160} height={30} rx={6} fill="white" className="shadow-lg" />
                    <text x={x} y={y - 30} textAnchor="middle" fill="#333" fontSize={11} fontWeight="medium">
                      {loc.name.length > 25 ? loc.name.slice(0, 25) + '...' : loc.name}
                    </text>
                  </>
                )}
              </g>
            );
          })}
        </svg>

        <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-4 rounded-lg bg-white/80 px-3 py-2 text-xs text-neutral-500 backdrop-blur dark:bg-neutral-800/80">
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" /> Proyectos</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" /> Especies</span>
          <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-full bg-blue-500" /> Eventos</span>
        </div>
      </div>

      {selected && (
        <div className="border-t border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full', typeColors[selected.type])}>
                  {typeIcons[selected.type]}
                </span>
                <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{selected.name}</h4>
              </div>
              <p className="mt-1 text-sm text-neutral-500">{selected.description}</p>
              <p className="mt-1 text-xs text-neutral-400">{selected.region}</p>
            </div>
            <button
              onClick={() => setSelected(null)}
              className="rounded p-1 text-neutral-400 hover:text-neutral-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
