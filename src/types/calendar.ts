export interface Event {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  category: 'work' | 'personal' | 'other';
  color?: string;
}

export interface DayEvents {
  [date: string]: Event[];
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
}

export type EventCategory = 'work' | 'personal' | 'other';

export interface EventFormData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  category: EventCategory;
}