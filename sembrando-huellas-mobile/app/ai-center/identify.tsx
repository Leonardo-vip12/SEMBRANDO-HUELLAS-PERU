import { View, Text, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '@/src/components/ui/Header';
import { eisService } from '@/src/services/api';
import { getConservationStatusColor, getConservationStatusLabel } from '@/src/utils/formatting';

export default function IdentifyScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function pickImage() {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      setImage(res.assets[0].uri);
      setResult(null);
    }
  }

  async function takePhoto() {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!res.canceled && res.assets[0]) {
      setImage(res.assets[0].uri);
      setResult(null);
    }
  }

  async function handleIdentify() {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', { uri: image, type: 'image/jpeg', name: 'photo.jpg' } as any);
      const res = await eisService.identifySpecies(formData);
      setResult(res);
    } catch {
      setResult({ error: 'No se pudo identificar la especie. Intenta con otra imagen.' });
    }
    setLoading(false);
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Identificador de Especies" subtitle="IA para identificar flora y fauna" showBack />
      <View className="px-4">
        {!image ? (
          <View className="mb-4">
            <TouchableOpacity onPress={takePhoto}
              className="mb-3 rounded-xl border-2 border-dashed border-primary-300 bg-primary-50 p-8 items-center dark:border-primary-700 dark:bg-primary-900/20">
              <Text className="text-5xl mb-2">📷</Text>
              <Text className="text-sm font-medium text-primary-600 dark:text-primary-400">Tomar foto</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage}
              className="rounded-xl border-2 border-dashed border-neutral-300 bg-white p-8 items-center dark:border-neutral-600 dark:bg-neutral-800">
              <Text className="text-5xl mb-2">🖼️</Text>
              <Text className="text-sm font-medium text-neutral-500">Seleccionar de galería</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="mb-4">
            <Image source={{ uri: image }} className="h-64 w-full rounded-xl" resizeMode="cover" />
            <View className="mt-3 flex-row gap-2">
              <TouchableOpacity onPress={pickImage}
                className="flex-1 rounded-xl border border-neutral-200 bg-white py-3 items-center dark:border-neutral-700 dark:bg-neutral-800">
                <Text className="text-sm text-neutral-600 dark:text-neutral-300">Cambiar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleIdentify} disabled={loading}
                className="flex-1 rounded-xl bg-primary-500 py-3 items-center">
                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-sm font-medium text-white">Identificar</Text>}
              </TouchableOpacity>
            </View>
          </View>
        )}

        {result && !result.error && (
          <View className="mb-8 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
            <Text className="mb-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">{result.commonName || 'Especies'}</Text>
            {result.scientificName && <Text className="mb-3 italic text-neutral-400">{result.scientificName}</Text>}

            {result.confidence && (
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-2 flex-1 rounded-full bg-neutral-200 dark:bg-neutral-700">
                  <View className="h-2 rounded-full bg-primary-500" style={{ width: `${result.confidence * 100}%` }} />
                </View>
                <Text className="text-xs text-neutral-400">{(result.confidence * 100).toFixed(0)}%</Text>
              </View>
            )}

            {result.conservationStatus && (
              <View className="mb-2 flex-row items-center gap-2">
                <View className="rounded-full px-2 py-0.5" style={{ backgroundColor: getConservationStatusColor(result.conservationStatus) + '20' }}>
                  <Text style={{ color: getConservationStatusColor(result.conservationStatus) }} className="text-xs font-medium">
                    {getConservationStatusLabel(result.conservationStatus)}
                  </Text>
                </View>
              </View>
            )}

            {result.habitat && <View className="mb-1"><Text className="text-xs text-neutral-400">Hábitat: {result.habitat}</Text></View>}
            {result.distribution && <View className="mb-1"><Text className="text-xs text-neutral-400">Distribución: {result.distribution}</Text></View>}
            {result.ecologicalImportance && <View className="mb-1"><Text className="text-xs text-neutral-400">Importancia ecológica: {result.ecologicalImportance}</Text></View>}

            {result.curiosities && result.curiosities.length > 0 && (
              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-neutral-500">Curiosidades</Text>
                {result.curiosities.map((c: string, i: number) => (
                  <Text key={i} className="text-xs text-neutral-400 mb-0.5">• {c}</Text>
                ))}
              </View>
            )}

            {result.threats && result.threats.length > 0 && (
              <View className="mt-3">
                <Text className="mb-1 text-xs font-semibold text-red-500">Amenazas</Text>
                {result.threats.map((t: string, i: number) => (
                  <Text key={i} className="text-xs text-neutral-400 mb-0.5">• {t}</Text>
                ))}
              </View>
            )}
          </View>
        )}

        {result?.error && (
          <View className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
            <Text className="text-sm text-red-600 dark:text-red-400">{result.error}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
