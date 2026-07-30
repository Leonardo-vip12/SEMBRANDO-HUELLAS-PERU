import { View, Text, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { eisService, projectsService, eventsService } from '@/src/services/api';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { t } from '@/src/i18n';

type MapLayer = 'projects' | 'events' | 'observations' | 'species';

const LAYERS: { key: MapLayer; label: string; icon: string }[] = [
  { key: 'projects', label: 'Proyectos', icon: '📋' },
  { key: 'events', label: 'Eventos', icon: '📅' },
  { key: 'observations', label: 'Observaciones', icon: '🔭' },
  { key: 'species', label: 'Especies', icon: '🌿' },
];

export default function MapScreen() {
  const [activeLayer, setActiveLayer] = useState<MapLayer>('projects');
  const { data: projectsData } = useQuery({ queryKey: ['projects', 'map'], queryFn: () => projectsService.list() });
  const { data: eventsData } = useQuery({ queryKey: ['events', 'map'], queryFn: () => eventsService.list() });
  const { data: obsData } = useQuery({ queryKey: ['observations', 'map'], queryFn: () => eisService.observatoryMapData() });

  const markers = activeLayer === 'projects' ? (projectsData?.data || []) :
    activeLayer === 'events' ? (eventsData?.data || []) :
    activeLayer === 'observations' ? (obsData?.data || []) :
    [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="px-4 pt-12 pb-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('tabs.map')}</Text>
        </View>
      </View>

      <View className="px-4 mb-3 flex-row gap-2">
        {LAYERS.map((l) => (
          <TouchableOpacity key={l.key} onPress={() => setActiveLayer(l.key)}
            className={`rounded-full px-3 py-1.5 flex-row items-center gap-1 ${activeLayer === l.key ? 'bg-primary-500' : 'bg-white border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700'}`}>
            <Text>{l.icon}</Text>
            <Text className={`text-xs font-medium ${activeLayer === l.key ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>{l.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="mx-4 flex-1 rounded-xl border border-neutral-200 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 items-center justify-center">
        <Text className="mb-2 text-5xl">🗺️</Text>
        <Text className="text-sm font-medium text-neutral-500">{t('common.map')}</Text>
        <Text className="mt-1 text-xs text-neutral-400">
          {markers.length} {activeLayer === 'observations' ? 'observaciones' :
            activeLayer === 'projects' ? 'proyectos' :
            activeLayer === 'events' ? 'eventos' : 'especies'} en el mapa
        </Text>
        <View className="mt-4 w-full px-4">
          {markers.slice(0, 5).map((m: any, i: number) => (
            <View key={i} className="mb-2 rounded-lg bg-white p-3 dark:bg-neutral-700">
              <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{m.name || m.title || m.speciesName || 'Sin nombre'}</Text>
              {m.latitude && m.longitude && (
                <Text className="text-xs text-neutral-400">{m.latitude.toFixed(4)}, {m.longitude.toFixed(4)}</Text>
              )}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
