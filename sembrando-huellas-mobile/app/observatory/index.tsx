import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { eisService } from '@/src/services/api';
import { Header } from '@/src/components/ui/Header';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { t } from '@/src/i18n';

export default function ObservatoryScreen() {
  const router = useRouter();
  const { data, isLoading } = useQuery({ queryKey: ['observations'], queryFn: () => eisService.listObservations() });
  const { data: stats } = useQuery({ queryKey: ['observations-stats'], queryFn: () => eisService.observatoryStats() });

  const observations = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title={t('tabs.observatory')} subtitle="Ciencia ciudadana" showBack />
      <View className="px-4 mb-3">
        <TouchableOpacity onPress={() => router.push('/observatory/register')}
          className="flex-row items-center justify-center rounded-xl bg-primary-500 py-3.5 mb-4">
          <Text className="mr-2 text-lg">🔭</Text>
          <Text className="font-medium text-white">{t('common.register')}</Text>
        </TouchableOpacity>

        {stats && (
          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 rounded-xl bg-white p-3 items-center dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <Text className="text-xl font-bold text-primary-500">{stats.total || 0}</Text>
              <Text className="text-xs text-neutral-400">Total</Text>
            </View>
            <View className="flex-1 rounded-xl bg-white p-3 items-center dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <Text className="text-xl font-bold text-green-500">{stats.verified || 0}</Text>
              <Text className="text-xs text-neutral-400">Verificadas</Text>
            </View>
            <View className="flex-1 rounded-xl bg-white p-3 items-center dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
              <Text className="text-xl font-bold text-amber-500">{stats.pending || 0}</Text>
              <Text className="text-xs text-neutral-400">Pendientes</Text>
            </View>
          </View>
        )}
      </View>

      <FlatList
        data={observations}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View className="mx-4 mb-2 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {item.speciesName || item.scientificName || 'No identificado'}
              </Text>
              <Text className={`text-xs rounded-full px-2 py-0.5 ${
                item.status === 'VERIFIED' ? 'bg-green-100 text-green-700' :
                item.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>{item.status}</Text>
            </View>
            <Text className="mt-1 text-xs text-neutral-400">
              {item.latitude?.toFixed(4)}, {item.longitude?.toFixed(4)} • {item.quantity} individuo(s)
            </Text>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="🔭" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
