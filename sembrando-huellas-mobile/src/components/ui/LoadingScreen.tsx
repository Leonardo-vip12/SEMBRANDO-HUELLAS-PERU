import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <ActivityIndicator size="large" color="#10b981" />
      <Text className="mt-3 text-sm text-neutral-400">{message}</Text>
    </View>
  );
}
