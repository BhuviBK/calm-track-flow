
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import FoodTracker from '@/components/FoodTracker';
import FoodList from '@/components/FoodList';
import { stopAllSounds } from '@/utils/audioUtils';

const FoodPage: React.FC = () => {
  // Clean up any playing audio when navigating to this page
  useEffect(() => {
    stopAllSounds();
  }, []);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Food Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Track your daily food intake and monitor calories
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold mb-4">Add Food</h2>
          <FoodTracker />
        </div>
        
        <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <FoodList />
        </div>
      </div>
    </Layout>
  );
};

export default FoodPage;
