import { View, Text } from 'react-native';
import { t } from '@/src/i18n';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  message?: string;
}

export function EmptyState({ icon = '📭', title, message }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-8 py-16">
      <Text className="mb-3 text-5xl">{icon}</Text>
      <Text className="mb-1 text-center text-base font-medium text-neutral-900 dark:text-neutral-100">
        {title || t('common.empty')}
      </Text>
      <Text className="text-center text-sm text-neutral-400">
        {message || t('common.noContent')}
      </Text>
    </View>
  );
}
