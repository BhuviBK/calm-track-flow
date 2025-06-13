
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  time: string;
  completed: boolean;
}

interface TaskCardFormProps {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}

const TaskCardForm: React.FC<TaskCardFormProps> = ({ onAddTask, onCancel }) => {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      time: time || 'Anytime',
      completed: false
    };
    
    onAddTask(newTask);
    setTitle('');
    setTime('');
  };

  return (
    <Card className="animate-scale-in">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium flex items-center gap-1">
              Task Title
              <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="transition-all duration-300 focus:border-calm-400"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className="text-sm font-medium">
              Time (optional)
            </label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="transition-all duration-300 focus:border-calm-400"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="transition-colors hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-calm-500 hover:bg-calm-600 transition-colors"
          >
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskCardForm;
