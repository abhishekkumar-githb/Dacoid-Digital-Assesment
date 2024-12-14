import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Event, EventFormData } from '@/types/calendar';
import { EventDialog } from './EventDialog';
import { EventList } from './EventList';
import { formatDate } from '@/lib/calendar-utils';

interface EventManagerProps {
  selectedDate: Date;
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => void;
  onUpdateEvent: (event: Omit<Event, 'id'>, eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  isAddEventOpen: boolean;
  onAddEventClose: () => void;
}

export function EventManager({
  selectedDate,
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  isAddEventOpen,
  onAddEventClose,
}: EventManagerProps) {
  const [isEventListOpen, setIsEventListOpen] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [isEditEventOpen, setIsEditEventOpen] = useState(false);

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    onAddEventClose();
    setIsEditEventOpen(false);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsEditEventOpen(true);
  };

  const handleSaveEvent = (eventData: EventFormData) => {
    const event = {
      ...eventData,
      date: formatDate(selectedDate),
    };

    if (selectedEvent) {
      onUpdateEvent(event, selectedEvent.id);
      setIsEditEventOpen(false);
    } else {
      onAddEvent(event);
      onAddEventClose();
    }
    setSelectedEvent(undefined);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Events for {selectedDate.toLocaleDateString('default', { 
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          })}
        </h2>
        <Button onClick={() => onAddEventClose()} variant="default">
          <Plus className="mr-2 h-4 w-4" />
          Add Event
        </Button>
      </div>

      <EventDialog
        isOpen={isAddEventOpen}
        onClose={onAddEventClose}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
      />

      <EventDialog
        isOpen={isEditEventOpen}
        onClose={() => {
          setIsEditEventOpen(false);
          setSelectedEvent(undefined);
        }}
        onSave={handleSaveEvent}
        selectedDate={selectedDate}
        event={selectedEvent}
      />

      <EventList
        isOpen={isEventListOpen}
        onClose={() => setIsEventListOpen(false)}
        events={events}
        onEditEvent={handleEditEvent}
        onDeleteEvent={onDeleteEvent}
        selectedDate={selectedDate}
      />
    </>
  );
}