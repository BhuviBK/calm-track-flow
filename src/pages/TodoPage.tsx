
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, List, Kanban } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ReactConfetti from 'react-confetti';
import TaskCardList from '@/components/TaskCardList';
import KanbanBoard from '@/components/KanbanBoard';
import NotificationSettings from '@/components/NotificationSettings';
import { useTodos } from '@/hooks/useTodos';
import { useAuth } from '@/contexts/AuthContext';

const TodoPage: React.FC = () => {
  const [motivation, setMotivation] = useState<string>("You've got this! Complete your tasks one by one.");
  const [editingMotivation, setEditingMotivation] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
  const { todos, loading, addTodo, updateTodo, deleteTodo } = useTodos();
  const { user } = useAuth();
  const { toast } = useToast();

  // Show authentication message if not logged in
  if (!user) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Please log in to manage your todos.</p>
        </div>
      </Layout>
    );
  }

  // Load motivation from localStorage on component mount
  useEffect(() => {
    const savedMotivation = localStorage.getItem('motivation');
    if (savedMotivation) {
      setMotivation(savedMotivation);
    }
  }, []);

  // Save motivation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('motivation', motivation);
  }, [motivation]);

  // Effect for confetti display
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const saveMotivation = () => {
    setEditingMotivation(false);
    localStorage.setItem('motivation', motivation);
    toast({
      title: "Motivation updated!",
      description: "Your new motivation message has been saved.",
    });
  };

  return (
    <Layout>
      {showConfetti && <ReactConfetti recycle={false} numberOfPieces={200} />}
      
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-2xl font-bold">Todo List</h1>
        
        {/* Notification Settings */}
        <NotificationSettings />
        
        {/* Motivation Section */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Today's Motivation</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditingMotivation(!editingMotivation)}
                className="hover:animate-pulse"
              >
                <Edit className="w-4 h-4" />
                <span className="sr-only">Edit motivation</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {editingMotivation ? (
              <div className="space-y-2">
                <Textarea
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Enter your motivation for today..."
                  className="min-h-[80px] animate-fade-in"
                />
                <Button onClick={saveMotivation} size="sm" className="bg-purple-500 hover:bg-purple-600 text-white">
                  Save
                </Button>
              </div>
            ) : (
              <p className="italic text-muted-foreground">{motivation}</p>
            )}
          </CardContent>
        </Card>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg w-fit">
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2"
          >
            <List className="h-4 w-4" />
            List View
          </Button>
          <Button
            variant={viewMode === 'kanban' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('kanban')}
            className="flex items-center gap-2"
          >
            <Kanban className="h-4 w-4" />
            Kanban Board
          </Button>
        </div>

        {/* Task Views */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading todos...</p>
          </div>
        ) : viewMode === 'list' ? (
          <TaskCardList 
            todos={todos}
            onAddTodo={addTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            onConfetti={() => setShowConfetti(true)} 
          />
        ) : (
          <KanbanBoard 
            todos={todos}
            onAddTodo={addTodo}
            onUpdateTodo={updateTodo}
            onDeleteTodo={deleteTodo}
            onConfetti={() => setShowConfetti(true)}
          />
        )}
      </div>
    </Layout>
  );
};

export default TodoPage;
