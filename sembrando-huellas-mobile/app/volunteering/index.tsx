import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { Header } from '@/src/components/ui/Header';
import { volunteersService } from '@/src/services/api';

export default function VolunteeringScreen() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', interests: '', availability: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!form.name || !form.email) { Alert.alert('Error', 'Nombre y email requeridos'); return; }
    setLoading(true);
    try {
      await volunteersService.register(form);
      setSubmitted(true);
    } catch {
      Alert.alert('Error', 'No se pudo enviar tu solicitud');
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50 dark:bg-neutral-900 px-8">
        <Text className="text-5xl mb-4">🎉</Text>
        <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">¡Gracias por tu interés!</Text>
        <Text className="text-sm text-neutral-400 text-center">Nos pondremos en contacto contigo pronto.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Voluntariado" subtitle="Sé parte del cambio" showBack />
      <View className="px-4 space-y-3">
        <View className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800 space-y-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-neutral-400">Nombre</Text>
              <TextInput value={form.name} onChangeText={(v) => setForm({ ...form, name: v })}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </View>
            <View className="flex-1">
              <Text className="mb-1 text-xs text-neutral-400">Email</Text>
              <TextInput value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address"
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" />
            </View>
          </View>
          <View><Text className="mb-1 text-xs text-neutral-400">Teléfono</Text>
            <TextInput value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" /></View>
          <View><Text className="mb-1 text-xs text-neutral-400">Áreas de interés</Text>
            <TextInput value={form.interests} onChangeText={(v) => setForm({ ...form, interests: v })}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" /></View>
          <View><Text className="mb-1 text-xs text-neutral-400">Disponibilidad</Text>
            <TextInput value={form.availability} onChangeText={(v) => setForm({ ...form, availability: v })}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" /></View>
          <View><Text className="mb-1 text-xs text-neutral-400">Mensaje</Text>
            <TextInput value={form.message} onChangeText={(v) => setForm({ ...form, message: v })} multiline numberOfLines={3}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100" /></View>
        </View>
        <TouchableOpacity onPress={handleSubmit} disabled={loading}
          className="rounded-xl bg-primary-500 py-4 items-center">
          {loading ? <ActivityIndicator color="#fff" /> : <Text className="font-medium text-white">Enviar Solicitud</Text>}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
