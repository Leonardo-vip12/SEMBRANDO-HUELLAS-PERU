import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { speciesService } from '@/src/services/api';
import { getConservationStatusColor, getConservationStatusLabel } from '@/src/utils/formatting';
import { useOfflineStore } from '@/src/stores/offlineStore';

export default function SpeciesDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, isLoading } = useQuery({ queryKey: ['species', slug], queryFn: () => speciesService.getBySlug(slug), enabled: !!slug });
  const { addFavorite, removeFavorite, isFavorite } = useOfflineStore();

  if (isLoading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" color="#10b981" /></View>;

  const species = data?.data || data;
  const saved = species?.id ? isFavorite(species.id) : false;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
      <Stack.Screen options={{ headerShown: true, title: species?.name || '', headerBackTitle: 'Atrás',
        headerRight: () => species?.id ? (
          <TouchableOpacity onPress={() => saved ? removeFavorite(species.id) : addFavorite(species.id)}>
            <Text className="text-2xl">{saved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
        ) : null
      }} />
      {species?.image && <Image source={{ uri: species.image }} className="h-56 w-full" resizeMode="cover" />}
      <View className="p-4">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{species?.name}</Text>
        {species?.scientificName && <Text className="text-sm italic text-neutral-400">{species.scientificName}</Text>}

        {species?.conservationStatus && (
          <View className="mt-3 self-start rounded-full px-3 py-1" style={{ backgroundColor: getConservationStatusColor(species.conservationStatus) + '20' }}>
            <Text className="text-xs font-medium" style={{ color: getConservationStatusColor(species.conservationStatus) }}>
              {getConservationStatusLabel(species.conservationStatus)}
            </Text>
          </View>
        )}

        {species?.description && <Text className="mt-4 text-sm leading-6 text-neutral-700 dark:text-neutral-300">{species.description}</Text>}
        {species?.habitat && <Text className="mt-4 text-sm text-neutral-600 dark:text-neutral-400"><Text className="font-medium">Hábitat:</Text> {species.habitat}</Text>}
        {species?.distribution && <Text className="mt-2 text-sm text-neutral-600 dark:text-neutral-400"><Text className="font-medium">Distribución:</Text> {species.distribution}</Text>}
      </View>
    </ScrollView>
  );
}
