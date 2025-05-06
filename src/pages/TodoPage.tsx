
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const TodoPage: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

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
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
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

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Todo List</h1>
        
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
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 ${
                        todo.completed ? 'bg-forest-500 text-white' : 'border border-forest-500'
                      }`}>
                        {todo.completed && <Check className="w-4 h-4" />}
                      </div>
                      <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                        {todo.text}
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
