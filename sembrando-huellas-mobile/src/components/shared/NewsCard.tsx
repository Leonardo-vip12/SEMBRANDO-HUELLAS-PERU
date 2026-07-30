import { View, Text, TouchableOpacity, Image } from 'react-native';
import { formatRelativeTime } from '@/src/utils/formatting';

interface NewsCardProps {
  title: string;
  excerpt?: string;
  imageUrl?: string;
  category?: string;
  publishedAt: string;
  onPress: () => void;
}

export function NewsCard({ title, excerpt, imageUrl, category, publishedAt, onPress }: NewsCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 overflow-hidden">
      {imageUrl && (
        <Image source={{ uri: imageUrl }} className="h-36 w-full" resizeMode="cover" />
      )}
      <View className="p-4">
        <View className="flex-row items-center gap-2 mb-1">
          {category && (
            <Text className="text-xs font-medium text-primary-500 uppercase">{category}</Text>
          )}
          <Text className="text-xs text-neutral-400">{formatRelativeTime(publishedAt)}</Text>
        </View>
        <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100" numberOfLines={2}>{title}</Text>
        {excerpt && <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{excerpt}</Text>}
      </View>
    </TouchableOpacity>
  );
}
