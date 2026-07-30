import { View, Text, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { newsService } from '@/src/services/api';
import { formatDate } from '@/src/utils/formatting';

export default function NewsDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['news', slug],
    queryFn: () => newsService.getBySlug(slug),
    enabled: !!slug,
  });

  if (isLoading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#10b981" /></View>;

  const article = data?.data || data;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
      <Stack.Screen options={{ headerShown: true, title: article?.title || '', headerBackTitle: 'Atrás' }} />
      {article?.image && <Image source={{ uri: article.image }} className="h-56 w-full" resizeMode="cover" />}
      <View className="p-4">
        <Text className="text-xs font-medium text-primary-500 uppercase mb-1">{article?.category}</Text>
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{article?.title}</Text>
        <Text className="mt-1 text-xs text-neutral-400">{article?.publishedAt ? formatDate(article.publishedAt) : ''}</Text>
        {article?.excerpt && <Text className="mt-4 text-sm font-medium text-neutral-500 italic">{article.excerpt}</Text>}
        <Text className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{article?.content}</Text>
      </View>
    </ScrollView>
  );
}
