
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import ExpenseTracker from '@/components/ExpenseTracker';
import ExpenseList from '@/components/ExpenseList';
import DailyExpenseChart from '@/components/DailyExpenseChart';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import { stopAllSounds } from '@/utils/audioUtils';

const ExpensePage: React.FC = () => {
  // Clean up any playing audio when navigating to this page
  useEffect(() => {
    stopAllSounds();
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your daily spending and view expense reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <ExpenseTracker />
        </div>
        
        <div className="md:col-span-2">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Your Expenses</h2>
            <DailyExpenseChart />
            <MonthlyExpenseChart />
            <ExpenseList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpensePage;
