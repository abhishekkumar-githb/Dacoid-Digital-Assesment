import { useState, useEffect } from 'react';
import { DayEvents, Event } from '@/types/calendar';
import { hasEventOverlap, loadEvents, saveEvents } from '@/lib/calendar-utils';
import { useToast } from '@/components/ui/use-toast';

export function useCalendarEvents() {
  const [events, setEvents] = useState<DayEvents>({});
  const { toast } = useToast();

  useEffect(() => {
    const savedEvents = loadEvents();
    setEvents(savedEvents);
  }, []);

  const addEvent = (dateStr: string, eventData: Omit<Event, 'id'>) => {
    const dateEvents = events[dateStr] || [];

    if (hasEventOverlap(dateEvents, eventData)) {
      toast({
        title: 'Time Conflict',
        description: 'This time slot overlaps with another event.',
        variant: 'destructive',
      });
      return false;
    }

    const newEvent = {
      ...eventData,
      id: crypto.randomUUID(),
    };

    const updatedEvents = {
      ...events,
      [dateStr]: [...dateEvents, newEvent],
    };
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    return true;
  };

  const updateEvent = (dateStr: string, eventData: Omit<Event, 'id'>, eventId: string) => {
    const dateEvents = events[dateStr] || [];

    if (hasEventOverlap(dateEvents, eventData, eventId)) {
      toast({
        title: 'Time Conflict',
        description: 'This time slot overlaps with another event.',
        variant: 'destructive',
      });
      return false;
    }

    const updatedEvents = {
      ...events,
      [dateStr]: dateEvents.map((event) =>
        event.id === eventId ? { ...eventData, id: eventId } : event
      ),
    };
    setEvents(updatedEvents);
    saveEvents(updatedEvents);
    return true;
  };

  const deleteEvent = (dateStr: string, eventId: string) => {
    const dateEvents = events[dateStr] || [];
    const updatedDateEvents = dateEvents.filter((event) => event.id !== eventId);
    
    const updatedEvents = {
      ...events,
      [dateStr]: updatedDateEvents,
    };

    // Remove the date key if there are no events
    if (updatedDateEvents.length === 0) {
      delete updatedEvents[dateStr];
    }

    setEvents(updatedEvents);
    saveEvents(updatedEvents);

    toast({
      title: 'Event Deleted',
      description: 'The event has been successfully deleted.',
    });
  };

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
  };
}