
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaskCardForm from './TaskCardForm';
import { format, isToday, isYesterday, isBefore, parseISO, startOfDay } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string; // ISO string date
}

interface TaskCardListProps {
  onConfetti?: () => void;
}

const TaskCardList: React.FC<TaskCardListProps> = ({ onConfetti }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks).map((task: any) => ({
      ...task,
      // Ensure all tasks have a date property, default to today for old tasks
      date: task.date || new Date().toISOString().split('T')[0]
    })) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('today');
  const { toast } = useToast();

  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const addTask = (newTask: Omit<Task, 'date'>) => {
    const taskWithDate = {
      ...newTask,
      date: new Date().toISOString().split('T')[0] // Add today's date
    };
    
    setTasks([...tasks, taskWithDate as Task]);
    setShowForm(false);
    toast({
      title: "Task Added",
      description: "Your new task has been added successfully.",
      className: "animate-fade-in",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    // Show toast for completed task
    const task = tasks.find(t => t.id === id);
    if (task && !task.completed) {
      // Trigger confetti if a task is completed
      if (onConfetti) {
        onConfetti();
      }
      
      toast({
        title: "Task Completed",
        description: "Great job on completing your task!",
        className: "animate-fade-in",
      });
    }
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
        <div className="text-center py-8 animate-fade-in">
          <p className="text-gray-500 mb-4">No tasks for this time period</p>
        </div>
      );
    }

    return taskList.map((task, index) => (
      <Card 
        key={task.id} 
        className={`${task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:border-calm-300'} 
                    transition-all duration-300 animate-fade-in`}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardHeader className="pb-2">
          <CardTitle className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-lg">
            <span className={`${task.completed ? 'line-through text-gray-500' : ''} break-words`}>
              {task.title}
            </span>
            {!isToday(parseISO(task.date)) && !task.completed && (
              <span className="text-amber-500 flex items-center gap-1 text-sm font-normal self-start sm:self-center">
                <CalendarIcon className="h-3 w-3 flex-shrink-0" /> 
                <span className="whitespace-nowrap">Carried forward</span>
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue={task.completed ? "completed" : "pending"} className="flex">
            <div className="flex items-center space-x-2">
              <RadioGroupItem 
                value="completed" 
                id={`completed-${task.id}`}
                checked={task.completed}
                onClick={() => toggleTaskCompletion(task.id)}
              />
              <Label htmlFor={`completed-${task.id}`} className="text-sm sm:text-base">
                Mark as done
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>
    ));
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
          {renderTasks(groupedTasks.today)}
          
          {!showForm && (
            <Card className="border-dashed border-2 hover:border-calm-300 cursor-pointer animate-fade-in"
                  onClick={() => setShowForm(true)}>
              <CardContent className="flex items-center justify-center py-6">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Add New Task
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="yesterday" className="space-y-4 mt-4">
          {renderTasks(groupedTasks.yesterday)}
        </TabsContent>

        <TabsContent value="earlier" className="space-y-4 mt-4">
          {renderTasks(groupedTasks.earlier)}
        </TabsContent>
      </Tabs>
      
      {showForm && (
        <div className="animate-fade-in">
          <TaskCardForm 
            onAddTask={addTask}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}
    </div>
  );
};

export default TaskCardList;
