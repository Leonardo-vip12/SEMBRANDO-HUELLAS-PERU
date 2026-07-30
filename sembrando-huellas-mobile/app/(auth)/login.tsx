import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { t } from '@/src/i18n';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) { Alert.alert('Error', 'Completa todos los campos'); return; }
    setLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Credenciales inválidas');
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-white dark:bg-neutral-900">
      <View className="flex-1 justify-center px-8">
        <View className="mb-8 items-center">
          <Text className="mb-2 text-5xl">🌱</Text>
          <Text className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Sembrando Huellas</Text>
          <Text className="text-sm text-neutral-400">{t('auth.welcome')}</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="mb-1 text-xs font-medium text-neutral-500">{t('auth.email')}</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="correo@ejemplo.com"
              autoCapitalize="none"
              keyboardType="email-address"
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </View>
          <View>
            <Text className="mb-1 text-xs font-medium text-neutral-500">{t('auth.password')}</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
              className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            className="mt-2 rounded-xl bg-primary-500 py-4"
          >
            <Text className="text-center font-semibold text-white">
              {loading ? '...' : t('auth.login')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(auth)/register')} className="py-2">
            <Text className="text-center text-sm text-primary-500">{t('auth.noAccount')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
