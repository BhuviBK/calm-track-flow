import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { v4 as uuidv4 } from 'uuid';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
  status?: 'todo' | 'in-progress' | 'done';
}

interface KanbanBoardProps {
  tasks: Task[];
  onTasksChange: (tasks: Task[]) => void;
  onConfetti?: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks, onTasksChange, onConfetti }) => {
  const [newTaskInputs, setNewTaskInputs] = useState({
    todo: '',
    'in-progress': '',
    done: ''
  });

  // Enhance tasks with status if not present
  const enhancedTasks = tasks.map(task => ({
    ...task,
    status: task.status || (task.completed ? 'done' : 'todo')
  }));

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-blue-200 bg-blue-50/50' },
    { id: 'in-progress', title: 'In Progress', color: 'border-yellow-200 bg-yellow-50/50' },
    { id: 'done', title: 'Done', color: 'border-green-200 bg-green-50/50' }
  ];

  const getTasksByStatus = (status: string) => {
    return enhancedTasks.filter(task => {
      if (status === 'done') return task.completed || task.status === 'done';
      if (status === 'todo') return !task.completed && (!task.status || task.status === 'todo');
      return task.status === status;
    });
  };

  const addTask = (status: 'todo' | 'in-progress' | 'done') => {
    const title = newTaskInputs[status].trim();
    if (!title) return;

    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: status === 'done',
      date: new Date().toISOString().split('T')[0],
      status: status
    };

    onTasksChange([...tasks, newTask]);
    setNewTaskInputs(prev => ({ ...prev, [status]: '' }));
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const updated = { 
          ...task, 
          status: newStatus, 
          completed: newStatus === 'done' 
        };
        
        // Trigger confetti if moving to done
        if (newStatus === 'done' && !task.completed && onConfetti) {
          setTimeout(onConfetti, 100);
        }
        
        return updated;
      }
      return task;
    });
    onTasksChange(updatedTasks);
  };

  const editTask = (taskId: string, newTitle: string) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle } : task
    );
    onTasksChange(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };

  const handleKeyPress = (e: React.KeyboardEvent, status: 'todo' | 'in-progress' | 'done') => {
    if (e.key === 'Enter') {
      addTask(status);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(column => {
        const columnTasks = getTasksByStatus(column.id);
        
        return (
          <Card key={column.id} className={`${column.color} border-2`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                {column.title}
                <span className="text-sm font-normal text-muted-foreground">
                  {columnTasks.length}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {columnTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleComplete={(id) => {
                    const currentTask = tasks.find(t => t.id === id);
                    const newStatus = currentTask?.completed ? 'todo' : 'done';
                    moveTask(id, newStatus);
                  }}
                  onEdit={editTask}
                  onDelete={deleteTask}
                />
              ))}
              
              <div className="flex gap-2">
                <Input
                  placeholder={`Add to ${column.title}...`}
                  value={newTaskInputs[column.id as keyof typeof newTaskInputs]}
                  onChange={(e) => setNewTaskInputs(prev => ({ 
                    ...prev, 
                    [column.id]: e.target.value 
                  }))}
                  onKeyPress={(e) => handleKeyPress(e, column.id as 'todo' | 'in-progress' | 'done')}
                  className="text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addTask(column.id as 'todo' | 'in-progress' | 'done')}
                  className="shrink-0 h-9 w-9 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default KanbanBoard;