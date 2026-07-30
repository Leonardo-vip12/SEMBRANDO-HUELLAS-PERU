import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { NotificationsService, type Notification, type NotificationVariant } from '@/services/notifications';

interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (title: string, message: string, variant?: NotificationVariant, duration?: number) => void;
  addSuccess: (title: string, message: string) => void;
  addError: (title: string, message: string) => void;
  addWarning: (title: string, message: string) => void;
  addInfo: (title: string, message: string) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (title: string, message: string, variant: NotificationVariant = 'info', duration = 5000) => {
      const notification = NotificationsService.create(title, message, variant, duration);
      setNotifications((prev) => [...prev, notification]);
    },
    [],
  );

  const addSuccess = useCallback(
    (title: string, message: string) => addNotification(title, message, 'success'),
    [addNotification],
  );

  const addError = useCallback(
    (title: string, message: string) => addNotification(title, message, 'error'),
    [addNotification],
  );

  const addWarning = useCallback(
    (title: string, message: string) => addNotification(title, message, 'warning'),
    [addNotification],
  );

  const addInfo = useCallback(
    (title: string, message: string) => addNotification(title, message, 'info'),
    [addNotification],
  );

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        addSuccess,
        addError,
        addWarning,
        addInfo,
        dismissNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
}
