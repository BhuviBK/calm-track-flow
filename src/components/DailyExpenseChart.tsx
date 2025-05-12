
import React from 'react';
import { format, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

interface ExpenseData {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
}

const DailyExpenseChart: React.FC = () => {
  const { expenses } = useAppContext();
  
  // Get today's expenses
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  const todayExpenses = expenses.filter(expense => 
    isWithinInterval(new Date(expense.date), {
      start: todayStart,
      end: todayEnd
    })
  );
  
  // Group expenses by category for today
  const expensesByCategory = todayExpenses.reduce((acc: Record<string, number>, expense) => {
    const { category, amount } = expense;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += amount;
    return acc;
  }, {});
  
  // Create chart data
  const chartData = Object.entries(expensesByCategory).map(([category, amount]) => ({
    category,
    amount,
  }));
  
  // Calculate total for today
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Today's Expenses</span>
          <span className="text-xl">${todayTotal.toFixed(2)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No expenses recorded today
          </div>
        ) : (
          <div className="h-[300px]">
            <ChartContainer
              className="h-full w-full"
              config={{
                amount: {
                  theme: {
                    light: "#4a85d3",
                    dark: "#7e69ab"
                  }
                }
              }}
            >
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="category" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent labelKey="category" />} />
                <Bar dataKey="amount" name="Amount" fill="var(--color-amount)" />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyExpenseChart;
