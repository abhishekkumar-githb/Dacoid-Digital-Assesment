import { useEffect, useState } from 'react';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell } from 'lucide-react';
import { formatDate } from '@/lib/calendar-utils';

export function EventReminders() {
  const { events } = useCalendarEvents();
  const [upcomingEvents, setUpcomingEvents] = useState<Array<any>>([]);

  useEffect(() => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const upcoming = Object.entries(events)
      .flatMap(([date, dateEvents]) =>
        dateEvents.map(event => ({
          ...event,
          date
        }))
      )
      .filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);

    setUpcomingEvents(upcoming);
  }, [events]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground">No upcoming events</p>
          ) : (
            upcomingEvents.map(event => (
              <div key={event.id} className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.date).toLocaleDateString('default', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric'
                    })} • {event.startTime}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}