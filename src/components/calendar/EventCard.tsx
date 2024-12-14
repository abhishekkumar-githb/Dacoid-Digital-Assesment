import { Event } from '@/types/calendar';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2 } from 'lucide-react';
import { EVENT_COLORS } from '@/lib/calendar-utils';
import { cn } from '@/lib/utils';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        EVENT_COLORS[event.category]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-medium">{event.title}</h3>
          <p className="text-sm text-muted-foreground">
            {event.startTime} - {event.endTime}
          </p>
          {event.description && (
            <p className="mt-2 text-sm">{event.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(event)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(event)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}