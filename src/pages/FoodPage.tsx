
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import FoodTracker from '@/components/FoodTracker';
import FoodList from '@/components/FoodList';
import CalorieStreak from '@/components/CalorieStreak';
import DateTracker from '@/components/DateTracker';
import { stopAllSounds } from '@/utils/audioUtils';
import { useAppContext } from '@/contexts/AppContext';

const FoodPage: React.FC = () => {
  const { foodEntries } = useAppContext();
  const [totalCaloriesToday, setTotalCaloriesToday] = useState(0);
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
    label: string;
  } | null>(null);

  // Clean up any playing audio when navigating to this page
  useEffect(() => {
    stopAllSounds();
  }, []);

  // Calculate today's calories
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = foodEntries.filter(entry => 
      entry.date.toISOString().split('T')[0] === today
    );
    const total = todayEntries.reduce((sum, entry) => sum + (entry.calories * entry.quantity), 0);
    setTotalCaloriesToday(total);
  }, [foodEntries]);

  const handleDateRangeChange = (startDate: Date, endDate: Date, label: string) => {
    setDateRange({ startDate, endDate, label });
  };
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Calorie Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300 animate-fade-in" style={{ animationDelay: '100ms' }}>
          Track your daily food intake and monitor calories
        </p>
      </div>
      
      <div className="space-y-6">
        {/* Calorie Streak - Full Width */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <CalorieStreak totalCaloriesToday={totalCaloriesToday} />
        </div>
        
        {/* Date Tracker - Full Width */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <DateTracker onDateRangeChange={handleDateRangeChange} />
        </div>
        
        {/* Food Tracker and Food List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="text-xl font-semibold mb-4">Add Food</h2>
              <FoodTracker />
            </div>
          </div>
          
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '500ms' }}>
            <FoodList 
              startDate={dateRange?.startDate}
              endDate={dateRange?.endDate}
              periodLabel={dateRange?.label}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FoodPage;
