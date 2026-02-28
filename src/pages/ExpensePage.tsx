
import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import ExpenseTracker from '@/components/ExpenseTracker';
import ExpenseList from '@/components/ExpenseList';
import DailyExpenseChart from '@/components/DailyExpenseChart';
import MonthlyExpenseChart from '@/components/MonthlyExpenseChart';
import { stopAllSounds } from '@/utils/audioUtils';

const ExpensePage: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    stopAllSounds();
  }, []);
  
  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 animate-fade-in">Expense Tracker</h1>
        <p className="text-muted-foreground animate-fade-in" style={{ animationDelay: '100ms' }}>
          Track your daily spending and view expense reports
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
          <ExpenseTracker />
        </div>
        
        <div className="lg:col-span-3">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
              <DailyExpenseChart />
              <div>
                <MonthlyExpenseChart currentMonth={currentMonth} setCurrentMonth={setCurrentMonth} />
              </div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <ExpenseList currentMonth={currentMonth} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ExpensePage;
