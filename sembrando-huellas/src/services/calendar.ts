import api from '@/lib/axios';
import type { APIResponse } from '@/types';
import eventsData from '@/data/json/events.json';

export interface CalendarEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  type: string;
  coverImage: string;
  organizer: string;
  capacity: number;
  registeredCount: number;
  status: string;
  tags: string[];
}

export type CalendarView = 'month' | 'week' | 'list';

export class CalendarService {
  static getAll(): CalendarEvent[] {
    return eventsData as CalendarEvent[];
  }

  static getBySlug(slug: string): CalendarEvent | undefined {
    return (eventsData as CalendarEvent[]).find((e) => e.slug === slug);
  }

  static getUpcoming(): CalendarEvent[] {
    const today = new Date().toISOString().split('T')[0];
    return (eventsData as CalendarEvent[])
      .filter((e) => e.date >= today && e.status === 'upcoming')
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  static getByMonth(year: number, month: number): CalendarEvent[] {
    const monthStr = String(month).padStart(2, '0');
    return (eventsData as CalendarEvent[]).filter((e) => e.date.startsWith(`${year}-${monthStr}`));
  }

  static getByType(type: string): CalendarEvent[] {
    return (eventsData as CalendarEvent[]).filter(
      (e) => e.type.toLowerCase() === type.toLowerCase(),
    );
  }

  static getYearRange(): number[] {
    const years = (eventsData as CalendarEvent[]).map((e) => new Date(e.date).getFullYear());
    const min = Math.min(...years);
    const max = Math.max(...years);
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }

  static getTypes(): string[] {
    return [...new Set((eventsData as CalendarEvent[]).map((e) => e.type))];
  }

  static async apiGetAll(): Promise<APIResponse<CalendarEvent[]>> {
    const { data } = await api.get<APIResponse<CalendarEvent[]>>('/events');
    return data;
  }
}
