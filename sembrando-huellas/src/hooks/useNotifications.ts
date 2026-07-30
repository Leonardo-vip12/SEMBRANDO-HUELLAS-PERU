import { useNotificationContext } from '@/contexts/NotificationContext';

export function useNotifications() {
  const context = useNotificationContext();
  return {
    ...context,
    hasNotifications: context.notifications.length > 0,
    unreadCount: context.notifications.filter((n) => !n.read).length,
  };
}
