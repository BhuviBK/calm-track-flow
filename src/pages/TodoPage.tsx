
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import ReactConfetti from 'react-confetti';
import TaskCardList from '@/components/TaskCardList';

const TodoPage: React.FC = () => {
  const [motivation, setMotivation] = useState<string>("You've got this! Complete your tasks one by one.");
  const [editingMotivation, setEditingMotivation] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const { toast } = useToast();

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
        
        {/* Motivation Section */}
        <Card className="border-l-4 border-l-forest-500">
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
                <Button onClick={saveMotivation} size="sm" className="bg-forest-500 hover:bg-forest-600">
                  Save
                </Button>
              </div>
            ) : (
              <p className="italic text-muted-foreground">{motivation}</p>
            )}
          </CardContent>
        </Card>

        {/* Task Card List */}
        <TaskCardList onConfetti={() => setShowConfetti(true)} />
      </div>
    </Layout>
  );
};

export default TodoPage;
