import { CalendarDay, DayEvents, Event } from '@/types/calendar';

export function getDaysInMonth(year: number, month: number): CalendarDay[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days: CalendarDay[] = [];
  
  // Add days from previous month
  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
    });
  }
  
  // Add days of current month
  for (let date = firstDay; date <= lastDay; date.setDate(date.getDate() + 1)) {
    days.push({
      date: new Date(date),
      isCurrentMonth: true,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
    });
  }
  
  // Add days from next month
  const remainingDays = 42 - days.length; // Always show 6 weeks
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({
      date,
      isCurrentMonth: false,
      isToday: isToday(date),
      isWeekend: isWeekend(date),
    });
  }
  
  return days;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isWeekend(date: Date): boolean {
  return date.getDay() === 0 || date.getDay() === 6;
}

export function hasEventOverlap(
  events: Event[],
  newEvent: Omit<Event, 'id'>,
  excludeId?: string
): boolean {
  return events.some(
    (event) =>
      event.id !== excludeId &&
      ((newEvent.startTime >= event.startTime && newEvent.startTime < event.endTime) ||
        (newEvent.endTime > event.startTime && newEvent.endTime <= event.endTime))
  );
}

export function saveEvents(events: DayEvents): void {
  localStorage.setItem('calendar-events', JSON.stringify(events));
}

export function loadEvents(): DayEvents {
  const stored = localStorage.getItem('calendar-events');
  return stored ? JSON.parse(stored) : {};
}

export function exportEvents(events: DayEvents): void {
  const dataStr = JSON.stringify(events, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  const exportFileDefaultName = 'calendar-events.json';
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

export const EVENT_COLORS = {
  work: 'bg-blue-100 border-blue-300',
  personal: 'bg-green-100 border-green-300',
  other: 'bg-purple-100 border-purple-300',
};