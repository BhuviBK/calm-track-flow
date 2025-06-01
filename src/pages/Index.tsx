
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { Link } from 'react-router-dom';
import TaskCardList from '@/components/TaskCardList';

const Index: React.FC = () => {
  const { expenses, moodEntries } = useAppContext();
  const [isHovering, setIsHovering] = useState<string | null>(null);

  return (
    <Layout>
      <div className="mb-6 transition-all duration-500 animate-fade-in">
        <h1 className="text-3xl font-bold mb-2 animate-float">Welcome to ZenMind</h1>
        <p className="text-gray-600 dark:text-gray-300 animate-fade-in" style={{ animationDelay: '300ms' }}>
          Your daily task and expense tracker
        </p>
      </div>

      {expenses.length === 0 && moodEntries.length === 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          <div 
            className="task-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-500 transform hover:shadow-xl animate-fade-in"
            style={{ animationDelay: '400ms' }}
            onMouseEnter={() => setIsHovering('tasks')}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className="text-center py-6">
              <div className={`w-20 h-20 bg-calm-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${isHovering === 'tasks' ? 'scale-110' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-calm-400 to-purple-400 rounded-full animate-pulse-gentle"></div>
              </div>
              <h2 className="text-xl font-semibold mb-3 transition-all duration-300">Plan Your Day</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Start adding tasks to organize your day and improve productivity.
              </p>
              <Button asChild className="bg-calm-500 hover:bg-calm-600 transition-transform duration-300 hover:scale-105">
                <Link to="/todo">Add Tasks</Link>
              </Button>
            </div>
          </div>
          
          <div 
            className="expense-card bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all duration-500 transform hover:shadow-xl animate-fade-in"
            style={{ animationDelay: '600ms' }}
            onMouseEnter={() => setIsHovering('expenses')}
            onMouseLeave={() => setIsHovering(null)}
          >
            <div className="text-center py-6">
              <div className={`w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-500 ${isHovering === 'expenses' ? 'scale-110' : ''}`}>
                <div className="w-12 h-12 bg-gradient-to-br from-forest-400 to-teal-400 rounded-full animate-pulse-gentle"></div>
              </div>
              <h2 className="text-xl font-semibold mb-3 transition-all duration-300">Track Expenses</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Record your daily spending and visualize your financial habits.
              </p>
              <Button asChild className="bg-forest-500 hover:bg-forest-600 transition-transform duration-300 hover:scale-105">
                <Link to="/expense">Track Expenses</Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="flex justify-between items-center mb-4 transition-all duration-300 hover:translate-x-1">
              <h2 className="text-xl font-semibold">Today's Tasks</h2>
              <Button size="sm" className="bg-calm-500 hover:bg-calm-600 transition-transform duration-300 hover:scale-105">
                <Link to="/todo">View All Tasks</Link>
              </Button>
            </div>
            <TaskCardList />
          </div>
          
          <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <div className="flex justify-between items-center mb-4 transition-all duration-300 hover:translate-x-1">
              <h2 className="text-xl font-semibold">Recent Expenses</h2>
              <Button size="sm" className="bg-forest-500 hover:bg-forest-600 transition-transform duration-300 hover:scale-105">
                <Link to="/expense">View All Expenses</Link>
              </Button>
            </div>
            {expenses.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all duration-500 hover:shadow-lg">
                <ul className="space-y-2">
                  {expenses.slice(0, 5).map((expense, index) => (
                    <li 
                      key={expense.id} 
                      className="flex justify-between items-center border-b pb-2 transition-all duration-300 hover:bg-forest-50 dark:hover:bg-forest-900/20 p-2 rounded"
                      style={{ 
                        animationDelay: `${index * 100}ms`,
                        animation: 'fade-in 0.5s ease-out forwards'
                      }}
                    >
                      <div>
                        <span className="font-medium">{expense.category}</span>
                        <p className="text-sm text-gray-500">{expense.description || 'No description'}</p>
                      </div>
                      <span className="font-semibold">₹{expense.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-right transition-all duration-300 hover:scale-105">
                  <span className="font-bold">Total: ₹{expenses.reduce((sum, exp) => sum + exp.amount, 0).toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center transition-all duration-500 hover:shadow-lg">
                <p className="text-gray-500 mb-4">No expenses recorded yet</p>
                <Button asChild className="bg-forest-500 hover:bg-forest-600 transition-transform duration-300 hover:scale-105">
                  <Link to="/expense">Add Your First Expense</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
