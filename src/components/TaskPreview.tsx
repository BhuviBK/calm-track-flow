import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Plus, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTodos } from '@/hooks/useTodos';

const TaskPreview: React.FC = () => {
  const { todos, loading } = useTodos();

  // Show only pending (not completed) tasks, limit to 5
  const pendingTasks = todos.filter(t => !t.completed).slice(0, 5);

  if (loading) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Loading tasks...</p>
      </Card>
    );
  }

  if (pendingTasks.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="space-y-3">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Plus className="h-6 w-6 text-primary" />
          </div>
          <p className="text-muted-foreground">No pending tasks</p>
          <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
            <Link to="/todo">Add Your First Task</Link>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {pendingTasks.map((task) => (
        <Card key={task.id} className="transition-all hover:shadow-md">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center shrink-0">
                <Circle className="h-2 w-2 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{task.title}</p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  task.status === 'in-progress' 
                    ? 'bg-secondary/20 text-secondary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {task.status === 'in-progress' ? 'In Progress' : 'To Do'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="pt-2">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/todo">View All Tasks ({todos.filter(t => !t.completed).length} pending)</Link>
        </Button>
      </div>
    </div>
  );
};

export default TaskPreview;
