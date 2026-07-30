import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { libraryService } from '@/src/services/api';
import { Header } from '@/src/components/ui/Header';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { useOfflineStore } from '@/src/stores/offlineStore';

export default function LibraryScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['library'], queryFn: () => libraryService.list() });
  const resources = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Biblioteca" subtitle="Recursos educativos" showBack />
      <FlatList
        data={resources}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View className="mx-4 mb-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">
                {item.type === 'pdf' ? '📄' : item.type === 'infographic' ? '📊' : item.type === 'video' ? '🎬' : item.type === 'guide' ? '📖' : '📁'}
              </Text>
              <View className="flex-1">
                <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.title}</Text>
                {item.description && <Text className="text-xs text-neutral-400 line-clamp-1">{item.description}</Text>}
                <Text className="text-xs text-neutral-400 capitalize mt-0.5">{item.type}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📚" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
