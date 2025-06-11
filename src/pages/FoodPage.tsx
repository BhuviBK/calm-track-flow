
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import FoodTracker from '@/components/FoodTracker';
import FoodList from '@/components/FoodList';
import DateTracker from '@/components/DateTracker';
import { stopAllSounds } from '@/utils/audioUtils';

const FoodPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
    label: string;
  } | null>(null);

  // Clean up any playing audio when navigating to this page
  useEffect(() => {
    stopAllSounds();
  }, []);

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
        {/* Date Tracker - Full Width */}
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <DateTracker onDateRangeChange={handleDateRangeChange} />
        </div>
        
        {/* Food Tracker and Food List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <h2 className="text-xl font-semibold mb-4">Add Food</h2>
              <FoodTracker />
            </div>
          </div>
          
          <div className="lg:col-span-3 animate-fade-in" style={{ animationDelay: '400ms' }}>
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
