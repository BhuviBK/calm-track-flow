
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Edit, Flame } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import PomodoroTimer from '@/components/PomodoroTimer';
import ReactConfetti from 'react-confetti';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExerciseTimer from '@/components/ExerciseTimer';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');
  const [motivation, setMotivation] = useState<string>("You've got this! Complete your tasks one by one.");
  const [editingMotivation, setEditingMotivation] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { toast } = useToast();

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    
    const savedMotivation = localStorage.getItem('motivation');
    if (savedMotivation) {
      setMotivation(savedMotivation);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Save motivation to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('motivation', motivation);
  }, [motivation]);

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([
        ...todos,
        { id: Date.now(), text: newTodo, completed: false }
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo => {
        if (todo.id === id) {
          const newCompleted = !todo.completed;
          
          // Show confetti and toast if task is being completed
          if (newCompleted) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 3000);
            
            toast({
              title: "Task completed! 🔥",
              description: "Keep up the great work!",
            });
          }
          
          return { ...todo, completed: newCompleted };
        }
        return todo;
      })
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

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
      
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        
        {/* Motivation Section */}
        <Card className="border-l-4 border-l-forest-500">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Today's Motivation</CardTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setEditingMotivation(!editingMotivation)}
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
                  className="min-h-[80px]"
                />
                <Button onClick={saveMotivation} size="sm" className="bg-forest-500 hover:bg-forest-600">
                  Save
                </Button>
              </div>
            ) : (
              <p className="italic text-muted-foreground">{motivation}</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs for Pomodoro and Exercise */}
        <Tabs defaultValue="pomodoro" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="pomodoro" className="flex-1">Pomodoro Timer</TabsTrigger>
            <TabsTrigger value="exercise" className="flex-1">Exercise Timer</TabsTrigger>
          </TabsList>
          <TabsContent value="pomodoro">
            <PomodoroTimer />
          </TabsContent>
          <TabsContent value="exercise">
            <ExerciseTimer />
          </TabsContent>
        </Tabs>
        
        {/* Add Task */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter a task..."
                className="flex-1"
              />
              <Button onClick={addTodo} className="bg-forest-500 hover:bg-forest-600">Add</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            {todos.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">No tasks yet. Add some tasks to get started!</p>
            ) : (
              <ul className="space-y-2">
                {todos.map((todo) => (
                  <li
                    key={todo.id}
                    className="flex items-center justify-between p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div 
                      className="flex items-center flex-1 cursor-pointer"
                      onClick={() => toggleTodo(todo.id)}
                    >
                      <div className="mr-3">
                        <Checkbox 
                          checked={todo.completed}
                          onCheckedChange={() => toggleTodo(todo.id)}
                          className={todo.completed ? 'bg-forest-500 text-white' : ''}
                        />
                      </div>
                      <span className={todo.completed ? 'line-through text-muted-foreground flex items-center' : 'flex items-center'}>
                        {todo.text}
                        {todo.completed && (
                          <Flame className="w-4 h-4 ml-2 text-amber-500" />
                        )}
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-50 hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default TodoPage;
