import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-900 px-8">
      <Text className="mb-4 text-6xl">🌱</Text>
      <Text className="mb-2 text-xl font-bold text-neutral-900 dark:text-neutral-100">Página no encontrada</Text>
      <Text className="mb-6 text-sm text-neutral-400">La pantalla que buscas no existe</Text>
      <TouchableOpacity onPress={() => router.replace('/')} className="rounded-xl bg-primary-500 px-8 py-3">
        <Text className="font-medium text-white">Ir al inicio</Text>
      </TouchableOpacity>
    </View>
  );
}
