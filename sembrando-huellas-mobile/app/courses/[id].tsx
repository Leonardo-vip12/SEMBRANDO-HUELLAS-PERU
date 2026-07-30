import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useState } from 'react';

const MOCK_MODULES = [
  { id: 'm1', title: 'Bienvenida', type: 'video', completed: false, duration: '10 min' },
  { id: 'm2', title: '¿Qué es la biodiversidad?', type: 'reading', completed: false, duration: '15 min' },
  { id: 'm3', title: 'Ecosistemas del Perú', type: 'reading', completed: false, duration: '20 min' },
  { id: 'm4', title: 'Evaluación Módulo 1', type: 'quiz', completed: false, duration: '10 min' },
];

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [modules] = useState(MOCK_MODULES);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-neutral-900">
      <Stack.Screen options={{ headerShown: true, title: 'Curso', headerBackTitle: 'Atrás' }} />
      <View className="p-4">
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Curso de Biodiversidad</Text>
        <Text className="mt-1 text-sm text-neutral-400">4 módulos • 55 min</Text>

        <View className="mt-6">
          <Text className="mb-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">Contenido del curso</Text>
          {modules.map((mod, i) => (
            <TouchableOpacity key={mod.id}
              className="mb-2 flex-row items-center rounded-xl border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-700 dark:bg-neutral-800">
              <View className="mr-3 h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                <Text className="text-xs font-bold text-primary-600">{i + 1}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{mod.title}</Text>
                <Text className="text-xs text-neutral-400">{mod.duration} • {mod.type}</Text>
              </View>
              <Text className="text-lg text-neutral-300">{'>'}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity className="mt-6 rounded-xl bg-primary-500 py-4 items-center">
          <Text className="font-medium text-white">Comenzar Curso</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
