import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { eventsService } from '@/src/services/api';
import { EventCard } from '@/src/components/shared/EventCard';
import { Header } from '@/src/components/ui/Header';
import { EmptyState } from '@/src/components/ui/EmptyState';

export default function EventsScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['events'], queryFn: () => eventsService.list() });
  const events = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Eventos" showBack />
      <FlatList
        data={events}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-2">
            <EventCard
              title={item.title}
              description={item.description}
              date={item.date}
              location={item.location}
              type={item.type}
              onPress={() => {}}
            />
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="📅" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
