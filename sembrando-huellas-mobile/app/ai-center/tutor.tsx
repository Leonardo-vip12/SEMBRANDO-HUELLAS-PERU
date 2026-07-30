import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import { Header } from '@/src/components/ui/Header';
import { eisService } from '@/src/services/api';

const LEVELS = ['primaria', 'secundaria', 'universidad', 'docente', 'investigador', 'voluntario', 'empresa', 'general'];

export default function TutorScreen() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [input, setInput] = useState('');
  const [level, setLevel] = useState('general');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const q = input;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setLoading(true);
    try {
      const res = await eisService.tutorAsk(q, level);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Lo siento, no pude procesar tu consulta.' }]);
    }
    setLoading(false);
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Tutor Ambiental IA" subtitle={`Nivel: ${level}`} showBack />
      <View className="px-4 mb-2">
        <FlatList horizontal data={LEVELS} showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setLevel(item)}
              className={`mr-2 rounded-full px-3 py-1.5 ${level === item ? 'bg-primary-500' : 'border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800'}`}>
              <Text className={`text-xs font-medium capitalize ${level === item ? 'text-white' : 'text-neutral-600 dark:text-neutral-300'}`}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <FlatList
        className="flex-1 px-4"
        data={messages}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View className={`mb-3 max-w-[80%] rounded-2xl px-4 py-3 ${item.role === 'user' ? 'self-end bg-primary-500' : 'self-start bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700'}`}>
            <Text className={`text-sm ${item.role === 'user' ? 'text-white' : 'text-neutral-800 dark:text-neutral-200'}`}>{item.content}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 16 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center pt-16">
            <Text className="text-4xl mb-2">🤖</Text>
            <Text className="text-sm text-neutral-400">Selecciona un nivel y escribe tu pregunta</Text>
          </View>
        }
      />
      <View className="flex-row items-center gap-2 border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
        <TextInput value={input} onChangeText={setInput}
          placeholder="Escribe tu pregunta..." className="flex-1 rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          onSubmitEditing={handleSend} />
        <TouchableOpacity onPress={handleSend} disabled={loading || !input.trim()}
          className="rounded-xl bg-primary-500 px-4 py-2.5">
          <Text className="text-sm font-medium text-white">{loading ? '...' : '→'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
