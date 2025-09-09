import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

const TaskPreview: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      const allTasks = JSON.parse(savedTasks);
      const today = new Date().toISOString().split('T')[0];
      // Show today's tasks and incomplete tasks from previous days
      const relevantTasks = allTasks.filter((task: Task) => {
        return task.date === today || (!task.completed && task.date < today);
      }).slice(0, 3); // Limit to 3 for preview
      setTasks(relevantTasks);
    }
  }, []);

  if (tasks.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <Plus className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-muted-foreground">No tasks for today</p>
          <Button asChild size="sm" className="bg-purple-500 hover:bg-purple-600">
            <Link to="/todo">Add Your First Task</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <Card key={task.id} className={`transition-all ${task.completed ? 'bg-muted/50' : ''}`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div
                className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  task.completed 
                    ? 'bg-purple-500 border-purple-500 text-white' 
                    : 'border-gray-300'
                }`}
              >
                {task.completed && <Check className="h-3 w-3" />}
              </div>
              <p className={`text-sm flex-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                {task.title}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="pt-2">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/todo">View All Tasks</Link>
        </Button>
      </div>
    </div>
  );
};

export default TaskPreview;