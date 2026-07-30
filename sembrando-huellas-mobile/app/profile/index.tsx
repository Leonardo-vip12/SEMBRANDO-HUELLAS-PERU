import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';
import { useGamificationStore } from '@/src/stores/gamificationStore';
import { useOfflineStore } from '@/src/stores/offlineStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { xp, level, badges } = useGamificationStore();
  const { favorites } = useOfflineStore();

  if (!isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-8">
        <Text className="text-5xl mb-4">👤</Text>
        <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">Inicia sesión</Text>
        <Text className="text-sm text-neutral-400 text-center mb-6">Accede a tu perfil, certificados y más</Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}
          className="rounded-xl bg-primary-500 px-8 py-3">
          <Text className="font-medium text-white">Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="items-center pt-12 pb-6 px-4">
        <View className="mb-3 h-20 w-20 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          <Text className="text-3xl">{user?.name?.[0] || '👤'}</Text>
        </View>
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{user?.name || 'Usuario'}</Text>
        <Text className="text-sm text-neutral-400">{user?.email}</Text>

        <View className="mt-4 flex-row gap-6">
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-500">{level}</Text>
            <Text className="text-xs text-neutral-400">Nivel</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-500">{xp}</Text>
            <Text className="text-xs text-neutral-400">XP</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-500">{badges.length}</Text>
            <Text className="text-xs text-neutral-400">Insignias</Text>
          </View>
        </View>
      </View>

      <View className="px-4 mb-6">
        <Text className="mb-2 text-xs font-semibold uppercase text-neutral-400 px-1">Mi Actividad</Text>
        <View className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          {[
            { label: 'Favoritos', value: favorites.length, icon: '❤️' },
            { label: 'Certificados', value: 0, icon: '🎓' },
            { label: 'Observaciones', value: 0, icon: '🔭' },
            { label: 'Cursos completados', value: 0, icon: '📚' },
          ].map((item, i) => (
            <View key={i} className={`flex-row items-center justify-between px-4 py-3.5 ${i < 3 ? 'border-b border-neutral-100 dark:border-neutral-700' : ''}`}>
              <View className="flex-row items-center gap-3">
                <Text>{item.icon}</Text>
                <Text className="text-sm text-neutral-700 dark:text-neutral-300">{item.label}</Text>
              </View>
              <Text className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {badges.length > 0 && (
        <View className="px-4 mb-6">
          <Text className="mb-2 text-xs font-semibold uppercase text-neutral-400 px-1">Insignias</Text>
          <View className="flex-row flex-wrap gap-2">
            {badges.map((badge) => (
              <View key={badge.id} className="rounded-xl border border-neutral-200 bg-white p-3 items-center dark:border-neutral-700 dark:bg-neutral-800">
                <Text className="text-2xl mb-1">🏅</Text>
                <Text className="text-xs font-medium text-neutral-900 dark:text-neutral-100">{badge.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View className="px-4 mb-8">
        <TouchableOpacity onPress={logout}
          className="flex-row items-center justify-center rounded-xl border border-red-200 bg-red-50 py-3.5 dark:border-red-800 dark:bg-red-900/20">
          <Text className="font-medium text-red-600 dark:text-red-400">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
