import React, { useState } from 'react';
import { format, isSameDay } from 'date-fns';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date: Date;
}

const CalendarTodoPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const { toast } = useToast();

  const addTodo = () => {
    if (newTodoText.trim() !== '' && selectedDate) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: newTodoText.trim(),
        completed: false,
        date: selectedDate,
      };
      
      setTodos([...todos, newTodo]);
      setNewTodoText('');
      
      toast({
        title: "Todo added!",
        description: `Added "${newTodo.text}" for ${format(selectedDate, 'MMMM d, yyyy')}`,
      });
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const updateTodoText = (id: string, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Get todos for the selected date
  const todosForSelectedDate = selectedDate 
    ? todos.filter(todo => isSameDay(todo.date, selectedDate))
    : [];

  // Get dates that have todos for calendar highlighting
  const datesWithTodos = todos.reduce((acc, todo) => {
    const dateKey = format(todo.date, 'yyyy-MM-dd');
    acc[dateKey] = (acc[dateKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Todo Calendar</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                  modifiers={{
                    hasTodos: (date) => {
                      const dateKey = format(date, 'yyyy-MM-dd');
                      return !!datesWithTodos[dateKey];
                    }
                  }}
                  modifiersStyles={{
                    hasTodos: { 
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      color: 'hsl(var(--primary))',
                      fontWeight: 'bold'
                    }
                  }}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Dates with todos are highlighted
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Todos Section */}
          <Card>
            <CardHeader>
              <CardTitle>
                Todos for {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Selected Date'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add Todo Form */}
              <div className="flex gap-2 mb-4">
                <Input
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Add a new todo..."
                  className="flex-1"
                />
                <Button 
                  onClick={addTodo}
                  disabled={!newTodoText.trim() || !selectedDate}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Todos List */}
              <ScrollArea className="h-[400px]">
                {todosForSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No todos for this date</p>
                    <p className="text-sm">Add one using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todosForSelectedDate.map((todo) => (
                      <div 
                        key={todo.id} 
                        className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                      >
                        <Checkbox
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                        />
                        
                        <Input
                          value={todo.text}
                          onChange={(e) => updateTodoText(todo.id, e.target.value)}
                          className={`flex-1 border-none bg-transparent p-0 focus-visible:ring-0 ${
                            todo.completed 
                              ? 'line-through text-muted-foreground' 
                              : ''
                          }`}
                        />
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTodo(todo.id)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Stats */}
              {todosForSelectedDate.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Total: {todosForSelectedDate.length}</span>
                    <span>Completed: {todosForSelectedDate.filter(t => t.completed).length}</span>
                    <span>Remaining: {todosForSelectedDate.filter(t => !t.completed).length}</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarTodoPage;