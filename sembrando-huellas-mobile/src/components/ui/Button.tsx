import { TouchableOpacity, Text, ActivityIndicator, type ViewStyle } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function Button({ title, onPress, variant = 'primary', size = 'md', loading, disabled, icon, className = '' }: ButtonProps) {
  const base = 'flex-row items-center justify-center rounded-xl font-medium';
  const variants = {
    primary: 'bg-primary-500 text-white',
    secondary: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100',
    outline: 'border border-primary-500 text-primary-500',
    ghost: 'text-primary-500',
  };
  const sizes = {
    sm: 'px-3 py-2 text-xs',
    md: 'px-4 py-3 text-sm',
    lg: 'px-6 py-4 text-base',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#fff' : '#10b981'} />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text className={`font-medium ${variant === 'primary' ? 'text-white' : variant === 'outline' ? 'text-primary-500' : 'text-neutral-900 dark:text-neutral-100'} ${icon ? 'ml-2' : ''}`}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
