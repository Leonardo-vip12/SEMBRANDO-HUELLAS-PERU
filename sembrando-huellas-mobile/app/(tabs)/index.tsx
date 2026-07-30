import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/src/stores/authStore';
import { useOfflineStore } from '@/src/stores/offlineStore';
import { newsService, eventsService, projectsService, eisService } from '@/src/services/api';
import { NewsCard } from '@/src/components/shared/NewsCard';
import { EventCard } from '@/src/components/shared/EventCard';
import { Card } from '@/src/components/ui/Card';
import { t } from '@/src/i18n';

const QUICK_ACCESS = [
  { label: 'Identificar', icon: '📷', route: '/ai-center/identify', color: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Observatorio', icon: '🔭', route: '/observatory', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Tutor IA', icon: '🤖', route: '/ai-center/tutor', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Mapa', icon: '🗺️', route: '/map', color: 'bg-amber-100 dark:bg-amber-900/30' },
  { label: 'Cursos', icon: '📚', route: '/courses', color: 'bg-red-100 dark:bg-red-900/30' },
  { label: 'Eventos', icon: '📅', route: '/events', color: 'bg-indigo-100 dark:bg-indigo-900/30' },
];

export default function HomeScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isOnline = useOfflineStore((s) => s.isOnline);
  const [refreshing, setRefreshing] = useState(false);

  const { data: newsData } = useQuery({ queryKey: ['news', 'featured'], queryFn: () => newsService.featured() });
  const { data: eventsData } = useQuery({ queryKey: ['events', 'upcoming'], queryFn: () => eventsService.upcoming() });
  const { data: projectsData } = useQuery({ queryKey: ['projects'], queryFn: () => projectsService.list() });

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const news = newsData?.data || [];
  const events = eventsData?.data || [];
  const projects = projectsData?.data || [];

  return (
    <ScrollView
      className="flex-1 bg-neutral-50 dark:bg-neutral-900"
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="px-4 pt-12 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-xs text-neutral-400">{t('common.welcome')}</Text>
            <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
              {user?.name || t('home.guest')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push(isAuthenticated ? '/profile' : '/(auth)/login')}
            className="h-10 w-10 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30"
          >
            <Text className="text-lg">{user ? '👤' : '🔑'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="px-4 mb-6">
        <Text className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t('home.quickAccess')}</Text>
        <View className="flex-row flex-wrap gap-3">
          {QUICK_ACCESS.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => router.push(item.route as any)}
              className={`${item.color} rounded-xl px-4 py-3 flex-row items-center gap-2`}
            >
              <Text className="text-xl">{item.icon}</Text>
              <Text className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {news.length > 0 && (
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t('home.latestNews')}</Text>
            <TouchableOpacity onPress={() => router.push('/news')}>
              <Text className="text-xs text-primary-500">{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <NewsCard
            title={news[0].title}
            excerpt={news[0].excerpt}
            imageUrl={news[0].image}
            category={news[0].category}
            publishedAt={news[0].publishedAt}
            onPress={() => router.push(`/news/${news[0].slug}`)}
          />
        </View>
      )}

      {events.length > 0 && (
        <View className="px-4 mb-6">
          <Text className="mb-3 text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t('home.upcomingEvents')}</Text>
          {events.slice(0, 3).map((event: any) => (
            <View key={event.id} className="mb-2">
              <EventCard
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                type={event.type}
                onPress={() => router.push('/events')}
              />
            </View>
          ))}
        </View>
      )}

      {projects.length > 0 && (
        <View className="px-4 mb-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">{t('home.activeProjects')}</Text>
            <TouchableOpacity onPress={() => router.push('/projects')}>
              <Text className="text-xs text-primary-500">{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-4 px-4">
            {projects.slice(0, 5).map((project: any) => (
              <TouchableOpacity
                key={project.id}
                onPress={() => router.push(`/projects/${project.slug}`)}
                className="mr-3 w-48 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800"
              >
                <Text className="text-base">{project.image ? '📋' : '📋'}</Text>
                <Text className="mt-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">{project.name}</Text>
                <Text className="mt-1 text-xs text-neutral-400 line-clamp-2">{project.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View className="px-4 pb-8">
        {!isOnline && (
          <View className="rounded-xl bg-amber-100 p-4 dark:bg-amber-900/30">
            <Text className="text-sm font-medium text-amber-800 dark:text-amber-200">{t('offline.mode')}</Text>
            <Text className="text-xs text-amber-600 dark:text-amber-300">{t('offline.description')}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
