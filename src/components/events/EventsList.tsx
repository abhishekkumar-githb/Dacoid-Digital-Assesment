import { useState } from 'react';
import { Event } from '@/types/calendar';
import { Input } from '@/components/ui/input';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import { EventCard } from '@/components/calendar/EventCard';
import { DeleteEventDialog } from '@/components/calendar/DeleteEventDialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface EventsListProps {
  events: (Event & { date: string })[];
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (date: string, eventId: string) => void;
}

export function EventsList({ events, onEditEvent, onDeleteEvent }: EventsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [eventToDelete, setEventToDelete] = useState<(Event & { date: string }) | null>(null);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || event.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Group events by date for better organization
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const date = event.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, typeof filteredEvents>);

  const handleDeleteClick = (event: Event & { date: string }) => {
    setEventToDelete(event);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDeleteEvent(eventToDelete.date, eventToDelete.id);
      setEventToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="work">Work</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <div className="h-4 w-4 grid grid-cols-2 gap-0.5">
              <div className="bg-current rounded-sm" />
              <div className="bg-current rounded-sm" />
              <div className="bg-current rounded-sm" />
              <div className="bg-current rounded-sm" />
            </div>
          </Button>
        </div>
      </div>

      <div className={cn(
        'space-y-6',
        viewMode === 'grid' && 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
      )}>
        {Object.entries(groupedEvents).map(([date, events]) => (
          <div key={date} className="space-y-4">
            <h3 className="font-semibold text-lg sticky top-0 bg-background py-2">
              {new Date(date).toLocaleDateString('default', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>
            <div className={cn(
              'space-y-4',
              viewMode === 'grid' && 'grid grid-cols-1 gap-4'
            )}>
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={onEditEvent}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </div>
        ))}
        
        {filteredEvents.length === 0 && (
          <p className="text-center text-muted-foreground py-4 col-span-full">
            No events found
          </p>
        )}
      </div>

      <DeleteEventDialog
        event={eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}