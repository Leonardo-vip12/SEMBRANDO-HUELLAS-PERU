import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '@/src/services/api';
import { Header } from '@/src/components/ui/Header';
import { EmptyState } from '@/src/components/ui/EmptyState';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

export default function GalleryScreen() {
  const { data, isLoading } = useQuery({ queryKey: ['gallery'], queryFn: () => galleryService.list() });
  const images = data?.data || [];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Galería" showBack />
      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={(item: any) => item.id}
        columnWrapperClassName="gap-3 px-4"
        renderItem={({ item }) => (
          <View className="mb-3 overflow-hidden rounded-xl bg-white dark:bg-neutral-800" style={{ width: COLUMN_WIDTH }}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} resizeMode="cover" />
            ) : (
              <View style={{ width: COLUMN_WIDTH, height: COLUMN_WIDTH }} className="items-center justify-center bg-neutral-100 dark:bg-neutral-700">
                <Text className="text-3xl">🖼️</Text>
              </View>
            )}
            <View className="p-2">
              <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100" numberOfLines={1}>{item.title}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="🖼️" />}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}
