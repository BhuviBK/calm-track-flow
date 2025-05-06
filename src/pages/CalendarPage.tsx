
import React, { useState } from 'react';
import { format, addHours, startOfDay, setHours, isSameDay } from 'date-fns';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Clock } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Event {
  id: number;
  title: string;
  date: Date;
  hour?: number; // Hour of the day (0-23)
  category?: string; // For categorizing tasks
}

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState<string>('');
  const [selectedHour, setSelectedHour] = useState<number | undefined>(
    new Date().getHours()
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("task");
  const { toast } = useToast();

  const addEvent = () => {
    if (newEvent.trim() !== '' && date && selectedHour !== undefined) {
      const eventDate = setHours(date, selectedHour);
      
      setEvents([
        ...events,
        { 
          id: Date.now(), 
          title: newEvent, 
          date: eventDate,
          hour: selectedHour,
          category: selectedCategory
        }
      ]);
      setNewEvent('');
      
      toast({
        title: "Event added!",
        description: `"${newEvent}" scheduled for ${format(eventDate, 'MMMM d, yyyy')} at ${format(eventDate, 'h:mm a')}`,
      });
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

  // Generate hours for the timeline (7 AM to 10 PM)
  const hours = Array.from({ length: 16 }, (_, i) => i + 7);
  
  // Get events for the selected date, organized by hour
  const eventsForSelectedDate = date 
    ? events.filter(event => isSameDay(event.date, date))
    : [];
  
  // Group events by hour
  const eventsByHour = hours.map(hour => {
    return {
      hour,
      events: eventsForSelectedDate.filter(event => event.hour === hour)
    };
  });

  // Get the formatted time string for a given hour
  const getTimeString = (hour: number) => {
    const date = setHours(new Date(), hour);
    return format(date, 'h:mm a');
  };
  
  // Get background color based on category
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'task':
        return 'bg-forest-100 border-forest-500 text-forest-900';
      case 'meditation':
        return 'bg-purple-100 border-purple-500 text-purple-900';
      case 'important':
        return 'bg-amber-100 border-amber-500 text-amber-900';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-900';
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
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
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>
                  Add Event for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    value={newEvent}
                    onChange={(e) => setNewEvent(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add event for selected date and time..."
                    className="w-full"
                  />
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Time:</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          {selectedHour !== undefined 
                            ? getTimeString(selectedHour) 
                            : "Select a time"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0" align="start">
                        <ScrollArea className="h-72">
                          <div className="p-2">
                            {hours.map(hour => (
                              <Button
                                key={hour}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start text-left mb-1",
                                  selectedHour === hour && "bg-accent"
                                )}
                                onClick={() => {
                                  setSelectedHour(hour);
                                }}
                              >
                                {getTimeString(hour)}
                              </Button>
                            ))}
                          </div>
                        </ScrollArea>
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block">Category:</label>
                    <RadioGroup 
                      value={selectedCategory} 
                      onValueChange={setSelectedCategory}
                      className="flex space-x-2"
                    >
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="task" id="task" />
                        <label htmlFor="task" className="text-sm cursor-pointer">Task</label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="meditation" id="meditation" />
                        <label htmlFor="meditation" className="text-sm cursor-pointer">Meditation</label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <RadioGroupItem value="important" id="important" />
                        <label htmlFor="important" className="text-sm cursor-pointer">Important</label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <Button 
                    onClick={addEvent} 
                    className="w-full bg-forest-500 hover:bg-forest-600"
                    disabled={!newEvent.trim() || selectedHour === undefined || !date}
                  >
                    Add Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>
                Schedule for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-1">
                  {eventsByHour.map(({ hour, events }) => (
                    <div key={hour} className="mb-2">
                      <div className="flex items-center mb-1">
                        <div className="w-16 text-sm font-medium text-muted-foreground">
                          {getTimeString(hour)}
                        </div>
                        <div className="h-px bg-border flex-grow"></div>
                      </div>
                      
                      <div className="pl-16">
                        {events.length === 0 ? (
                          <div className="h-12 flex items-center text-sm text-muted-foreground">
                            <span className="text-xs italic">No events</span>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {events.map(event => (
                              <div 
                                key={event.id} 
                                className={cn(
                                  "p-2 rounded-md border-l-4 flex justify-between items-center",
                                  getCategoryColor(event.category || 'task')
                                )}
                              >
                                <span>{event.title}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => deleteEvent(event.id)}
                                  className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              
              {eventsForSelectedDate.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No events scheduled for this date.</p>
                  <p className="text-sm">Add an event using the form on the left.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
