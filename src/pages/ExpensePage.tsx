
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import ExpenseTracker from '@/components/ExpenseTracker';
import ExpenseList from '@/components/ExpenseList';
import DailyExpenseChart from '@/components/DailyExpenseChart';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import { stopAllSounds } from '@/utils/audioUtils';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';

const ExpensePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, addUserHistory } = useAppContext();
  
  // Clean up any playing audio when navigating to this page
  useEffect(() => {
    stopAllSounds();
  }, []);
  
  // Check if user is logged in and track history
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    addUserHistory({
      page: "Expenses",
      action: "Viewed expense tracking page",
      timestamp: new Date()
    });
  }, [currentUser, navigate, addUserHistory]);
  
  if (!currentUser) {
    return null; // Will redirect via the useEffect
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Expense Tracker</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track your daily spending and view expense reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <ExpenseTracker />
        </div>
        
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <DailyExpenseChart />
              <div>
                <MonthlyExpenseChart />
              </div>
            </div>
            <ExpenseList />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpensePage;
