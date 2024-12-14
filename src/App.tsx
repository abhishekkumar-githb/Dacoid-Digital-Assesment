import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarView } from '@/components/calendar/CalendarView';
import { EventsSection } from '@/components/events/EventsSection';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <div className="container mx-auto py-8">
      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendar" className="space-y-6">
          <CalendarView />
        </TabsContent>
        
        <TabsContent value="events" className="space-y-6">
          <EventsSection />
        </TabsContent>
      </Tabs>
      
      <Toaster />
    </div>
  );
}

export default App;