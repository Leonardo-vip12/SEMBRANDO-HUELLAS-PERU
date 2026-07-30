import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '@/src/services/api';
import { Header } from '@/src/components/ui/Header';
import { EmptyState } from '@/src/components/ui/EmptyState';

export default function ProjectsScreen() {
  const router = useRouter();
  const { data, isLoading } = useQuery({ queryKey: ['projects'], queryFn: () => projectsService.list() });
  const projects = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Proyectos" showBack />
      <FlatList
        data={projects}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <TouchableOpacity onPress={() => router.push(`/projects/${item.slug}`)}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{item.name}</Text>
              {item.description && <Text className="mt-1 text-xs text-neutral-500 line-clamp-2">{item.description}</Text>}
              <View className="mt-2 flex-row items-center gap-3">
                {item.location && <Text className="text-xs text-neutral-400">📍 {item.location}</Text>}
                {item.status && <Text className="text-xs text-primary-500 capitalize">{item.status}</Text>}
              </View>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📋" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
