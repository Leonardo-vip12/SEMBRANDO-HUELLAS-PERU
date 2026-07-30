import { View, Text, TouchableOpacity } from 'react-native';
import { t } from '@/src/i18n';

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Text className="mb-2 text-4xl">⚠️</Text>
      <Text className="mb-1 text-center text-base font-medium text-neutral-900 dark:text-neutral-100">
        {message || t('common.error')}
      </Text>
      <Text className="mb-4 text-center text-sm text-neutral-400">
        {t('common.tryAgain')}
      </Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} className="rounded-xl bg-primary-500 px-6 py-3">
          <Text className="font-medium text-white">{t('common.retry')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
