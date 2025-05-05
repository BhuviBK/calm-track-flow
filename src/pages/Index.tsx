
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import MeditationStats from '@/components/MeditationStats';
import MoodChart from '@/components/MoodChart';
import { Link } from 'react-router-dom';

const Index: React.FC = () => {
  const { meditationSessions, moodEntries } = useAppContext();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to ZenMind</h1>
        <p className="text-gray-600 dark:text-gray-300">Your meditation and mood tracking companion</p>
      </div>

      {meditationSessions.length === 0 && moodEntries.length === 0 ? (
        <div className="meditation-card">
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-gentle">
              <div className="w-16 h-16 bg-gradient-to-br from-calm-400 to-purple-400 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Begin Your Mindfulness Journey</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start tracking your daily mood and meditation sessions to improve your mental wellbeing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-calm-500 hover:bg-calm-600">
                <Link to="/meditate">Start Meditating</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/track">Track Your Mood</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Meditation Progress</h2>
            <MeditationStats sessions={meditationSessions} />
            <div className="mt-4">
              <Button asChild className="w-full bg-calm-500 hover:bg-calm-600">
                <Link to="/meditate">Meditate Now</Link>
              </Button>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Mood Tracking</h2>
            <MoodChart moodData={moodEntries} />
            <div className="mt-4">
              <Button asChild className="w-full" variant="outline">
                <Link to="/track">Track Today's Mood</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
