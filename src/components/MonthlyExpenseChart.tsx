import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO, addMonths, subMonths } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
const MonthlyExpenseChart: React.FC = () => {
  const {
    expenses
  } = useAppContext();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  // Filter expenses for the current month
  const monthlyExpenses = expenses.filter(expense => isWithinInterval(new Date(expense.date), {
    start: monthStart,
    end: monthEnd
  }));

  // Group expenses by day
  const expensesByDay: Record<string, number> = {};
  monthlyExpenses.forEach(expense => {
    const day = format(new Date(expense.date), 'yyyy-MM-dd');
    if (!expensesByDay[day]) {
      expensesByDay[day] = 0;
    }
    expensesByDay[day] += expense.amount;
  });

  // Create an array of all days in the month
  const allDays: string[] = [];
  let currentDate = new Date(monthStart);
  while (currentDate <= monthEnd) {
    allDays.push(format(currentDate, 'yyyy-MM-dd'));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Create chart data with all days of the month
  const chartData = allDays.map(day => ({
    date: day,
    amount: expensesByDay[day] || 0,
    displayDate: format(parseISO(day), 'MMM d')
  }));

  // Calculate total for the month
  const monthTotal = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };
  const goToNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };
  const goToCurrentMonth = () => {
    setCurrentMonth(new Date());
  };
  return <Card className="shadow-md">
      <CardHeader className="px-6">
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={goToPreviousMonth} className="h-8 w-8 p-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-xl font-semibold min-w-[160px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </h3>
          <Button variant="outline" size="sm" onClick={goToNextMonth} className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToCurrentMonth} className="text-xs h-8 ml-2">
            Today
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 border border-primary/20">
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground font-medium mb-1">Total Monthly Expense</p>
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  ₹{monthTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
        {monthlyExpenses.length === 0 ? <div className="text-center py-8 text-gray-500">
            No expenses recorded for {format(currentMonth, 'MMMM yyyy')}
          </div> : <div className="h-[300px]">
            <ChartContainer className="h-full w-full" config={{
          amount: {
            theme: {
              light: "#7e69ab",
              dark: "#9b87f5"
            }
          }
        }}>
              <AreaChart data={chartData} margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 20
          }}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="displayDate" tick={{
              fontSize: 10
            }} interval={Math.floor(chartData.length / 10)} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent formatter={value => `₹${value}`} />} />
                <Area type="monotone" dataKey="amount" stroke="var(--color-amount)" fillOpacity={1} fill="url(#colorAmount)" />
              </AreaChart>
            </ChartContainer>
          </div>}
      </CardContent>
    </Card>;
};
export default MonthlyExpenseChart;