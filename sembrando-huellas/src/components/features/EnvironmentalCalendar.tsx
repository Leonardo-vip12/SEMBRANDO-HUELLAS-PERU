import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Clock, Users } from 'lucide-react';
import { CalendarService, type CalendarEvent, type CalendarView } from '@/services/calendar';
import { cn } from '@/lib/cn';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export default function EnvironmentalCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState('Todos');

  const events = useMemo(() => CalendarService.getAll(), []);
  const types = useMemo(() => ['Todos', ...CalendarService.getTypes()], []);

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'Todos') return events;
    return events.filter((e) => e.type === typeFilter);
  }, [events, typeFilter]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((event) => {
      if (!map[event.date]) map[event.date] = [];
      map[event.date].push(event);
    });
    return map;
  }, [filteredEvents]);

  const today = new Date().toISOString().split('T')[0];

  const getEventsForDate = (dateStr: string) => eventsByDate[dateStr] ?? [];

  const calendarDays = useMemo(() => {
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [firstDayOfWeek, daysInMonth]);

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={cn(
                'rounded-full px-3 py-1 text-xs font-medium transition-colors',
                typeFilter === t
                  ? 'bg-primary-600 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-700">
          {(['month', 'week', 'list'] as CalendarView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                view === v ? 'bg-primary-600 text-white' : 'text-neutral-500 hover:text-neutral-700',
              )}
            >
              {v === 'month' ? 'Mes' : v === 'week' ? 'Semana' : 'Lista'}
            </button>
          ))}
        </div>
      </div>

      {view === 'list' ? (
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <p className="py-8 text-center text-neutral-500">No hay eventos programados.</p>
          ) : (
            (filteredEvents as CalendarEvent[])
              .sort((a: CalendarEvent, b: CalendarEvent) => a.date.localeCompare(b.date))
              .map((event: CalendarEvent) => (
                <div
                  key={event.id}
                  className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-primary-200 dark:border-neutral-700 dark:bg-neutral-800"
                >
                  <div className="flex min-w-[48px] flex-col items-center rounded-lg bg-primary-50 px-3 py-2 dark:bg-primary-900/20">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs font-medium text-primary-500">
                      {MONTHS[new Date(event.date).getMonth()].slice(0, 3)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100">{event.title}</h4>
                    <p className="mt-0.5 text-sm text-neutral-500">{event.description}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                      <span className="flex items-center gap-1"><Clock size={12} /> {event.startTime} - {event.endTime}</span>
                      <span className="flex items-center gap-1"><MapPin size={12} /> {event.location}</span>
                      <span className="flex items-center gap-1"><Users size={12} /> {event.registeredCount}/{event.capacity}</span>
                    </div>
                  </div>
                  <span className={cn(
                    'self-start rounded-full px-2 py-0.5 text-xs font-medium',
                    event.status === 'upcoming' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700',
                  )}>
                    {event.status === 'upcoming' ? 'Próximo' : 'Finalizado'}
                  </span>
                </div>
              ))
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-700">
            <button onClick={prevMonth} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <ChevronLeft size={18} />
            </button>
            <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
              {MONTHS[month]} {year}
            </h3>
            <button onClick={nextMonth} className="rounded-lg p-1.5 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-700">
            {DAYS.map((d) => (
              <div key={d} className="bg-neutral-50 px-2 py-2 text-center text-xs font-medium text-neutral-500 dark:bg-neutral-800">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} className="bg-white dark:bg-neutral-800" />;
              const dateStr = getDateStr(day);
              const dayEvents = getEventsForDate(dateStr);
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;

              return (
                <div
                  key={dateStr}
                  onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={cn(
                    'min-h-[80px] cursor-pointer bg-white p-1.5 transition-colors hover:bg-neutral-50 dark:bg-neutral-800 dark:hover:bg-neutral-700',
                    isSelected && 'bg-primary-50 dark:bg-primary-900/20',
                  )}
                >
                  <span className={cn(
                    'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs',
                    isToday ? 'bg-primary-600 text-white' : 'text-neutral-700 dark:text-neutral-300',
                  )}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        className="truncate rounded bg-primary-100 px-1 py-0.5 text-[10px] text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"
                        title={e.title}
                      >
                        {e.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className="text-[10px] text-neutral-400">+{dayEvents.length - 2} más</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedDate && eventsByDate[selectedDate] && eventsByDate[selectedDate].length > 0 && view !== 'list' && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-800">
          <h4 className="mb-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">
            Eventos del {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </h4>
          <div className="space-y-2">
            {eventsByDate[selectedDate].map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded-lg bg-neutral-50 p-3 dark:bg-neutral-700/50">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{event.title}</p>
                  <p className="text-xs text-neutral-500">{event.location} · {event.startTime}</p>
                </div>
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
