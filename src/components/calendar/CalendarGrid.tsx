import { cn } from '@/lib/utils';
import { CalendarDay, DayEvents } from '@/types/calendar';
import { EVENT_COLORS } from '@/lib/calendar-utils';
import { Badge } from '@/components/ui/badge';

interface CalendarGridProps {
  days: CalendarDay[];
  events: DayEvents;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

export function CalendarGrid({
  days,
  events,
  selectedDate,
  onSelectDate,
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="rounded-lg border bg-card">
      <div className="grid grid-cols-7 gap-px border-b">
        {weekDays.map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-px">
        {days.map((day, index) => {
          const isSelected =
            selectedDate &&
            day.date.getDate() === selectedDate.getDate() &&
            day.date.getMonth() === selectedDate.getMonth() &&
            day.date.getFullYear() === selectedDate.getFullYear();

          const dateStr = day.date.toISOString().split('T')[0];
          const dayEvents = events[dateStr] || [];

          return (
            <div
              key={index}
              className={cn(
                'relative min-h-[120px] p-2 transition-colors',
                !day.isCurrentMonth && 'bg-muted/50 text-muted-foreground',
                day.isWeekend && day.isCurrentMonth && 'bg-muted/30',
                day.isToday && 'bg-accent',
                isSelected && 'ring-2 ring-primary',
                'hover:bg-accent cursor-pointer'
              )}
              onClick={() => onSelectDate(day.date)}
            >
              <div className="font-medium text-sm mb-1">{day.date.getDate()}</div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <Badge
                    key={event.id}
                    variant="secondary"
                    className={cn(
                      'block truncate text-xs w-full',
                      EVENT_COLORS[event.category]
                    )}
                  >
                    {event.title}
                  </Badge>
                ))}
                {dayEvents.length > 2 && (
                  <Badge variant="outline" className="block text-xs w-full text-center">
                    +{dayEvents.length - 2} more
                  </Badge>
                )}
              </div>
              {dayEvents.length > 0 && (
                <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
                  {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}