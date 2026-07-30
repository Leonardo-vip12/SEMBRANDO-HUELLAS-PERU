import { View, Text, TouchableOpacity, Image } from 'react-native';
import { getConservationStatusColor, getConservationStatusLabel } from '@/src/utils/formatting';

interface SpeciesCardProps {
  name: string;
  scientificName?: string;
  imageUrl?: string;
  conservationStatus?: string;
  category?: string;
  onPress: () => void;
}

export function SpeciesCard({ name, scientificName, imageUrl, conservationStatus, category, onPress }: SpeciesCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 overflow-hidden">
      <View className="flex-row">
        {imageUrl ? (
          <Image source={{ uri: imageUrl }} className="h-24 w-24" resizeMode="cover" />
        ) : (
          <View className="h-24 w-24 items-center justify-center bg-primary-100 dark:bg-primary-900/30">
            <Text className="text-3xl">🌿</Text>
          </View>
        )}
        <View className="flex-1 p-3 justify-center">
          <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{name}</Text>
          {scientificName && <Text className="text-xs italic text-neutral-400">{scientificName}</Text>}
          <View className="mt-2 flex-row items-center gap-2">
            {conservationStatus && (
              <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: getConservationStatusColor(conservationStatus) + '20' }}>
                <Text className="text-xs font-medium" style={{ color: getConservationStatusColor(conservationStatus) }}>
                  {getConservationStatusLabel(conservationStatus)}
                </Text>
              </View>
            )}
            {category && (
              <Text className="text-xs text-neutral-400 capitalize">{category}</Text>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
