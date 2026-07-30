import api from '@/lib/axios';
import type { APIResponse } from '@/types';

export type NotificationVariant = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  title: string;
  message: string;
  variant: NotificationVariant;
  duration?: number;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export class NotificationsService {
  private static counter = 0;

  static create(title: string, message: string, variant: NotificationVariant = 'info', duration = 5000): Notification {
    this.counter += 1;
    return {
      id: `notif-${Date.now()}-${this.counter}`,
      title,
      message,
      variant,
      duration,
      createdAt: new Date().toISOString(),
      read: false,
    };
  }

  static success(title: string, message: string): Notification {
    return this.create(title, message, 'success');
  }

  static error(title: string, message: string): Notification {
    return this.create(title, message, 'error');
  }

  static warning(title: string, message: string): Notification {
    return this.create(title, message, 'warning');
  }

  static info(title: string, message: string): Notification {
    return this.create(title, message, 'info');
  }

  static async subscribeEmail(email: string): Promise<APIResponse<{ subscribed: boolean }>> {
    const { data } = await api.post<APIResponse<{ subscribed: boolean }>>('/notifications/subscribe', { email });
    return data;
  }
}
