import { useState } from 'react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { EventsList } from './EventsList';
import { EventDialog } from '@/components/calendar/EventDialog';
import { Event } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { formatDate } from '@/lib/calendar-utils';

export function EventsSection() {
  const { events, addEvent, updateEvent, deleteEvent } = useCalendarEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  // Flatten events object into array
  const allEvents = Object.entries(events).flatMap(([date, dateEvents]) =>
    dateEvents.map(event => ({ ...event, date }))
  );

  const handleAddEvent = () => {
    setSelectedEvent(null);
    setIsAddEventOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsAddEventOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (selectedEvent) {
      updateEvent(selectedEvent.date, eventData, selectedEvent.id);
    } else {
      const today = formatDate(new Date());
      addEvent(today, eventData);
    }
    setIsAddEventOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">All Events</h2>
        <Button onClick={handleAddEvent}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <EventsList
        events={allEvents}
        onEditEvent={handleEditEvent}
        onDeleteEvent={deleteEvent}
      />

      <EventDialog
        isOpen={isAddEventOpen}
        onClose={() => {
          setIsAddEventOpen(false);
          setSelectedEvent(null);
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedEvent ? new Date(selectedEvent.date) : new Date()}
        event={selectedEvent}
      />
    </div>
  );
}