import { View, Text, TouchableOpacity } from 'react-native';
import { formatDate } from '@/src/utils/formatting';

interface EventCardProps {
  title: string;
  description?: string;
  date: string;
  location?: string;
  type?: string;
  onPress: () => void;
}

export function EventCard({ title, description, date, location, type, onPress }: EventCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
      <View className="flex-row items-start gap-3">
        <View className="items-center rounded-xl bg-primary-100 px-3 py-2 dark:bg-primary-900/30">
          <Text className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {new Date(date).getDate()}
          </Text>
          <Text className="text-xs font-medium text-primary-500 uppercase">
            {new Date(date).toLocaleDateString('es-PE', { month: 'short' })}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{title}</Text>
          {description && <Text className="mt-0.5 text-xs text-neutral-500 line-clamp-1">{description}</Text>}
          <View className="mt-1 flex-row items-center gap-3">
            {location && <Text className="text-xs text-neutral-400">📍 {location}</Text>}
            {type && <Text className="text-xs text-neutral-400 capitalize">{type}</Text>}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
