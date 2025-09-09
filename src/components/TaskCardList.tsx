
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaskCard from './TaskCard';
import { format, isToday, isYesterday, isBefore, parseISO, startOfDay } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { v4 as uuidv4 } from 'uuid';

import { Todo } from '@/hooks/useTodos';

interface TaskCardListProps {
  todos: Todo[];
  onAddTodo: (title: string) => Promise<void>;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onConfetti?: () => void;
}

const TaskCardList: React.FC<TaskCardListProps> = ({ todos, onAddTodo, onUpdateTodo, onDeleteTodo, onConfetti }) => {
  const [quickAddValue, setQuickAddValue] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const { toast } = useToast();

  // Group todos by date (today, yesterday, earlier)
  const groupedTodos = React.useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = startOfDay(yesterday);

    return {
      today: todos.filter(todo => {
        const todoDate = parseISO(todo.created_at);
        // If todo is not completed and from the past, carry it forward to today
        if (!todo.completed && isBefore(todoDate, todayStart)) {
          return true;
        }
        // Or if it's actually from today
        return isToday(todoDate);
      }),
      yesterday: todos.filter(todo => {
        const todoDate = parseISO(todo.created_at);
        return isYesterday(todoDate) && todo.completed;
      }),
      earlier: todos.filter(todo => {
        const todoDate = parseISO(todo.created_at);
        return isBefore(todoDate, yesterdayStart) && 
               todo.completed && 
               !isToday(todoDate) && 
               !isYesterday(todoDate);
      })
    };
  }, [todos]);

  const addQuickTask = async () => {
    const title = quickAddValue.trim();
    if (!title) return;

    await onAddTodo(title);
    setQuickAddValue('');
  };

  const toggleTaskCompletion = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    
    const newCompleted = !todo.completed;
    const newStatus = newCompleted ? 'done' : 'todo';
    
    await onUpdateTodo(id, { 
      completed: newCompleted,
      status: newStatus
    });
    
    if (newCompleted && onConfetti) {
      onConfetti();
      toast({
        title: "Task Completed",
        description: "Great job on completing your task!",
      });
    }
  };

  const editTask = async (id: string, newTitle: string) => {
    await onUpdateTodo(id, { title: newTitle });
  };

  const deleteTask = async (id: string) => {
    await onDeleteTodo(id);
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'EEEE, MMMM d');
  };

  const renderTodos = (todoList: Todo[]) => {
    if (todoList.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No todos for this time period</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {todoList.map((todo, index) => {
          const todoDate = parseISO(todo.created_at);
          return (
            <div key={todo.id} className="relative">
              {!isToday(todoDate) && !todo.completed && (
                <div className="absolute -top-1 -right-1 z-10">
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Carried forward
                  </span>
                </div>
              )}
              <TaskCard
                task={{
                  id: todo.id,
                  title: todo.title,
                  completed: todo.completed,
                  date: new Date(todo.created_at).toISOString().split('T')[0],
                  status: todo.status
                }}
                onToggleComplete={toggleTaskCompletion}
                onEdit={editTask}
                onDelete={deleteTask}
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full animate-fade-in">
        <TabsList className="w-full bg-purple-100 dark:bg-purple-900/30">
          <TabsTrigger 
            value="today" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Today
          </TabsTrigger>
          <TabsTrigger 
            value="yesterday" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Yesterday
          </TabsTrigger>
          <TabsTrigger 
            value="earlier" 
            className="flex-1 data-[state=active]:bg-purple-500 data-[state=active]:text-white"
          >
            Earlier
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4 mt-4">
          {/* Quick Add Task */}
          <div className="flex gap-2">
            <Input
              placeholder="Add a new task..."
              value={quickAddValue}
              onChange={(e) => setQuickAddValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addQuickTask()}
              className="flex-1"
            />
            <Button 
              onClick={addQuickTask}
              size="sm"
              className="bg-purple-500 hover:bg-purple-600"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {renderTodos(groupedTodos.today)}
        </TabsContent>

        <TabsContent value="yesterday" className="space-y-4 mt-4">
          {renderTodos(groupedTodos.yesterday)}
        </TabsContent>

        <TabsContent value="earlier" className="space-y-4 mt-4">
          {renderTodos(groupedTodos.earlier)}
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default TaskCardList;
