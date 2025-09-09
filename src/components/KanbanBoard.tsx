import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Todo } from '@/hooks/useTodos';

interface KanbanBoardProps {
  todos: Todo[];
  onAddTodo: (title: string, status?: 'todo' | 'in-progress' | 'done') => Promise<void>;
  onUpdateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  onDeleteTodo: (id: string) => Promise<void>;
  onConfetti?: () => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ todos, onAddTodo, onUpdateTodo, onDeleteTodo, onConfetti }) => {
  const [newTaskInputs, setNewTaskInputs] = useState({
    todo: '',
    'in-progress': '',
    done: ''
  });

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-primary/20 bg-primary/5' },
    { id: 'in-progress', title: 'In Progress', color: 'border-secondary/20 bg-secondary/5' },
    { id: 'done', title: 'Done', color: 'border-green-500/20 bg-green-50 dark:bg-green-950/20' }
  ];

  const getTasksByStatus = (status: string) => {
    return todos.filter(todo => todo.status === status);
  };

  const addTask = async (status: 'todo' | 'in-progress' | 'done') => {
    const title = newTaskInputs[status].trim();
    if (!title) return;

    await onAddTodo(title, status);
    setNewTaskInputs(prev => ({ ...prev, [status]: '' }));
  };

  const moveTask = async (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    const task = todos.find(t => t.id === taskId);
    if (!task) return;
        
    // Trigger confetti if moving to done
    if (newStatus === 'done' && task.status !== 'done' && onConfetti) {
      setTimeout(onConfetti, 100);
    }
    
    await onUpdateTodo(taskId, { 
      status: newStatus, 
      completed: newStatus === 'done' 
    });
  };

  const editTask = async (taskId: string, newTitle: string) => {
    await onUpdateTodo(taskId, { title: newTitle });
  };

  const deleteTask = async (taskId: string) => {
    await onDeleteTodo(taskId);
  };

  const handleKeyPress = (e: React.KeyboardEvent, status: 'todo' | 'in-progress' | 'done') => {
    if (e.key === 'Enter') {
      addTask(status);
    }
  };

  const handleDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    // Dropped outside the list
    if (!destination) {
      return;
    }

    // Dropped in the same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Move task to new status
    const newStatus = destination.droppableId as 'todo' | 'in-progress' | 'done';
    moveTask(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
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
                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className={`min-h-[200px] space-y-3 p-2 rounded-lg transition-colors ${
                        snapshot.isDraggingOver ? 'bg-primary/10' : ''
                      }`}
                    >
                      {columnTasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging ? 'opacity-50' : ''
                              }`}
                            >
                              <TaskCard
                                task={{
                                  id: task.id,
                                  title: task.title,
                                  completed: task.completed,
                                  date: new Date(task.created_at).toISOString().split('T')[0],
                                  status: task.status
                                }}
                                onToggleComplete={(id) => {
                                  const newStatus = task.completed ? 'todo' : 'done';
                                  moveTask(id, newStatus);
                                }}
                                onEdit={editTask}
                                onDelete={deleteTask}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                
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
    </DragDropContext>
  );
};

export default KanbanBoard;