import { useState } from 'react';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';
import { EventManager } from './EventManager';
import { CalendarStats } from './CalendarStats';
import { EventReminders } from './EventReminders';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { useToast } from '@/components/ui/use-toast';
import { exportEvents, formatDate } from '@/lib/calendar-utils';

export function CalendarView() {
  const { toast } = useToast();
  const {
    currentDate,
    selectedDate,
    setSelectedDate,
    days,
    navigateToPrevMonth,
    navigateToNextMonth,
  } = useCalendarNavigation();

  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setIsAddEventOpen(true);
  };

  const handleExport = () => {
    exportEvents(events);
    toast({
      title: 'Export Successful',
      description: 'Calendar events have been exported as JSON.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <CalendarHeader
            currentDate={currentDate}
            onPrevMonth={navigateToPrevMonth}
            onNextMonth={navigateToNextMonth}
            onExport={handleExport}
          />
          <CalendarGrid
            days={days}
            events={events}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
          />
        </div>
        <div className="space-y-6">
          <EventReminders />
          <CalendarStats />
        </div>
      </div>
      
      {selectedDate && (
        <EventManager
          selectedDate={selectedDate}
          events={events[formatDate(selectedDate)] || []}
          onAddEvent={(eventData) => addEvent(formatDate(selectedDate), eventData)}
          onUpdateEvent={(eventData, eventId) =>
            updateEvent(formatDate(selectedDate), eventData, eventId)
          }
          onDeleteEvent={(eventId) => deleteEvent(formatDate(selectedDate), eventId)}
          isAddEventOpen={isAddEventOpen}
          onAddEventClose={() => setIsAddEventOpen(false)}
        />
      )}
    </div>
  );
}