
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import TaskCardList from '@/components/TaskCardList';

const Index: React.FC = () => {
  const { meditationSessions, moodEntries } = useAppContext();

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome to ZenMind</h1>
        <p className="text-gray-600 dark:text-gray-300">Your daily task and wellbeing companion</p>
      </div>

      {meditationSessions.length === 0 && moodEntries.length === 0 ? (
        <div className="meditation-card">
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-gentle">
              <div className="w-16 h-16 bg-gradient-to-br from-calm-400 to-purple-400 rounded-full"></div>
            </div>
            <h2 className="text-2xl font-semibold mb-4">Begin Your Daily Tasks</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding tasks to organize your day and improve productivity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-calm-500 hover:bg-calm-600">
                <Link to="/todo">Plan Your Day</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/meditate">Take a Meditation Break</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Today's Tasks</h2>
            <Button size="sm" className="bg-calm-500 hover:bg-calm-600">
              <Link to="/todo">View All Tasks</Link>
            </Button>
          </div>
          
          <TaskCardList />
        </div>
      )}
    </Layout>
  );
};

export default Index;
