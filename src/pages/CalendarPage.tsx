
import React, { useState } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface Event {
  id: number;
  title: string;
  date: Date;
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<string>('');

  const addEvent = () => {
    if (newEvent.trim() !== '' && date) {
      setEvents([
        ...events,
        { id: Date.now(), title: newEvent, date: date }
      ]);
      setNewEvent('');
    }
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addEvent();
    }
  };

  const eventsForSelectedDate = date 
    ? events.filter(event => 
        format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    : [];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border pointer-events-auto"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>
                {date ? format(date, 'MMMM d, yyyy') : 'Events'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                <Input
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add event for selected date..."
                  className="flex-1"
                />
                <Button onClick={addEvent} className="bg-forest-500 hover:bg-forest-600">Add</Button>
              </div>
              
              {eventsForSelectedDate.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No events scheduled for this date.</p>
              ) : (
                <ul className="space-y-2">
                  {eventsForSelectedDate.map((event) => (
                    <li 
                      key={event.id}
                      className="flex items-center justify-between p-3 rounded-md border border-border"
                    >
                      <span>{event.title}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteEvent(event.id)}
                        className="opacity-50 hover:opacity-100"
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
