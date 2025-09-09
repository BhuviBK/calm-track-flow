
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface TaskCardFormProps {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}

const TaskCardForm: React.FC<TaskCardFormProps> = ({ onAddTask, onCancel }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    const newTask: Task = {
      id: uuidv4(),
      title: title.trim(),
      completed: false
    };
    
    onAddTask(newTask);
    setTitle('');
  };

  return (
    <Card className="animate-scale-in">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="text-lg">Add New Task</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="transition-all duration-300 focus:border-purple-400 text-base"
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
            className="bg-purple-500 hover:bg-purple-600 transition-colors"
          >
            Add Task
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default TaskCardForm;
