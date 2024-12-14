import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Event } from '@/types/calendar';
import { useState } from 'react';
import { Search } from 'lucide-react';
import { EventCard } from './EventCard';
import { DeleteEventDialog } from './DeleteEventDialog';

interface EventListProps {
  isOpen: boolean;
  onClose: () => void;
  events: Event[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  selectedDate: Date;
}

export function EventList({
  isOpen,
  onClose,
  events,
  onEditEvent,
  onDeleteEvent,
  selectedDate,
}: EventListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (event: Event) => {
    setEventToDelete(event);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              Events for{' '}
              {selectedDate.toLocaleDateString('default', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="space-y-4">
              {filteredEvents.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No events found
                </p>
              ) : (
                filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onEdit={onEditEvent}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <DeleteEventDialog
        event={eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}