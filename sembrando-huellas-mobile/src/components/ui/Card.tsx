import { View, Text, TouchableOpacity, Image } from 'react-native';

interface CardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  onPress?: () => void;
  badge?: string;
  badgeColor?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function Card({ title, subtitle, description, imageUrl, onPress, badge, badgeColor, footer, children, className = '' }: CardProps) {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <Wrapper onPress={onPress} activeOpacity={0.7} className={`rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800 ${className}`}>
      {imageUrl && (
        <Image source={{ uri: imageUrl }} className="h-40 w-full rounded-t-xl" resizeMode="cover" />
      )}
      <View className="p-4">
        {badge && (
          <View className="mb-2 self-start rounded-full px-2 py-0.5" style={{ backgroundColor: badgeColor || '#10b98120' }}>
            <Text className="text-xs font-medium" style={{ color: badgeColor ? '#fff' : '#10b981' }}>{badge}</Text>
          </View>
        )}
        {title && <Text className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</Text>}
        {subtitle && <Text className="mt-0.5 text-xs text-neutral-400">{subtitle}</Text>}
        {description && <Text className="mt-1 text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{description}</Text>}
        {children}
      </View>
      {footer && <View className="border-t border-neutral-100 px-4 py-3 dark:border-neutral-700">{footer}</View>}
    </Wrapper>
  );
}
