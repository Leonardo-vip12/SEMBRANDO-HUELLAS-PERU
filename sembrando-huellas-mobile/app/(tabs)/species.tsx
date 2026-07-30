import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { speciesService } from '@/src/services/api';
import { SpeciesCard } from '@/src/components/shared/SpeciesCard';
import { EmptyState } from '@/src/components/ui/EmptyState';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { t } from '@/src/i18n';

const CATEGORIES = [
  { key: '', label: 'Todas' },
  { key: 'mamiferos', label: 'Mamíferos' },
  { key: 'aves', label: 'Aves' },
  { key: 'reptiles', label: 'Reptiles' },
  { key: 'anfibios', label: 'Anfibios' },
  { key: 'peces', label: 'Peces' },
  { key: 'insectos', label: 'Insectos' },
  { key: 'plantas', label: 'Plantas' },
];

export default function SpeciesScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['species', category],
    queryFn: () => speciesService.list(1, 50, category || undefined),
  });

  if (isLoading) return <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900"><ActivityIndicator size="large" color="#10b981" /></View>;
  if (error) return <ErrorMessage onRetry={refetch} />;

  const species = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="px-4 pt-12 pb-2">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('tabs.species')}</Text>
        <TextInput
          value={search} onChangeText={setSearch} placeholder="Buscar especies..."
          className="mt-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
        />
      </View>
      <FlatList
        horizontal data={CATEGORIES} showsHorizontalScrollIndicator={false}
        className="px-4 mb-2 max-h-12"
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setCategory(item.key)}
            className={`mr-2 rounded-full px-4 py-1.5 ${category === item.key ? 'bg-primary-500' : 'bg-white border border-neutral-200 dark:bg-neutral-800 dark:border-neutral-700'}`}>
            <Text className={`text-xs font-medium ${category === item.key ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>{item.label}</Text>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={species.filter((s: any) => !search || s.name?.toLowerCase().includes(search.toLowerCase()) || s.scientificName?.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-2">
            <SpeciesCard
              name={item.name}
              scientificName={item.scientificName}
              imageUrl={item.image}
              conservationStatus={item.conservationStatus}
              category={item.category}
              onPress={() => router.push(`/species/${item.slug}`)}
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<EmptyState icon="🌿" />}
      />
    </View>
  );
}
