
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TaskCardForm from './TaskCardForm';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

const TaskCardList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  // Save tasks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    setShowForm(false);
    toast({
      title: "Task Added",
      description: "Your new task has been added successfully.",
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  return (
    <div className="space-y-4">
      {tasks.length === 0 && !showForm ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No tasks added yet</p>
          <Button onClick={() => setShowForm(true)} className="bg-calm-500 hover:bg-calm-600">
            Add Your First Task
          </Button>
        </div>
      ) : (
        <>
          {tasks.map((task) => (
            <Card key={task.id} className={`${task.completed ? 'bg-gray-50 dark:bg-gray-800/50' : ''}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between text-lg">
                  <span className={task.completed ? 'line-through text-gray-500' : ''}>
                    {task.title}
                  </span>
                  <div className="flex items-center text-sm font-normal text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {task.time}
                  </div>
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
                    <Label htmlFor={`completed-${task.id}`}>Mark as done</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
          
          {!showForm && (
            <Card className="border-dashed border-2 hover:border-calm-300 cursor-pointer"
                  onClick={() => setShowForm(true)}>
              <CardContent className="flex items-center justify-center py-6">
                <Button variant="ghost" className="flex items-center gap-2">
                  <Plus className="h-5 w-5" /> Add New Task
                </Button>
              </CardContent>
            </Card>
          )}
        </>
      )}
      
      {showForm && (
        <TaskCardForm 
          onAddTask={addTask}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default TaskCardList;
