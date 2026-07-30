import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useSettingsStore } from '@/src/stores/settingsStore';
import { useOfflineStore } from '@/src/stores/offlineStore';
import { Header } from '@/src/components/ui/Header';
import { t } from '@/src/i18n';

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

export default function SettingsScreen() {
  const { locale, darkMode, notificationsEnabled, setLocale, setDarkMode, setNotifications, setOfflineMode, offlineMode } = useSettingsStore();
  const syncQueue = useOfflineStore((s) => s.syncQueue);

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title={t('tabs.settings')} showBack />

      <View className="px-4 mb-6">
        <Text className="mb-2 text-xs font-semibold uppercase text-neutral-400 px-1">{t('settings.appearance')}</Text>
        <View className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-700">
            <Text className="text-sm text-neutral-700 dark:text-neutral-300">{t('settings.darkMode')}</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} trackColor={{ false: '#d4d4d4', true: '#10b981' }} />
          </View>
          <View className="px-4 py-3">
            <Text className="mb-2 text-sm text-neutral-700 dark:text-neutral-300">{t('settings.language')}</Text>
            <View className="flex-row gap-2">
              {LANGUAGES.map((lang) => (
                <TouchableOpacity key={lang.value} onPress={() => setLocale(lang.value as any)}
                  className={`rounded-full px-4 py-2 ${locale === lang.value ? 'bg-primary-500' : 'border border-neutral-200 dark:border-neutral-700'}`}>
                  <Text className={`text-xs font-medium ${locale === lang.value ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className="px-4 mb-6">
        <Text className="mb-2 text-xs font-semibold uppercase text-neutral-400 px-1">{t('settings.notifications')}</Text>
        <View className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <View className="flex-row items-center justify-between px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-700">
            <Text className="text-sm text-neutral-700 dark:text-neutral-300">{t('settings.notifications')}</Text>
            <Switch value={notificationsEnabled} onValueChange={setNotifications} trackColor={{ false: '#d4d4d4', true: '#10b981' }} />
          </View>
          <View className="flex-row items-center justify-between px-4 py-3.5">
            <View>
              <Text className="text-sm text-neutral-700 dark:text-neutral-300">{t('settings.offlineMode')}</Text>
              <Text className="text-xs text-neutral-400">{syncQueue.length} pendientes</Text>
            </View>
            <Switch value={offlineMode} onValueChange={setOfflineMode} trackColor={{ false: '#d4d4d4', true: '#10b981' }} />
          </View>
        </View>
      </View>

      <View className="px-4 mb-8">
        <Text className="mb-2 text-xs font-semibold uppercase text-neutral-400 px-1">Información</Text>
        <View className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <View className="px-4 py-3.5 border-b border-neutral-100 dark:border-neutral-700">
            <Text className="text-xs text-neutral-400">Versión</Text>
            <Text className="text-sm text-neutral-900 dark:text-neutral-100">1.0.0</Text>
          </View>
          <View className="px-4 py-3.5">
            <Text className="text-xs text-neutral-400">Organización</Text>
            <Text className="text-sm text-neutral-900 dark:text-neutral-100">Sembrando Huellas Perú</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
