import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/src/components/ui/Header';
import { t } from '@/src/i18n';

const AI_TOOLS = [
  { label: 'Tutor Ambiental', icon: '🤖', desc: 'Tutor IA adaptativo a tu nivel', route: '/ai-center/tutor', color: 'bg-purple-100 dark:bg-purple-900/30' },
  { label: 'Identificador', icon: '📷', desc: 'Identifica especies con IA', route: '/ai-center/identify', color: 'bg-green-100 dark:bg-green-900/30' },
  { label: 'Asistente IA', icon: '💬', desc: 'Consulta sobre el medio ambiente', route: '/ai-center/assistant', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { label: 'Analizar Documento', icon: '📄', desc: 'Resúmenes y conceptos con IA', route: '/ai-center/analyze', color: 'bg-amber-100 dark:bg-amber-900/30' },
];

export default function AICenterScreen() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title={t('tabs.aiCenter')} subtitle="Inteligencia Artificial Ambiental" showBack />
      <View className="px-4 pt-2">
        {AI_TOOLS.map((tool) => (
          <TouchableOpacity key={tool.label} onPress={() => router.push(tool.route as any)}
            className={`mb-3 flex-row items-center rounded-xl ${tool.color} p-4`}>
            <Text className="mr-4 text-3xl">{tool.icon}</Text>
            <View className="flex-1">
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{tool.label}</Text>
              <Text className="text-xs text-neutral-500 dark:text-neutral-400">{tool.desc}</Text>
            </View>
            <Text className="text-neutral-400 text-lg">›</Text>
          </TouchableOpacity>
        ))}
        <View className="mt-4 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <Text className="text-xs font-medium text-neutral-400 uppercase">{t('common.disclaimer')}</Text>
          <Text className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            {t('ai.disclaimer')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
