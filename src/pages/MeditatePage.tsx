
import React from 'react';
import Layout from '@/components/Layout';
import MeditationTimer from '@/components/MeditationTimer';
import BreathingExercise from '@/components/BreathingExercise';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';

const MeditatePage: React.FC = () => {
  const { addMeditationSession } = useAppContext();
  
  const handleMeditationComplete = (duration: number) => {
    const newSession = {
      date: new Date(),
      duration,
    };
    
    addMeditationSession(newSession);
    toast.success(`Meditation session (${duration} minutes) recorded!`);
  };

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Meditation</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Take a moment to relax and focus on your breath
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Timer</h2>
          <MeditationTimer />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Breathing Exercise</h2>
          <BreathingExercise />
        </div>
      </div>
      
      <div className="mt-8">
        <div className="meditation-card">
          <h2 className="text-xl font-semibold mb-4">Meditation Tips</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">Find a comfortable position</h3>
              <p className="text-sm text-gray-600">
                Sit in a position that allows you to be both comfortable and alert. 
                You can sit on a chair, cushion, or meditation bench.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Focus on your breath</h3>
              <p className="text-sm text-gray-600">
                Pay attention to the sensation of your breath as it enters and leaves your body.
                Notice the rising and falling of your abdomen or chest.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">When your mind wanders</h3>
              <p className="text-sm text-gray-600">
                Your mind will naturally wander. When you notice this happening, 
                gently bring your attention back to your breath without judgment.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Start small</h3>
              <p className="text-sm text-gray-600">
                Begin with just 5 minutes per day and gradually increase your meditation time
                as you become more comfortable with the practice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MeditatePage;
