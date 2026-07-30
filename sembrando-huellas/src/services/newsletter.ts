import api from '@/lib/axios';
import type { APIResponse } from '@/types';

export interface Subscriber {
  email: string;
  name?: string;
  categories?: string[];
  frequency?: 'daily' | 'weekly' | 'monthly';
  subscribedAt: string;
}

export class NewsletterService {
  static async subscribe(subscriber: Omit<Subscriber, 'subscribedAt'>): Promise<{ success: boolean; message: string }> {
    try {
      const stored = localStorage.getItem('sh-newsletter');
      const subscribers: Subscriber[] = stored ? JSON.parse(stored) : [];
      if (subscribers.some((s) => s.email === subscriber.email)) {
        return { success: false, message: 'Ya estás suscrito con este correo.' };
      }
      subscribers.push({ ...subscriber, subscribedAt: new Date().toISOString() });
      localStorage.setItem('sh-newsletter', JSON.stringify(subscribers));
      return { success: true, message: '¡Gracias por suscribirte!' };
    } catch {
      return { success: false, message: 'Error al procesar la suscripción.' };
    }
  }

  static async unsubscribe(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const stored = localStorage.getItem('sh-newsletter');
      if (!stored) return { success: false, message: 'No estás suscrito.' };
      const subscribers: Subscriber[] = JSON.parse(stored).filter((s: Subscriber) => s.email !== email);
      localStorage.setItem('sh-newsletter', JSON.stringify(subscribers));
      return { success: true, message: 'Te has dado de baja correctamente.' };
    } catch {
      return { success: false, message: 'Error al procesar la baja.' };
    }
  }

  static async apiSubscribe(data: Omit<Subscriber, 'subscribedAt'>): Promise<APIResponse<{ id: string }>> {
    const { data: res } = await api.post<APIResponse<{ id: string }>>('/newsletter/subscribe', data);
    return res;
  }
}
