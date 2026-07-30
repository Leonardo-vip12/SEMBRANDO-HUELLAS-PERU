import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { Header } from '@/src/components/ui/Header';
import { eisService } from '@/src/services/api';
import { useOfflineStore } from '@/src/stores/offlineStore';

export default function RegisterObservationScreen() {
  const router = useRouter();
  const { isOnline, saveDraft, addToSyncQueue } = useOfflineStore();
  const [form, setForm] = useState({
    speciesName: '', scientificName: '', quantity: '1',
    latitude: '', longitude: '', habitat: '', weather: '', comments: '',
  });
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function getLocation() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permiso denegado', 'Se necesita acceso a la ubicación'); return; }
    const loc = await Location.getCurrentPositionAsync({});
    setForm({ ...form, latitude: loc.coords.latitude.toFixed(6), longitude: loc.coords.longitude.toFixed(6) });
  }

  async function addPhoto() {
    const res = await ImagePicker.launchCameraAsync({ quality: 0.7 });
    if (!res.canceled && res.assets[0]) {
      setPhotos([...photos, res.assets[0].uri]);
    }
  }

  async function handleSubmit() {
    if (!form.latitude || !form.longitude) { Alert.alert('Error', 'Ubicación requerida'); return; }
    const data = {
      ...form, quantity: parseInt(form.quantity) || 1,
      latitude: parseFloat(form.latitude), longitude: parseFloat(form.longitude),
      images: photos,
    };

    setLoading(true);
    try {
      if (isOnline) {
        await eisService.registerObservation(data);
        Alert.alert('Éxito', 'Observación registrada');
        router.back();
      } else {
        await saveDraft({ ...data, id: `draft-${Date.now()}` });
        await addToSyncQueue({ endpoint: '/api/v1/eis/observatory/observations', method: 'POST', body: data });
        Alert.alert('Guardado local', 'Se sincronizará cuando tengas conexión');
        router.back();
      }
    } catch {
      await saveDraft({ ...data, id: `draft-${Date.now()}` });
      Alert.alert('Sin conexión', 'Guardado localmente para sincronización posterior');
    }
    setLoading(false);
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Registrar Observación" subtitle="Comparte tus avistamientos" showBack />

      <View className="px-4 space-y-4">
        <View className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 space-y-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-neutral-400">Nombre común</Text>
              <TextInput value={form.speciesName} onChangeText={(v) => setForm({ ...form, speciesName: v })}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs text-neutral-400">Cantidad</Text>
              <TextInput value={form.quantity} onChangeText={(v) => setForm({ ...form, quantity: v })} keyboardType="numeric"
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </View>
          </View>

          <View>
            <Text className="mb-1 text-xs text-neutral-400">Nombre científico</Text>
            <TextInput value={form.scientificName} onChangeText={(v) => setForm({ ...form, scientificName: v })}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
          </View>

          <View>
            <View className="flex-row items-center gap-2">
              <View className="flex-1">
                <Text className="mb-1 text-xs text-neutral-400">Ubicación</Text>
                <View className="flex-row gap-2">
                  <TextInput value={form.latitude} onChangeText={(v) => setForm({ ...form, latitude: v })} placeholder="Latitud" keyboardType="decimal-pad"
                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
                  <TextInput value={form.longitude} onChangeText={(v) => setForm({ ...form, longitude: v })} placeholder="Longitud" keyboardType="decimal-pad"
                    className="flex-1 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
                </View>
              </View>
              <TouchableOpacity onPress={getLocation} className="mt-5 rounded-lg bg-primary-100 p-2.5 dark:bg-primary-900/30">
                <Text className="text-lg">📍</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-neutral-400">Hábitat</Text>
              <TextInput value={form.habitat} onChangeText={(v) => setForm({ ...form, habitat: v })}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs text-neutral-400">Clima</Text>
              <TextInput value={form.weather} onChangeText={(v) => setForm({ ...form, weather: v })}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </View>
          </View>

          <View>
            <Text className="mb-1 text-xs text-neutral-400">Comentarios</Text>
            <TextInput value={form.comments} onChangeText={(v) => setForm({ ...form, comments: v })} multiline numberOfLines={3}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
          </View>

          <View>
            <TouchableOpacity onPress={addPhoto} className="flex-row items-center gap-2 rounded-lg border border-dashed border-neutral-300 p-3 dark:border-neutral-600">
              <Text className="text-lg">📷</Text>
              <Text className="text-sm text-neutral-500">Agregar foto</Text>
            </TouchableOpacity>
            {photos.length > 0 && <Text className="mt-1 text-xs text-neutral-400">{photos.length} foto(s) seleccionada(s)</Text>}
          </View>
        </View>

        <TouchableOpacity onPress={handleSubmit} disabled={loading}
          className="rounded-xl bg-primary-500 py-4 items-center">
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="font-medium text-white">Registrar Observación</Text>}
        </TouchableOpacity>

        {!isOnline && (
          <View className="rounded-xl bg-amber-100 p-3 dark:bg-amber-900/30">
            <Text className="text-xs text-amber-700 dark:text-amber-300">📡 Sin conexión - se guardará localmente</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
