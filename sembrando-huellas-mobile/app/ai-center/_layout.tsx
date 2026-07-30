import { Stack } from 'expo-router';

export default function AICenterLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="tutor" />
      <Stack.Screen name="identify" />
    </Stack>
  );
}
