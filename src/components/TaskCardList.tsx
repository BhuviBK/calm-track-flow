
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

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO string date
}

interface TaskCardListProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onConfetti?: () => void;
}

const TaskCardList: React.FC<TaskCardListProps> = ({ tasks, onTasksChange, onConfetti }) => {
  const [quickAddValue, setQuickAddValue] = useState('');
  const [activeTab, setActiveTab] = useState('today');
  const { toast } = useToast();

  // Group tasks by date (today, yesterday, earlier)
  const groupedTasks = React.useMemo(() => {
    const today = new Date();
    const todayStart = startOfDay(today);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStart = startOfDay(yesterday);

    return {
      today: tasks.filter(task => {
        // If task is not completed and from the past, carry it forward to today
        if (!task.completed && isBefore(parseISO(task.date), todayStart)) {
          return true;
        }
        // Or if it's actually from today
        return task.date === today.toISOString().split('T')[0];
      }),
      yesterday: tasks.filter(task => 
        task.date === yesterday.toISOString().split('T')[0] && task.completed
      ),
      earlier: tasks.filter(task => {
        const taskDate = parseISO(task.date);
        return isBefore(taskDate, yesterdayStart) && 
               task.completed && 
               task.date !== today.toISOString().split('T')[0];
      })
    };
  }, [tasks]);

  const addQuickTask = () => {
    const title = quickAddValue.trim();
    if (!title) return;

    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      date: new Date().toISOString().split('T')[0]
    };
    
    onTasksChange([...tasks, newTask]);
    setQuickAddValue('');
    toast({
      title: "Task Added",
      description: "Your new task has been added successfully.",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(t => t.id === id);
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
    
    if (task && !task.completed) {
      if (onConfetti) {
        onConfetti();
      }
      toast({
        title: "Task Completed",
        description: "Great job on completing your task!",
      });
    }
  };

  const editTask = (id: string, newTitle: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, title: newTitle } : task
    );
    onTasksChange(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    onTasksChange(updatedTasks);
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, 'EEEE, MMMM d');
  };

  const renderTasks = (taskList: Task[]) => {
    if (taskList.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No tasks for this time period</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {taskList.map((task, index) => (
          <div key={task.id} className="relative">
            {!isToday(parseISO(task.date)) && !task.completed && (
              <div className="absolute -top-1 -right-1 z-10">
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Carried forward
                </span>
              </div>
            )}
            <TaskCard
              task={task}
              onToggleComplete={toggleTaskCompletion}
              onEdit={editTask}
              onDelete={deleteTask}
            />
          </div>
        ))}
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
          
          {renderTasks(groupedTasks.today)}
        </TabsContent>

        <TabsContent value="yesterday" className="space-y-4 mt-4">
          {renderTasks(groupedTasks.yesterday)}
        </TabsContent>

        <TabsContent value="earlier" className="space-y-4 mt-4">
          {renderTasks(groupedTasks.earlier)}
        </TabsContent>
      </Tabs>
      
    </div>
  );
};

export default TaskCardList;
