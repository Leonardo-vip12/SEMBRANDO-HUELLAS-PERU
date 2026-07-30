import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Header } from '@/src/components/ui/Header';
import { Card } from '@/src/components/ui/Card';
import { EmptyState } from '@/src/components/ui/EmptyState';

const MOCK_COURSES = [
  { id: '1', title: 'Introducción a la Biodiversidad Peruana', description: 'Conoce la increíble diversidad de especies del Perú.', duration: '4 semanas', level: 'Básico', progress: 0 },
  { id: '2', title: 'Conservación de Ecosistemas', description: 'Aprende sobre estrategias de conservación ambiental.', duration: '6 semanas', level: 'Intermedio', progress: 0 },
  { id: '3', title: 'Ciencia Ciudadana', description: 'Cómo participar en investigaciones científicas desde casa.', duration: '3 semanas', level: 'Básico', progress: 0 },
];

export default function CoursesScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Cursos" subtitle="Educación ambiental" showBack />
      <FlatList
        data={MOCK_COURSES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="px-4 mb-3">
            <TouchableOpacity onPress={() => router.push(`/courses/${item.id}`)}
              className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
              <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{item.title}</Text>
              <Text className="mt-1 text-xs text-neutral-500 line-clamp-2">{item.description}</Text>
              <View className="mt-3 flex-row items-center gap-3">
                <Text className="text-xs text-neutral-400">📚 {item.duration}</Text>
                <Text className="text-xs text-neutral-400">📊 {item.level}</Text>
              </View>
              {item.progress > 0 && (
                <View className="mt-2 h-1.5 w-full rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <View className="h-1.5 rounded-full bg-primary-500" style={{ width: `${item.progress}%` }} />
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={<EmptyState icon="🎓" />}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}
