import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  date?: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

const CalendarTodoPageWithSupabase: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  // Fetch todos from Supabase
  useEffect(() => {
    if (user) {
      fetchTodos();
    }
  }, [user]);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!newTodoText.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          text: newTodoText.trim(),
          completed: false,
          user_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      setTodos([data, ...todos]);
      setNewTodoText('');
      
      toast({
        title: "Todo added!",
        description: `Added "${data.text}"`,
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ completed: !todo.completed })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setTodos(todos.map(t =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setTodos(todos.filter(t => t.id !== id));
      
      toast({
        title: "Todo deleted",
        description: "Todo has been removed",
      });
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  const updateTodoText = async (id: string, newText: string) => {
    if (!newText.trim()) return;

    try {
      const { error } = await supabase
        .from('todos')
        .update({ text: newText.trim() })
        .eq('id', id)
        .eq('user_id', user?.id);

      if (error) throw error;

      setTodos(todos.map(t =>
        t.id === id ? { ...t, text: newText.trim() } : t
      ));
    } catch (error) {
      console.error('Error updating todo text:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading todos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Calendar & Todo</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border pointer-events-auto"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'None'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Todos Section */}
          <Card>
            <CardHeader>
              <CardTitle>Todo List</CardTitle>
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
                  disabled={!newTodoText.trim()}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Todos List */}
              <ScrollArea className="h-[400px]">
                {todos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No todos yet</p>
                    <p className="text-sm">Add one using the form above</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todos.map((todo) => (
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
                          onBlur={(e) => updateTodoText(todo.id, e.target.value)}
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
              {todos.length > 0 && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Total: {todos.length}</span>
                    <span>Completed: {todos.filter(t => t.completed).length}</span>
                    <span>Remaining: {todos.filter(t => !t.completed).length}</span>
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

export default CalendarTodoPageWithSupabase;