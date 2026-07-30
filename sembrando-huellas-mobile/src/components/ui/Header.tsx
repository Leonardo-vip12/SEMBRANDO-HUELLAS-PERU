import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, subtitle, showBack, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center flex-1">
        {showBack && (
          <TouchableOpacity onPress={() => router.back()} className="mr-2 p-1">
            <Text className="text-2xl text-neutral-600 dark:text-neutral-300">←</Text>
          </TouchableOpacity>
        )}
        <View className="flex-1">
          <Text className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</Text>
          {subtitle && <Text className="text-xs text-neutral-400">{subtitle}</Text>}
        </View>
      </View>
      {rightAction && <View>{rightAction}</View>}
    </View>
  );
}
