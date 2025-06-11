
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth, isToday, isYesterday, isSameMonth } from 'date-fns';
import { useAppContext } from '@/contexts/AppContext';

interface DateTrackerProps {
  onDateRangeChange: (startDate: Date, endDate: Date, label: string) => void;
}

const DateTracker: React.FC<DateTrackerProps> = ({ onDateRangeChange }) => {
  const { foodEntries } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'yesterday' | 'month'>('today');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const today = new Date();
  const yesterday = subDays(today, 1);
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);

  const getCaloriesForPeriod = (startDate: Date, endDate: Date) => {
    const filteredEntries = foodEntries.filter(food => {
      const foodDate = new Date(food.date);
      return foodDate >= startDate && foodDate <= endDate;
    });
    return filteredEntries.reduce((sum, food) => sum + (food.calories * food.quantity), 0);
  };

  const todayCalories = getCaloriesForPeriod(today, today);
  const yesterdayCalories = getCaloriesForPeriod(yesterday, yesterday);
  const monthCalories = getCaloriesForPeriod(monthStart, monthEnd);

  const handlePeriodSelect = (period: 'today' | 'yesterday' | 'month') => {
    setSelectedPeriod(period);
    
    switch (period) {
      case 'today':
        onDateRangeChange(today, today, 'Today');
        break;
      case 'yesterday':
        onDateRangeChange(yesterday, yesterday, 'Yesterday');
        break;
      case 'month':
        onDateRangeChange(monthStart, monthEnd, format(currentMonth, 'MMMM yyyy'));
        break;
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = direction === 'prev' 
      ? new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      : new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
    
    setCurrentMonth(newMonth);
    
    if (selectedPeriod === 'month') {
      const newMonthStart = startOfMonth(newMonth);
      const newMonthEnd = endOfMonth(newMonth);
      onDateRangeChange(newMonthStart, newMonthEnd, format(newMonth, 'MMMM yyyy'));
    }
  };

  // Initialize with today's data
  React.useEffect(() => {
    handlePeriodSelect('today');
  }, []);

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Date Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Period Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button
            variant={selectedPeriod === 'today' ? 'default' : 'outline'}
            onClick={() => handlePeriodSelect('today')}
            className="w-full"
          >
            <div className="text-center">
              <div className="font-semibold">Today</div>
              <div className="text-sm">{todayCalories} cal</div>
            </div>
          </Button>
          
          <Button
            variant={selectedPeriod === 'yesterday' ? 'default' : 'outline'}
            onClick={() => handlePeriodSelect('yesterday')}
            className="w-full"
          >
            <div className="text-center">
              <div className="font-semibold">Yesterday</div>
              <div className="text-sm">{yesterdayCalories} cal</div>
            </div>
          </Button>
        </div>

        {/* Monthly Tracker */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="text-center">
              <div className="font-semibold">{format(currentMonth, 'MMMM yyyy')}</div>
              <div className="text-sm text-gray-600">{monthCalories} cal</div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            onClick={() => handlePeriodSelect('month')}
            className="w-full"
          >
            View Monthly Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DateTracker;
