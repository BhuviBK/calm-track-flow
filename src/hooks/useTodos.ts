import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

export interface Todo {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load todos from Supabase
  const loadTodos = async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTodos((data || []).map(item => ({
        ...item,
        status: item.status as 'todo' | 'in-progress' | 'done'
      })));
    } catch (error) {
      console.error('Error loading todos:', error);
      toast({
        title: "Error",
        description: "Failed to load todos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTodos();
  }, [user]);

  // Add new todo
  const addTodo = async (title: string, status: 'todo' | 'in-progress' | 'done' = 'todo') => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{
          title,
          status,
          completed: status === 'done',
          user_id: user.id
        }])
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => [{
        ...data,
        status: data.status as 'todo' | 'in-progress' | 'done'
      }, ...prev]);
      toast({
        title: "Success",
        description: "Todo added successfully",
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

  // Update todo
  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      setTodos(prev => prev.map(todo => todo.id === id ? {
        ...data,
        status: data.status as 'todo' | 'in-progress' | 'done'
      } : todo));
    } catch (error) {
      console.error('Error updating todo:', error);
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  // Delete todo
  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setTodos(prev => prev.filter(todo => todo.id !== id));
      toast({
        title: "Success",
        description: "Todo deleted successfully",
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

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    refetch: loadTodos
  };
};