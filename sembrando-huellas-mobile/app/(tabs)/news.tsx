import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/src/services/api';
import { NewsCard } from '@/src/components/shared/NewsCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { t } from '@/src/i18n';

export default function NewsScreen() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ['news'], queryFn: () => newsService.list() });

  if (isLoading) return <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900"><ActivityIndicator size="large" color="#10b981" /></View>;
  if (error) return <ErrorMessage message={t('common.error')} onRetry={refetch} />;

  const news = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="px-4 pt-12 pb-3">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('tabs.news')}</Text>
      </View>
      <FlatList
        data={news}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <NewsCard
              title={item.title}
              excerpt={item.excerpt}
              imageUrl={item.image}
              category={item.category}
              publishedAt={item.publishedAt}
              onPress={() => router.push(`/news/${item.slug}`)}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<EmptyState icon="📰" message={t('common.noContent')} />}
      />
    </View>
  );
}
