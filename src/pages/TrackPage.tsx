
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import MoodTracker from '@/components/MoodTracker';
import MoodChart from '@/components/MoodChart';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { stopAllSounds } from '@/utils/audioUtils';

const TrackPage: React.FC = () => {
  const { moodEntries, addMoodEntry } = useAppContext();
  
  const handleMoodSubmit = (moodData: { date: Date; mood: number; note: string }) => {
    addMoodEntry(moodData);
    toast.success('Mood tracked successfully!');
  };

  // Clean up any playing audio when navigating to this page
  useEffect(() => {
    stopAllSounds();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mood Tracking</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Monitor your emotional wellbeing by tracking your daily mood
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Today's Mood</h2>
          <MoodTracker onMoodSubmit={handleMoodSubmit} />
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Mood History</h2>
          <MoodChart moodData={moodEntries} />
        </div>
      </div>
    </Layout>
  );
};

export default TrackPage;
