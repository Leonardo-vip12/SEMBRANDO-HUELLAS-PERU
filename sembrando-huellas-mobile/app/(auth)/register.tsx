import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { t } from '@/src/i18n';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!form.name || !form.email || !form.password) { Alert.alert('Error', 'Completa todos los campos'); return; }
    if (form.password !== form.confirmPassword) { Alert.alert('Error', 'Las contraseñas no coinciden'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Error al registrarse');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white dark:bg-neutral-900">
      <ScrollView className="flex-1 px-8" contentContainerStyle={{ justifyContent: 'center', flexGrow: 1 }}>
        <View className="mb-8 items-center">
          <Text className="mb-2 text-5xl">🌱</Text>
          <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{t('auth.createAccount')}</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="mb-1 text-xs font-medium text-neutral-500">{t('auth.name')}</Text>
            <TextInput value={form.name} onChangeText={(v) => setForm({ ...form, name: v })}
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
          </View>
          <View>
            <Text className="mb-1 text-xs font-medium text-neutral-500">{t('auth.email')}</Text>
            <TextInput value={form.email} onChangeText={(v) => setForm({ ...form, email: v })}
              autoCapitalize="none" keyboardType="email-address"
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
          </View>
          <View>
            <Text className="mb-1 text-xs font-medium text-neutral-500">{t('auth.password')}</Text>
            <TextInput value={form.password} onChangeText={(v) => setForm({ ...form, password: v })} secureTextEntry
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
          </View>
          <View>
            <Text className="mb-1 text-xs font-medium text-neutral-500">{t('auth.confirmPassword')}</Text>
            <TextInput value={form.confirmPassword} onChangeText={(v) => setForm({ ...form, confirmPassword: v })} secureTextEntry
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" />
          </View>

          <TouchableOpacity onPress={handleRegister} disabled={loading}
            className="mt-2 rounded-xl bg-primary-500 py-4">
            <Text className="text-center font-semibold text-white">
              {loading ? '...' : t('auth.register')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} className="py-2">
            <Text className="text-center text-sm text-primary-500">{t('auth.haveAccount')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
