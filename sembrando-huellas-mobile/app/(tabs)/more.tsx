import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/stores/authStore';
import { useOfflineStore } from '@/src/stores/offlineStore';
import { t } from '@/src/i18n';

const MENU_ITEMS = [
  { section: t('tabs.more'), items: [
    { label: 'Centro IA', icon: '🤖', route: '/ai-center' },
    { label: t('tabs.map'), icon: '🗺️', route: '/map' },
    { label: 'Observatorio', icon: '🔭', route: '/observatory' },
    { label: t('tabs.species'), icon: '🌿', route: '/species' },
  ]},
  { section: 'Contenido', items: [
    { label: 'Programas', icon: '📋', route: '/programs' },
    { label: 'Proyectos', icon: '📋', route: '/projects' },
    { label: 'Eventos', icon: '📅', route: '/events' },
    { label: 'Biblioteca', icon: '📚', route: '/library' },
    { label: 'Galería', icon: '🖼️', route: '/gallery' },
    { label: 'Cursos', icon: '🎓', route: '/courses' },
    { label: 'Voluntariado', icon: '🤝', route: '/volunteering' },
  ]},
  { section: 'Perfil', items: [
    { label: 'Mi Perfil', icon: '👤', route: '/profile' },
    { label: 'Configuración', icon: '⚙️', route: '/settings' },
  ]},
];

export default function MoreScreen() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const pendingSync = useOfflineStore((s) => s.syncQueue.length);

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <View className="px-4 pt-12 pb-3">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('tabs.more')}</Text>
      </View>

      {pendingSync > 0 && (
        <View className="mx-4 mb-4 rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
          <Text className="text-sm font-medium text-amber-800 dark:text-amber-200">
            🔄 {pendingSync} elemento(s) pendiente(s) de sincronización
          </Text>
        </View>
      )}

      {MENU_ITEMS.map((section) => (
        <View key={section.section} className="mb-6">
          <Text className="px-4 mb-2 text-xs font-semibold uppercase text-neutral-400">{section.section}</Text>
          {section.items.map((item) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                if (item.route === '/profile' && !isAuthenticated) {
                  router.push('/(auth)/login');
                } else {
                  router.push(item.route as any);
                }
              }}
              className="mx-4 mb-1 flex-row items-center rounded-xl bg-white px-4 py-3.5 dark:bg-neutral-800"
            >
              <Text className="mr-3 text-xl">{item.icon}</Text>
              <Text className="flex-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">{item.label}</Text>
              <Text className="text-neutral-300">›</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}

      <View className="h-12" />
    </ScrollView>
  );
}
